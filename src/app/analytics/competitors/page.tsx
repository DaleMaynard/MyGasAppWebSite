'use client';

import { useState, useMemo, ReactNode } from 'react';
import {
  Users,
  TrendingUp,
  TrendingDown,
  MapPin,
  Clock,
  ArrowUpDown,
  Fuel,
  Activity,
  BarChart3,
  DollarSign,
  X,
  RefreshCw,
} from 'lucide-react';
import { usePriceChangeData, StationPrice } from '@/hooks/usePriceChangeData';
import { formatPrice, formatLastUpdated, getBrandColor } from '@/lib/formatters';

type FuelType = 'regular' | 'midgrade' | 'premium' | 'diesel';
type TimeRange = '7d' | '30d';
type SortField = 'price' | 'name' | 'brand' | 'updated' | 'changes' | 'location' | 'vsAvg';
type SortDirection = 'asc' | 'desc';

interface SortEntry {
  field: SortField;
  direction: SortDirection;
}

const DEFAULT_SORT: SortEntry[] = [{ field: 'updated', direction: 'asc' }];

const fuelKeys: Record<FuelType, keyof StationPrice> = {
  regular: 'regularPrice',
  midgrade: 'midgradePrice',
  premium: 'premiumPrice',
  diesel: 'dieselPrice',
};

