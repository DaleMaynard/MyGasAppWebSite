'use client';

import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────

export interface PriceChangeDataPoint {
  date: string;           // YYYY-MM-DD
  avgRegular: number | null;
  avgMidgrade: number | null;
  avgPremium: number | null;
  avgDiesel: number | null;
  totalChanges: number;
  stationsScanned: number;
}

export interface FuelChangeCounts {
  regular: number;
  midgrade: number;
  premium: number;
  diesel: number;
}

export interface StationPrice {
  stationId: string;
  stationName: string;
  stationBrand: string;
  stationAddress: string | null;
  stationCity: string;
  stationState: string;
  regularPrice: number | null;
  midgradePrice: number | null;
  premiumPrice: number | null;
  dieselPrice: number | null;
  priceUpdatedAt: string;
  priceChange: number | null;      // most recent change amount (any fuel)
  percentageChange: number | null;  // most recent % change
  changeCounts: FuelChangeCounts;   // number of price changes per fuel grade
  totalChanges: number;             // sum of all grade changes
}

export interface DashboardSummary {
  totalStations: number;
  totalChangesToday: number;
  avgRegular: number | null;
  avgMidgrade: number | null;
  avgPremium: number | null;
  avgDiesel: number | null;
  lowestPrice: number | null;
  highestPrice: number | null;
  priceSpread: number | null;
  lastRunTimestamp: string | null;
}

interface UsePriceChangeDataOptions {
  timeRange: '7d' | '30d';
}

const DAYS_MAP = { '7d': 7, '30d': 30 };

// ─── Main Hook ───────────────────────────────────────────────────────

/**
 * Unified hook for the scaled-down analytics dashboard.
 * Pulls ALL data from price_change_detection + price_change_detection_details — 
 * the same tables written by scripts/check-price-changes.js --apply.
 */
