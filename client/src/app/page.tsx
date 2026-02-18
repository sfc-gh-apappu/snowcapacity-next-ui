'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, DollarSign, FileText } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import CountUp from '@/components/CountUp';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import {
  TOTAL_ADJUSTMENTS_30D,
  ADJUSTED_SUBSCRIPTIONS_30D,
  TOTAL_UNUSED_COST_7D,
  TOTAL_REQUESTS,
  COMPLETED_REQUESTS,
  KPI_SPARKLINES,
} from './home/constants';
import { QuotaGauges, AdjustmentsChart } from './home/QuotaSummary';
import { UnusedCosts } from './home/ReservationsSummary';
import { RequestDonut, ActivityFeed } from './home/RequestsSummary';

export default function Home() {
  return (
    <PageTransition>
    <div className="space-y-8">
      {/* ─── Header ─── */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
          <span className="bg-gradient-to-r from-[#29B5E8] via-[#7DD3FC] to-white bg-clip-text text-transparent">
            Snowflake Capacity Platform
          </span>
        </h1>
        <p className="text-gray-400 mt-3 text-lg max-w-2xl">
          Your central platform for managing capacity resources, quotas, and reservations.
        </p>
      </div>

      {/* ─── KPI Strip ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Quota Adjustments"
          sublabel="Last 30 days"
          value={<CountUp end={TOTAL_ADJUSTMENTS_30D} />}
          icon={<TrendingUp className="w-4 h-4" />}
          color="#29B5E8"
          sparkline={KPI_SPARKLINES.adjustments}
        />
        <KpiCard
          label="Adjusted Subscriptions"
          sublabel="Last 30 days"
          value={<CountUp end={ADJUSTED_SUBSCRIPTIONS_30D} />}
          icon={<ArrowUpRight className="w-4 h-4" />}
          color="#8B5CF6"
          sparkline={KPI_SPARKLINES.subscriptions}
        />
        <KpiCard
          label="Unused Reservation Cost"
          sublabel="Last 7 days"
          value={<CountUp end={TOTAL_UNUSED_COST_7D} prefix="$" />}
          icon={<DollarSign className="w-4 h-4" />}
          color="#EF4444"
          sparkline={KPI_SPARKLINES.unusedCost}
        />
        <KpiCard
          label="Capacity Requests"
          sublabel={`${COMPLETED_REQUESTS} completed`}
          value={<CountUp end={TOTAL_REQUESTS} />}
          icon={<FileText className="w-4 h-4" />}
          color="#10B981"
          sparkline={KPI_SPARKLINES.requests}
        />
      </div>

      {/* ─── Bento Dashboard ─── */}
      <div className="grid grid-cols-12 gap-5">
        {/* Row 1 */}
        <div className="col-span-12 lg:col-span-8">
          <QuotaGauges />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <RequestDonut />
        </div>

        {/* Row 2 */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <AdjustmentsChart />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <UnusedCosts />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <ActivityFeed />
        </div>
      </div>
    </div>
    </PageTransition>
  );
}

/* ─── KPI Card ─── */

function KpiCard({
  label,
  sublabel,
  value,
  icon,
  color,
  sparkline,
}: {
  label: string;
  sublabel: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  color: string;
  sparkline?: number[];
}) {
  const sparkData = sparkline?.map((v) => ({ v }));
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative group rounded-2xl bg-[#0a0a0c] border border-[#141414] overflow-hidden hover:border-[#222] transition-all duration-300">
      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div className="p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}15`, color }}>
            {icon}
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">{label}</p>
            <p className="text-[10px] text-gray-600">{sublabel}</p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-4">
          <p className="text-3xl font-bold text-white tabular-nums tracking-tight">{value}</p>
          {sparkData && mounted && (
            <div className="w-24 h-10 opacity-70">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData}>
                  <defs>
                    <linearGradient id={`spark-${label.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke={color}
                    strokeWidth={1.5}
                    fill={`url(#spark-${label.replace(/\s/g, '')})`}
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: `${color}08` }}
      />
    </div>
  );
}
