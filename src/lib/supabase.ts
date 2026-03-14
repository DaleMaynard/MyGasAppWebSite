/**
 * Supabase Client for Web Dashboard
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export interface Station {
  id: string;
  name: string;
  brand: string | null;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  // Combined prices (latest from any source - for filtering/sorting)
  regular_price: number | null;
  midgrade_price: number | null;
  premium_price: number | null;
  diesel_price: number | null;
  e85_price: number | null;
  // User-submitted prices (scanner_receipt, scanner_sign) - 3 decimal precision
  user_regular_price: number | null;
  user_midgrade_price: number | null;
  user_premium_price: number | null;
  user_diesel_price: number | null;
  user_price_updated_at: string | null;
  // Web-scraped prices (web_scan) - 2 decimal precision
  web_regular_price: number | null;
  web_midgrade_price: number | null;
  web_premium_price: number | null;
  web_diesel_price: number | null;
  web_price_updated_at: string | null;
  price_updated_at: string | null;
  distance_miles: number;
  source: 'user' | 'web_scan' | 'google' | string;
  report_source: string | null;
  amenities: Record<string, boolean> | null;
}

/**
 * Get nearby stations with prices - queries stations with price_reports join
 * to get report_source for categorization
 */
export async function getNearbyStations(
  latitude: number,
  longitude: number,
  radiusMiles: number = 10
): Promise<Station[]> {
  if (!isSupabaseConfigured()) {
    console.log('[Supabase] Not configured');
    return [];
  }

  console.log(`[Supabase] Fetching stations near ${latitude.toFixed(4)}, ${longitude.toFixed(4)} within ${radiusMiles} miles`);

  // Calculate bounding box
  const latDelta = radiusMiles / 69;
  const lngDelta = radiusMiles / (69 * Math.cos(latitude * Math.PI / 180));

  // Query stations with price_reports join to get report_source
  const { data, error } = await supabase
    .from('stations')
    .select(`
      id,
      name,
      brand,
      address,
      city,
      state,
      zip_code,
      latitude,
      longitude,
      is_truck_stop,
      amenities,
      source,
      price_reports (
        regular_price,
        midgrade_price,
        premium_price,
        diesel_price,
        report_source,
        created_at
      )
    `)
    .gte('latitude', latitude - latDelta)
    .lte('latitude', latitude + latDelta)
    .gte('longitude', longitude - lngDelta)
    .lte('longitude', longitude + lngDelta)
    .order('created_at', { referencedTable: 'price_reports', ascending: false })
    .limit(500);

  if (error) {
    console.error('[Supabase] Query error:', error);
    return [];
  }

  console.log(`[Supabase] Query returned ${data?.length || 0} stations`);
  console.log(`[Supabase] User coords for distance calc: ${latitude}, ${longitude}`);

  // Calculate distances and extract latest prices with report_source
  const stationsWithDistance = (data || []).map((s: any) => {
    const R = 3959; // Earth radius in miles
    const dLat = ((s.latitude - latitude) * Math.PI) / 180;
    const dLon = ((s.longitude - longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((latitude * Math.PI) / 180) *
        Math.cos((s.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    console.log(`[Supabase] Station ${s.name}: (${s.latitude}, ${s.longitude}) -> ${distance.toFixed(2)} mi`);

    // Get the most recent price report (for overall sorting/filtering)
    const latestPrice = s.price_reports?.[0] || {};
    
    // Separate user-submitted vs web-scraped prices
    const userReports = (s.price_reports || []).filter(
      (r: any) => r.report_source === 'scanner_receipt' || r.report_source === 'scanner_sign'
    );
    const webReports = (s.price_reports || []).filter(
      (r: any) => r.report_source === 'web_scan'
    );
    
    // Get latest from each source (already sorted by created_at desc)
    const latestUserPrice = userReports[0] || {};
    const latestWebPrice = webReports[0] || {};
    
    // Debug logging for dual prices
    if (userReports.length > 0 || webReports.length > 0) {
      console.log(`[DEBUG] ${s.name}: user_regular=$${latestUserPrice.regular_price || 'N/A'}, web_regular=$${latestWebPrice.regular_price || 'N/A'}`);
    }
    
    // Determine source: use report_source if available, otherwise station source
    const reportSource = latestPrice.report_source || null;
    const stationSource = s.source || 'unknown';

    return {
      id: s.id,
      name: s.name,
      brand: s.brand,
      address: s.address,
      city: s.city,
      state: s.state,
      zip_code: s.zip_code,
      latitude: s.latitude,
      longitude: s.longitude,
      is_truck_stop: s.is_truck_stop,
      amenities: s.amenities,
      source: stationSource,
      report_source: reportSource,
      distance_miles: distance,
      // Combined prices (latest from any source)
      regular_price: latestPrice.regular_price || null,
      midgrade_price: latestPrice.midgrade_price || null,
      premium_price: latestPrice.premium_price || null,
      diesel_price: latestPrice.diesel_price || null,
      e85_price: null,
      // User-submitted prices (3 decimal)
      user_regular_price: latestUserPrice.regular_price || null,
      user_midgrade_price: latestUserPrice.midgrade_price || null,
      user_premium_price: latestUserPrice.premium_price || null,
      user_diesel_price: latestUserPrice.diesel_price || null,
      user_price_updated_at: latestUserPrice.created_at || null,
      // Web-scraped prices (2 decimal)
      web_regular_price: latestWebPrice.regular_price || null,
      web_midgrade_price: latestWebPrice.midgrade_price || null,
      web_premium_price: latestWebPrice.premium_price || null,
      web_diesel_price: latestWebPrice.diesel_price || null,
      web_price_updated_at: latestWebPrice.created_at || null,
      price_updated_at: latestPrice.created_at || null,
    };
  });

  console.log('[Supabase] Sample processed station:', JSON.stringify(stationsWithDistance[0], null, 2));
  console.log('[Supabase] Sources found:', [...new Set(stationsWithDistance.map((s: any) => `${s.source}/${s.report_source}`))]);

  return stationsWithDistance.sort((a, b) => a.distance_miles - b.distance_miles);
}

/**
 * Get web-scanned stations only
 */
export async function getWebScannedStations(
  latitude: number,
  longitude: number,
  radiusMiles: number = 10
): Promise<Station[]> {
  const allStations = await getNearbyStations(latitude, longitude, radiusMiles);
  return allStations.filter((s) => s.source === 'web_scan');
}

/**
 * Get user-submitted stations only
 */
export async function getUserStations(
  latitude: number,
  longitude: number,
  radiusMiles: number = 10
): Promise<Station[]> {
  const allStations = await getNearbyStations(latitude, longitude, radiusMiles);
  return allStations.filter((s) => s.source === 'user');
}
