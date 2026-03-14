import { ReactNode } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Users, 
  ArrowLeft,
  Fuel,
  BarChart3,
} from 'lucide-react';

interface AnalyticsLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/analytics/trends', label: 'Price Trends', icon: TrendingUp },
  { href: '/analytics/competitors', label: 'Competitors', icon: Users },
];

export default function AnalyticsLayout({ children }: AnalyticsLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Material-style Top Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-600" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                  <BarChart3 size={22} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white tracking-tight">Gas Finder Analytics</h1>
                  <p className="text-gray-400 text-xs">38 Stations &middot; Texas Markets</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 px-3 py-1.5 rounded-md text-xs font-semibold border border-emerald-500/20">
                <Fuel size={13} />
                Price Intelligence
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Minimal Sidebar */}
        <aside className="w-56 min-h-[calc(100vh-73px)] bg-white shadow-md border-r border-gray-200">
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Data source badge */}
          <div className="mt-6 mx-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Data Source</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Nightly price checks via Google Places API across 38 tracked stations.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100 min-h-[calc(100vh-73px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