export default function CompetitorsPage() {
  const [fuelType, setFuelType] = useState<FuelType>('regular');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [sortStack, setSortStack] = useState<SortEntry[]>(DEFAULT_SORT);

  const { data, isLoading } = usePriceChangeData({ timeRange });

  const stations = data?.stations ?? [];
  const summary = data?.summary;

  // Multi-column sort comparator
  const getFieldComparator = (field: SortField, fuelKey: keyof StationPrice, avgPrice: number | null) => {
    return (a: StationPrice, b: StationPrice): number => {
      switch (field) {
        case 'price':
          return ((a[fuelKey] as number) ?? 999) - ((b[fuelKey] as number) ?? 999);
        case 'name':
          return a.stationName.localeCompare(b.stationName);
        case 'brand':
          return a.stationBrand.localeCompare(b.stationBrand);
        case 'updated':
          return new Date(b.priceUpdatedAt).getTime() - new Date(a.priceUpdatedAt).getTime();
        case 'changes':
          return (b.totalChanges ?? 0) - (a.totalChanges ?? 0);
        case 'location': {
          const locA = `${a.stationCity}, ${a.stationState}`;
          const locB = `${b.stationCity}, ${b.stationState}`;
          return locA.localeCompare(locB);
        }
        case 'vsAvg': {
          if (avgPrice == null) return 0;
          const deltaA = ((a[fuelKey] as number) ?? avgPrice) - avgPrice;
          const deltaB = ((b[fuelKey] as number) ?? avgPrice) - avgPrice;
          return deltaA - deltaB;
        }
        default:
          return 0;
      }
    };
  };

  // Filter stations that have a price for selected fuel type & multi-sort
  const filteredStations = useMemo(() => {
    const key = fuelKeys[fuelType];
    const filtered = stations.filter(s => {
      const p = s[key];
      return p !== null && (p as number) > 0;
    });

    // Calculate avg for vsAvg sorting
    const prices = filtered.map(s => s[key] as number).filter(p => p > 0);
    const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : null;

    console.log('[CompetitorsSort] sortStack:', JSON.stringify(sortStack));

    return filtered.sort((a, b) => {
      for (const { field, direction } of sortStack) {
        const comparator = getFieldComparator(field, key, avgPrice);
        const cmp = comparator(a, b);
        if (cmp !== 0) {
          return direction === 'asc' ? cmp : -cmp;
        }
      }
      return 0;
    });
  }, [stations, fuelType, sortStack]);

  // Price statistics
  const priceStats = useMemo(() => {
    const key = fuelKeys[fuelType];
    const prices = filteredStations.map(s => s[key] as number).filter(p => p > 0);
    if (prices.length === 0) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    return { min, max, avg, spread: max - min };
  }, [filteredStations, fuelType]);

  const handleSort = (field: SortField, shiftKey: boolean) => {
    setSortStack(prev => {
      const existingIdx = prev.findIndex(s => s.field === field);

      if (existingIdx >= 0) {
        // Toggle direction of existing sort
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          direction: updated[existingIdx].direction === 'asc' ? 'desc' : 'asc',
        };
        console.log('[CompetitorsSort] Toggled direction:', JSON.stringify(updated));
        return updated;
      }

      if (shiftKey && prev.length < 4) {
        // Add as secondary/tertiary sort
        const next = [...prev, { field, direction: 'asc' as SortDirection }];
        console.log('[CompetitorsSort] Added secondary sort:', JSON.stringify(next));
        return next;
      }

      // Replace with single sort
      console.log('[CompetitorsSort] New primary sort:', field);
      return [{ field, direction: 'asc' }];
    });
  };

  const clearSort = () => {
    console.log('[CompetitorsSort] Reset to default');
    setSortStack(DEFAULT_SORT);
  };

  const isDefaultSort = sortStack.length === 1 && sortStack[0].field === 'updated' && sortStack[0].direction === 'asc';

  const fuelTypeOptions: { value: FuelType; label: string }[] = [
    { value: 'regular', label: 'Regular' },
    { value: 'midgrade', label: 'Midgrade' },
    { value: 'premium', label: 'Premium' },
    { value: 'diesel', label: 'Diesel' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Competitor Analysis</h2>
          <p className="text-gray-500 text-sm mt-1">
            Compare prices across {filteredStations.length} stations
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Fuel Type */}
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-0.5">
            {fuelTypeOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFuelType(opt.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  fuelType === opt.value
                    ? 'bg-gray-800 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Time Range — only 7d and 30d */}
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-0.5">
            {([{ value: '7d' as TimeRange, label: '7 Days' }, { value: '30d' as TimeRange, label: '30 Days' }]).map(opt => (
              <button
                key={opt.value}
                onClick={() => setTimeRange(opt.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  timeRange === opt.value
                    ? 'bg-gray-800 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards Row 1 — Price Stats (from spec: Lowest, Average, Highest, Spread) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          label="Lowest Price"
          value={formatPrice(priceStats?.min ?? null)}
          icon={<TrendingDown size={18} className="text-emerald-500" />}
          accent="emerald"
        />
        <KPICard
          label="Average Price"
          value={formatPrice(priceStats?.avg ?? null)}
          icon={<DollarSign size={18} className="text-blue-500" />}
          accent="blue"
        />
        <KPICard
          label="Highest Price"
          value={formatPrice(priceStats?.max ?? null)}
          icon={<TrendingUp size={18} className="text-red-500" />}
          accent="red"
        />
        <KPICard
          label="Price Spread"
          value={priceStats?.spread != null ? `$${priceStats.spread.toFixed(2)}` : '--'}
          icon={<Activity size={18} className="text-amber-500" />}
          accent="amber"
        />
      </div>

      {/* KPI Cards Row 2 — New metrics from spec */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          label="Total Stations"
          value={summary?.totalStations?.toString() ?? '0'}
          icon={<MapPin size={18} className="text-indigo-500" />}
          accent="indigo"
        />
        <KPICard
          label="Changes Today"
          value={summary?.totalChangesToday?.toString() ?? '0'}
          icon={<Activity size={18} className="text-purple-500" />}
          accent="purple"
        />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Avg by Grade</p>
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Fuel size={18} className="text-emerald-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {([
              { label: 'R', price: summary?.avgRegular, color: '#10B981' },
              { label: 'M', price: summary?.avgMidgrade, color: '#3B82F6' },
              { label: 'P', price: summary?.avgPremium, color: '#8B5CF6' },
              { label: 'D', price: summary?.avgDiesel, color: '#F59E0B' },
            ] as const).map(g => (
              <div key={g.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
                <span className="text-[11px] text-gray-400 font-medium">{g.label}:</span>
                <span className="text-sm font-bold text-gray-800 font-mono">{formatPrice(g.price ?? null)}</span>
              </div>
            ))}
          </div>
        </div>
        <KPICard
          label="Last Run"
          value={summary?.lastRunTimestamp ? formatTimestamp(summary.lastRunTimestamp) : '--'}
          icon={<Clock size={18} className="text-gray-500" />}
          accent="gray"
        />
      </div>

      {/* Competitor Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Users size={18} className="text-indigo-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Station Prices</h3>
              <p className="text-xs text-gray-400">
                {fuelType.charAt(0).toUpperCase() + fuelType.slice(1)} prices &middot; {sortStack.length > 1 ? `sorted by ${sortStack.length} columns` : `sorted by ${sortStack[0]?.field ?? 'updated'}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isDefaultSort && (
              <button
                onClick={clearSort}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full text-xs font-medium transition-colors"
              >
                <RefreshCw size={11} />
                Clear Sort
              </button>
            )}
            {sortStack.length > 1 && (
              <p className="text-[10px] text-gray-400">Shift+click to add sort</p>
            )}
            <p className="text-xs text-gray-400">
              {filteredStations.length} stations
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Loading stations...</p>
            </div>
          </div>
        ) : filteredStations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-gray-400 font-medium py-3 px-6 text-xs uppercase tracking-wider w-10">#</th>
                  <SortHeader field="name" sortStack={sortStack} onSort={handleSort}>Station</SortHeader>
                  <SortHeader field="brand" sortStack={sortStack} onSort={handleSort}>Brand</SortHeader>
                  <SortHeader field="price" sortStack={sortStack} onSort={handleSort}>Price</SortHeader>
                  <SortHeader field="vsAvg" sortStack={sortStack} onSort={handleSort}>vs Avg</SortHeader>
                  <SortHeader field="changes" sortStack={sortStack} onSort={handleSort}>Changes</SortHeader>
                  <SortHeader field="location" sortStack={sortStack} onSort={handleSort}>Location</SortHeader>
                  <SortHeader field="updated" sortStack={sortStack} onSort={handleSort}>Updated</SortHeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStations.map((station, index) => {
                  const price = station[fuelKeys[fuelType]] as number;
                  const deltaVsAvg = priceStats ? price - priceStats.avg : null;
                  const isBelow = deltaVsAvg !== null && deltaVsAvg < -0.01;
                  const isAbove = deltaVsAvg !== null && deltaVsAvg > 0.01;

                  return (
                    <tr key={station.stationId} className={`hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-emerald-50/50' : ''}`}>
                      <td className="py-3 px-6">
                        <span className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold ${
                          index === 0 ? 'bg-emerald-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-amber-600 text-white' :
                          'text-gray-400'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <p className="text-gray-800 font-medium text-sm">{station.stationName}</p>
                        {station.stationAddress && (
                          <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                            <MapPin size={10} />
                            {station.stationAddress}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-6">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-semibold text-white"
                          style={{ backgroundColor: getBrandColor(station.stationBrand) }}
                        >
                          {station.stationBrand || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <p className={`font-mono font-bold text-base ${index === 0 ? 'text-emerald-600' : 'text-gray-800'}`}>
                          {formatPrice(price)}
                        </p>
                      </td>
                      <td className="py-3 px-6 text-center">
                        {deltaVsAvg !== null && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                            isBelow ? 'bg-emerald-100 text-emerald-700' :
                            isAbove ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {isBelow && <TrendingDown size={11} />}
                            {isAbove && <TrendingUp size={11} />}
                            {deltaVsAvg > 0 ? '+' : ''}{deltaVsAvg.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-6">
                        <span className="text-xs text-gray-500 font-mono whitespace-nowrap">
                          R:{station.changeCounts.regular} M:{station.changeCounts.midgrade} P:{station.changeCounts.premium} D:{station.changeCounts.diesel}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-gray-500 text-xs">
                        {station.stationCity}{station.stationState ? `, ${station.stationState}` : ''}
                      </td>
                      <td className="py-3 px-6">
                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                          <Clock size={11} />
                          {formatLastUpdated(station.priceUpdatedAt)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Users size={36} className="text-gray-300" />
              <p className="text-gray-400 text-sm">No stations with {fuelType} price data</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function KPICard({
  label, value, subtitle, icon, accent,
}: {
  label: string; value: string; subtitle?: string; icon: ReactNode; accent: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
        <div className={`w-8 h-8 bg-${accent}-50 rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {subtitle && <p className="text-[10px] text-gray-400 mt-1 font-mono">{subtitle}</p>}
    </div>
  );
}

function SortHeader({
  field, children, sortStack, onSort,
}: {
  field: SortField; children: ReactNode; sortStack: SortEntry[]; onSort: (f: SortField, shiftKey: boolean) => void;
}) {
  const idx = sortStack.findIndex(s => s.field === field);
  const isActive = idx >= 0;
  const dir = isActive ? sortStack[idx].direction : null;
  const priority = isActive ? idx + 1 : null;
  const showPriority = sortStack.length > 1 && priority !== null;

  return (
    <th
      className={`text-left font-medium py-3 px-4 text-xs uppercase tracking-wider cursor-pointer transition-colors ${
        isActive ? 'text-gray-700 bg-gray-100/50' : 'text-gray-400 hover:text-gray-600'
      }`}
      onClick={(e) => onSort(field, e.shiftKey)}
      title="Click to sort, Shift+click to add secondary sort"
    >
      <div className="flex items-center gap-1">
        {children}
        {isActive && (
          <span className="flex items-center gap-0.5">
            <ArrowUpDown size={12} className={`text-gray-600 ${dir === 'desc' ? 'rotate-180' : ''}`} />
            {showPriority && (
              <span className="w-3.5 h-3.5 rounded-full bg-gray-700 text-white text-[9px] font-bold flex items-center justify-center">
                {priority}
              </span>
            )}
          </span>
        )}
      </div>
    </th>
  );
}

function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
      ' ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch { return ts; }
}
