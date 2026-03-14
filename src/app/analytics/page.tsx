'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Analytics root page — redirects to Price Trends.
 * The scaled-down dashboard only has Trends + Competitors.
 */
export default function AnalyticsOverview() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/analytics/trends');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Redirecting to Price Trends...</p>
      </div>
    </div>
  );
}