export function usePriceChangeData({ timeRange }: UsePriceChangeDataOptions) {
  return useQuery({
    queryKey: ['priceChangeData', timeRange],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        console.warn('[usePriceChangeData] Supabase not configured');
        return { trendData: [], stations: [], summary: emptySummary() };
      }

      const days = DAYS_MAP[timeRange];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString();

      console.log(`[usePriceChangeData] Fetching ${timeRange} (${days} days) from ${startDateStr}`);

      try {
        // ── 1. Fetch detection runs (summary rows) ──
        const { data: runs, error: runsError } = await supabase
          .from('price_change_detection')
          .select('id, run_timestamp, total_scanned, total_changed, total_unchanged, total_errors, has_large_changes, large_change_count')
          .gte('run_timestamp', startDateStr)
          .order('run_timestamp', { ascending: true });

        if (runsError) {
          console.error('[usePriceChangeData] Error fetching runs:', runsError);
          throw runsError;
        }

        console.log(`[usePriceChangeData] Found ${runs?.length ?? 0} detection runs`);

        // ── 2. Fetch all detail rows with station joins ──
        const { data: details, error: detailsError } = await supabase
          .from('price_change_detection_details')
          .select(`
            id, detection_id, station_id, price_type, old_price, new_price,
            price_change, percentage_change, is_large_change, created_at,
            stations:station_id ( id, name, brand, address, city, state )
          `)
          .gte('created_at', startDateStr)
          .order('created_at', { ascending: true });

        if (detailsError) {
          console.error('[usePriceChangeData] Error fetching details:', detailsError);
          throw detailsError;
        }

        console.log(`[usePriceChangeData] Found ${details?.length ?? 0} detail rows`);

        // ── 3. Build trend data (daily aggregations) ──
        const trendData = buildTrendData(runs ?? [], details ?? []);

        // ── 4. Build station list (latest prices per station) ──
        const stations = buildStationList(details ?? []);

        // ── 5. Build summary KPIs ──
        const summary = buildSummary(runs ?? [], details ?? [], stations);

        console.log(`[usePriceChangeData] Result: ${trendData.length} trend days, ${stations.length} stations`);

        return { trendData, stations, summary };
      } catch (error) {
        console.error('[usePriceChangeData] Fatal error:', error);
        return { trendData: [], stations: [], summary: emptySummary() };
      }
    },
    staleTime: 5 * 60 * 1000,  // 5 min
    gcTime: 30 * 60 * 1000,    // 30 min
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────

function emptySummary(): DashboardSummary {
  return {
    totalStations: 0,
    totalChangesToday: 0,
    avgRegular: null,
    avgMidgrade: null,
    avgPremium: null,
    avgDiesel: null,
    lowestPrice: null,
    highestPrice: null,
    priceSpread: null,
    lastRunTimestamp: null,
  };
}

/**
 * Aggregate detection runs + details into daily data points for trend charts.
 * Each day gets the average new_price per fuel type across all stations that changed.
 */
function buildTrendData(runs: any[], details: any[]): PriceChangeDataPoint[] {
  // Group details by date
  const dayMap = new Map<string, {
    regular: number[];
    midgrade: number[];
    premium: number[];
    diesel: number[];
    changes: number;
    scanned: number;
  }>();

  // First, seed days from runs (so we have stationsScanned even with 0 changes)
  for (const run of runs) {
    const date = new Date(run.run_timestamp).toISOString().split('T')[0];
    const existing = dayMap.get(date);
    if (existing) {
      existing.scanned = Math.max(existing.scanned, run.total_scanned ?? 0);
    } else {
      dayMap.set(date, {
        regular: [], midgrade: [], premium: [], diesel: [],
        changes: 0, scanned: run.total_scanned ?? 0,
      });
    }
  }

  // Add detail prices into the correct day bucket
  for (const d of details) {
    const date = new Date(d.created_at).toISOString().split('T')[0];
    if (!dayMap.has(date)) {
      dayMap.set(date, { regular: [], midgrade: [], premium: [], diesel: [], changes: 0, scanned: 0 });
    }
    const bucket = dayMap.get(date)!;
    const price = d.new_price ?? d.old_price;
    if (price && price > 0) {
      const fuelType = (d.price_type ?? '').toLowerCase();
      if (fuelType === 'regular') bucket.regular.push(price);
      else if (fuelType === 'midgrade') bucket.midgrade.push(price);
      else if (fuelType === 'premium') bucket.premium.push(price);
      else if (fuelType === 'diesel') bucket.diesel.push(price);
    }
    bucket.changes += 1;
  }

  // Convert to sorted array
  const result: PriceChangeDataPoint[] = [];
  for (const [date, bucket] of dayMap.entries()) {
    result.push({
      date,
      avgRegular: avg(bucket.regular),
      avgMidgrade: avg(bucket.midgrade),
      avgPremium: avg(bucket.premium),
      avgDiesel: avg(bucket.diesel),
      totalChanges: bucket.changes,
      stationsScanned: bucket.scanned,
    });
  }
  result.sort((a, b) => a.date.localeCompare(b.date));
  return result;
}

/**
 * Build a list of unique stations with their latest prices from detection details.
 */
function buildStationList(details: any[]): StationPrice[] {
  // Track latest detail per station per fuel type
  const stationMap = new Map<string, {
    meta: any;
    latestByFuel: Record<string, any>;
    biggestChange: { change: number; pct: number } | null;
    latestTimestamp: string;
    fuelChangeCounts: FuelChangeCounts;
  }>();

  for (const d of details) {
    const sid = d.station_id;
    const station = (d as any).stations;
    if (!station) continue;

    if (!stationMap.has(sid)) {
      stationMap.set(sid, {
        meta: station,
        latestByFuel: {},
        biggestChange: null,
        latestTimestamp: d.created_at,
        fuelChangeCounts: { regular: 0, midgrade: 0, premium: 0, diesel: 0 },
      });
    }

    const entry = stationMap.get(sid)!;
    const fuelType = (d.price_type ?? '').toLowerCase();

    // Count changes per fuel grade
    if (fuelType === 'regular') entry.fuelChangeCounts.regular += 1;
    else if (fuelType === 'midgrade') entry.fuelChangeCounts.midgrade += 1;
    else if (fuelType === 'premium') entry.fuelChangeCounts.premium += 1;
    else if (fuelType === 'diesel') entry.fuelChangeCounts.diesel += 1;

    // Keep the latest row per fuel type
    const existing = entry.latestByFuel[fuelType];
    if (!existing || new Date(d.created_at) > new Date(existing.created_at)) {
      entry.latestByFuel[fuelType] = d;
    }

    // Track the biggest absolute change
    if (d.price_change != null) {
      const absChange = Math.abs(d.price_change);
      if (!entry.biggestChange || absChange > Math.abs(entry.biggestChange.change)) {
        entry.biggestChange = { change: d.price_change, pct: d.percentage_change ?? 0 };
      }
    }

    // Track latest timestamp
    if (d.created_at > entry.latestTimestamp) {
      entry.latestTimestamp = d.created_at;
    }
  }

  const stations: StationPrice[] = [];
  for (const [sid, entry] of stationMap.entries()) {
    const { meta, latestByFuel, biggestChange, latestTimestamp, fuelChangeCounts } = entry;
    const totalChanges = fuelChangeCounts.regular + fuelChangeCounts.midgrade + fuelChangeCounts.premium + fuelChangeCounts.diesel;
    console.log(`[StationChanges] ${sid} ${meta.name}: R:${fuelChangeCounts.regular} M:${fuelChangeCounts.midgrade} P:${fuelChangeCounts.premium} D:${fuelChangeCounts.diesel} = ${totalChanges}`);
    stations.push({
      stationId: sid,
      stationName: meta.name ?? 'Unknown',
      stationBrand: meta.brand ?? 'Unknown',
      stationAddress: meta.address ?? null,
      stationCity: meta.city ?? '',
      stationState: meta.state ?? '',
      regularPrice: latestByFuel['regular']?.new_price ?? null,
      midgradePrice: latestByFuel['midgrade']?.new_price ?? null,
      premiumPrice: latestByFuel['premium']?.new_price ?? null,
      dieselPrice: latestByFuel['diesel']?.new_price ?? null,
      priceUpdatedAt: latestTimestamp,
      priceChange: biggestChange?.change ?? null,
      percentageChange: biggestChange?.pct ?? null,
      changeCounts: fuelChangeCounts,
      totalChanges,
    });
  }

  // Sort by station name
  stations.sort((a, b) => a.stationName.localeCompare(b.stationName));
  return stations;
}

/**
 * Build the summary KPIs for the dashboard header.
 */
function buildSummary(runs: any[], details: any[], stations: StationPrice[]): DashboardSummary {
  // Latest run timestamp
  const sortedRuns = [...runs].sort((a, b) => 
    new Date(b.run_timestamp).getTime() - new Date(a.run_timestamp).getTime()
  );
  const lastRun = sortedRuns[0] ?? null;

  // Today's changes — use Central Time (UTC-6) to match when the script runs
  const now = new Date();
  const centralOffset = -6; // CST (UTC-6)
  const centralNow = new Date(now.getTime() + centralOffset * 60 * 60 * 1000);
  const today = centralNow.toISOString().split('T')[0];
  console.log(`[buildSummary] UTC now: ${now.toISOString()}, Central date: ${today}`);
  
  // Match details by their date in Central time too
  const todayDetails = details.filter(d => {
    const detailDate = new Date(new Date(d.created_at).getTime() + centralOffset * 60 * 60 * 1000);
    return detailDate.toISOString().split('T')[0] === today;
  });
  console.log(`[buildSummary] Found ${todayDetails.length} changes for ${today}`);

  // All regular prices across all stations
  const allRegular = stations.map(s => s.regularPrice).filter((p): p is number => p !== null && p > 0);
  const allMidgrade = stations.map(s => s.midgradePrice).filter((p): p is number => p !== null && p > 0);
  const allPremium = stations.map(s => s.premiumPrice).filter((p): p is number => p !== null && p > 0);
  const allDiesel = stations.map(s => s.dieselPrice).filter((p): p is number => p !== null && p > 0);

  // All prices combined for min/max
  const allPrices = [...allRegular, ...allMidgrade, ...allPremium, ...allDiesel];
  const lowest = allPrices.length > 0 ? Math.min(...allPrices) : null;
  const highest = allPrices.length > 0 ? Math.max(...allPrices) : null;

  return {
    totalStations: stations.length,
    totalChangesToday: todayDetails.length,
    avgRegular: avg(allRegular),
    avgMidgrade: avg(allMidgrade),
    avgPremium: avg(allPremium),
    avgDiesel: avg(allDiesel),
    lowestPrice: lowest,
    highestPrice: highest,
    priceSpread: lowest !== null && highest !== null ? highest - lowest : null,
    lastRunTimestamp: lastRun?.run_timestamp ?? null,
  };
}

function avg(arr: number[]): number | null {
  if (arr.length === 0) return null;
  return Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 1000) / 1000;
}
