/**
 * Formatting utilities for the dashboard
 */

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return '--';
  return `$${price.toFixed(2)}`;
}

/**
 * Format price with 3 decimal places (for user-submitted prices)
 * e.g., $2.499
 */
export function formatPrice3(price: number | null | undefined): string {
  if (price === null || price === undefined) return '--';
  return `$${price.toFixed(3)}`;
}

export function formatDistance(miles: number | null | undefined): string {
  if (miles === null || miles === undefined) return '--';
  if (miles < 0.1) return '< 0.1 mi';
  if (miles < 1) return `${(miles * 5280).toFixed(0)} ft`;
  return `${miles.toFixed(1)} mi`;
}

export function formatLastUpdated(dateString: string | null | undefined): string {
  if (!dateString) return 'Unknown';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  } catch {
    return 'Unknown';
  }
}

export function getBrandColor(brand: string | null | undefined): string {
  if (!brand) return '#10B981';

  const colors: Record<string, string> = {
    shell: '#FFD500',
    exxon: '#E11A2C',
    mobil: '#E11A2C',
    chevron: '#0055B8',
    texaco: '#E11A2C',
    bp: '#009900',
    sunoco: '#FFD700',
    marathon: '#0055B8',
    valero: '#0055B8',
    citgo: '#E11A2C',
    phillips66: '#E11A2C',
    costco: '#E31837',
    sams: '#0066CC',
    "sam's": '#0066CC',
    "sam's club": '#0066CC',
    kroger: '#0066CC',
    heb: '#E11A2C',
    murphy: '#FFCC00',
    "murphy usa": '#FFCC00',
    quiktrip: '#E11A2C',
    qt: '#E11A2C',
    racetrac: '#FF6600',
    wawa: '#E11A2C',
    sheetz: '#E11A2C',
    bucees: '#FFCC00',
    "buc-ee's": '#FFCC00',
    loves: '#FFD700',
    "love's": '#FFD700',
    pilot: '#E11A2C',
    "flying j": '#E11A2C',
    ta: '#0055B8',
    petro: '#E11A2C',
  };

  const lowerBrand = brand.toLowerCase();
  for (const [key, color] of Object.entries(colors)) {
    if (lowerBrand.includes(key)) return color;
  }
  return '#10B981';
}
