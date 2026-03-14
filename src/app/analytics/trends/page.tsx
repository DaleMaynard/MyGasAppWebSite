'use client';

import { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Fuel,
  Activity,
  BarChart3,
  Clock,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { usePriceChangeData } from '@/hooks/usePriceChangeData';
import { formatPrice } from '@/lib/formatters';

type TimeRange = '7d' | '30d';
type FuelType = 'regular' | 'midgrade' | 'premium' | 'diesel';

const fuelConfig: Record<FuelType, { label: string; color: string; key: string }> = {
  regular:  { label: 'Regular',  color: '#10B981', key: 'avgRegular' },
  midgrade: { label: 'Midgrade', color: '#3B82F6', key: 'avgMidgrade' },
  premium:  { label: 'Premium',  color: '#8B5CF6', key: 'avgPremium' },
  diesel:   { label: 'Diesel',   color: '#F59E0B', key: 'avgDiesel' },
};

export default function TrendsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [fuelType, setFuelType] = useState<FuelType>('regular');

  const { data, isLoading } = usePriceChangeData({ timeRange });

  const trendData = data?.trendData ?? [];
  const summary = data?.summary;

  // Filter trend data for selected fuel type and build chart data
  const chartData = useMemo(() => {
    const fc = fuelConfig[fuelType];
    return trendData.map(d => ({
      date: d.date,
      price: d[fc.key as keyof typeof d] as number | null,
      changes: d.totalChanges,
    })).filter(d => d.price !== null);
  }, [trendData, fuelType]);

  // Calculate trend statistics
  const stats = useMemo(() => {
    const prices = chartData.map(d => d.price).filter((p): p is number => p !== null);
    if (prices.length < 2) return null;
    const latest = prices[prices.length - 1];
    const first = prices[0];
    const change = latest - first;
    const changePercent = (change / first) * 100;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { latest, first, change, changePercent, min, max };
  }, [chartData]);

  const handleExport = () => {
    if (chartData.length === 0) return;
    const csv = [
      ['Date', 'Price', 'Changes'],
      ...chartData.map(d => [d.date, d.price?.toString() || '', d.changes.toString()])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gas-finder-trends-${fuelType}-${timeRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header — Material style */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Price Trends</h2>
          <p className="text-gray-500 text-sm mt-1">
            Historical price analysis from nightly price checks
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Fuel Type Selector */}
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-0.5">
            {Object.entries(fuelConfig).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setFuelType(key as FuelType)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  fuelType === key
                    ? 'text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                style={fuelType === key ? { backgroundColor: cfg.color } : undefined}
              >
                {cfg.label}
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

          <button
            onClick={handleExport}
            disabled={chartData.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 text-gray-600 rounded-lg text-xs font-medium shadow-sm transition-colors"
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats — Material Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Current" value={formatPrice(stats.latest)} icon={<Fuel size={16} className="text-emerald-500" />} />
          <StatCard label="Period Start" value={formatPrice(stats.first)} icon={<Calendar size={16} className="text-blue-500" />} />
          <StatCard 
            label="Change" 
            value={`${stats.change > 0 ? '+' : ''}${stats.change.toFixed(3)}`} 
            color={stats.change > 0 ? 'text-red-500' : stats.change < 0 ? 'text-emerald-500' : 'text-gray-500'}
            icon={stats.change >= 0 ? <TrendingUp size={16} className="text-red-500" /> : <TrendingDown size={16} className="text-emerald-500" />}
          />
          <StatCard 
            label="Change %" 
            value={`${stats.changePercent > 0 ? '+' : ''}${stats.changePercent.toFixed(1)}%`}
            color={stats.changePercent > 0 ? 'text-red-500' : stats.changePercent < 0 ? 'text-emerald-500' : 'text-gray-500'}
            icon={<Activity size={16} className="text-purple-500" />}
          />
          <StatCard label="Period Low" value={formatPrice(stats.min)} color="text-emerald-500" icon={<TrendingDown size={16} className="text-emerald-500" />} />
          <StatCard label="Period High" value={formatPrice(stats.max)} color="text-red-500" icon={<TrendingUp size={16} className="text-red-500" />} />
        </div>
      )}

      {/* Summary bar: total stations + last run */}
      {summary && (
        <div className="flex items-center gap-6 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <BarChart3 size={13} />
            {summary.totalStations} stations tracked
          </span>
          <span className="flex items-center gap-1.5">
            <Activity size={13} />
            {summary.totalChangesToday} changes today
          </span>
          {summary.lastRunTimestamp && (
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              Last run: {new Date(summary.lastRunTimestamp).toLocaleString()}
            </span>
          )}
        </div>
      )}

      {/* Main Chart — Material Card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: fuelConfig[fuelType].color + '20' }}>
              <TrendingUp size={18} style={{ color: fuelConfig[fuelType].color }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                {fuelConfig[fuelType].label} Price History
              </h3>
              <p className="text-xs text-gray-400">
                Average prices across tracked stations &middot; {timeRange === '7d' ? 'Last 7 days' : 'Last 30 days'}
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Loading price data...</p>
            </div>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <defs>
                <linearGradient id={`grad-${fuelType}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={fuelConfig[fuelType].color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={fuelConfig[fuelType].color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: '#9CA3AF' }} 
                tickFormatter={(d: string) => formatDateShort(d)}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: '#9CA3AF' }} 
                tickFormatter={(v: number) => `$${v.toFixed(2)}`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#000' }}
                formatter={((value: number) => [`$${value.toFixed(3)}`, fuelConfig[fuelType].label]) as any}
                labelFormatter={((label: string) => formatDateLong(label)) as any}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={fuelConfig[fuelType].color}
                strokeWidth={2.5}
                fill={`url(#grad-${fuelType})`}
                dot={{ fill: fuelConfig[fuelType].color, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center">
              <Fuel size={40} className="text-gray-300" />
              <p className="text-gray-500 text-sm">No price data for this period</p>
              <p className="text-gray-400 text-xs">Data appears after nightly price checks run</p>
            </div>
          </div>
        )}
      </div>

      {/* Daily Changes Chart */}
      {trendData.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <Activity size={18} className="text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Daily Price Changes</h3>
              <p className="text-xs text-gray-400">Number of station price changes detected per day</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <defs>
                <linearGradient id="grad-changes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                tickFormatter={(d: string) => formatDateShort(d)}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#9CA3AF' }} 
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#000' }}
                formatter={((value: number) => [String(value), 'Changes']) as any}
                labelFormatter={((label: string) => formatDateLong(label)) as any}
              />
              <Area
                type="monotone"
                dataKey="totalChanges"
                stroke="#F59E0B"
                strokeWidth={2}
                fill="url(#grad-changes)"
                dot={{ fill: '#F59E0B', r: 3, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Data Table */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">Price Data</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-gray-500 font-medium py-3 px-6 text-xs uppercase tracking-wider">Date</th>
                  <th className="text-right text-gray-500 font-medium py-3 px-6 text-xs uppercase tracking-wider">Price</th>
                  <th className="text-right text-gray-500 font-medium py-3 px-6 text-xs uppercase tracking-wider">Changes</th>
                  <th className="text-right text-gray-500 font-medium py-3 px-6 text-xs uppercase tracking-wider">Δ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {chartData.slice(-10).reverse().map((row, i, arr) => {
                  const prev = arr[i + 1];
                  const change = prev && row.price && prev.price ? row.price - prev.price : null;
                  return (
                    <tr key={row.date} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-6 text-gray-700 font-medium">{formatDateLong(row.date)}</td>
                      <td className="py-3 px-6 text-right font-mono text-emerald-600 font-semibold">
                        {row.price ? `$${row.price.toFixed(3)}` : '--'}
                      </td>
                      <td className="py-3 px-6 text-right text-gray-500">{row.changes}</td>
                      <td className={`py-3 px-6 text-right font-mono text-sm ${
                        change && change > 0 ? 'text-red-500' : change && change < 0 ? 'text-emerald-500' : 'text-gray-400'
                      }`}>
                        {change !== null ? `${change > 0 ? '+' : ''}${change.toFixed(3)}` : '--'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function StatCard({ 
  label, value, color = 'text-gray-800', icon 
}: { 
  label: string; value: string; color?: string; icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
        {icon}
      </div>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function formatDateShort(dateString: string): string {
  try {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch { return dateString; }
}

function formatDateLong(dateString: string): string {
  try {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return dateString; }
}
