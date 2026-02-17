'use client';

import { Activity, BarChart3 } from 'lucide-react';
import DashCard from './DashCard';
import { TOP_ADJUSTED_QUOTAS, TOP_QUOTA_USAGE } from './constants';

function getUsageColor(pct: number) {
  if (pct >= 90) return '#EF4444';
  if (pct >= 80) return '#F59E0B';
  if (pct >= 60) return '#29B5E8';
  return '#10B981';
}

/* ─────────────────────────────────────────────────────────
   Radial Gauge Grid — Top Quota Usage
   ───────────────────────────────────────────────────────── */

export function QuotaGauges() {
  const items = TOP_QUOTA_USAGE.slice(0, 6);

  return (
    <DashCard
      title="Top Quota Usage"
      subtitle="Highest utilization across all regions"
      accentColor="#29B5E8"
      icon={<Activity className="w-4 h-4" />}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6">
        {items.map((q, i) => (
          <GaugeItem key={i} pct={q.usagePct} label={q.quotaName} sublabel={q.region} />
        ))}
      </div>
    </DashCard>
  );
}

function GaugeItem({ pct, label, sublabel }: { pct: number; label: string; sublabel: string }) {
  const color = getUsageColor(pct);
  const size = 96;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center group/gauge">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#gauge-grad-${pct})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-[1.4s] ease-out"
            style={{ filter: `drop-shadow(0 0 8px ${color}35)` }}
          />
          <defs>
            <linearGradient id={`gauge-grad-${pct}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity={0.6} />
              <stop offset="100%" stopColor={color} stopOpacity={1} />
            </linearGradient>
          </defs>
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold tabular-nums" style={{ color }}>
            {pct}%
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-300 mt-2 text-center truncate w-full max-w-[130px] font-medium leading-tight">
        {label}
      </p>
      <p className="text-[10px] text-gray-600 font-mono mt-0.5">{sublabel}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Horizontal Bars — Top Adjusted Quotas
   ───────────────────────────────────────────────────────── */

export function AdjustmentsChart() {
  const items = TOP_ADJUSTED_QUOTAS.slice(0, 6);
  const maxVal = items[0].adjustments;

  return (
    <DashCard
      title="Top Adjusted Quotas"
      subtitle="Most frequently adjusted — last 30 days"
      accentColor="#29B5E8"
      icon={<BarChart3 className="w-4 h-4" />}
    >
      <div className="space-y-3.5">
        {items.map((q, i) => {
          const widthPct = (q.adjustments / maxVal) * 100;
          const opacity = 0.45 + ((items.length - i) / items.length) * 0.55;

          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-400 truncate max-w-[200px]">{q.quotaName}</span>
                <span className="text-xs font-semibold text-white tabular-nums ml-2">{q.adjustments}</span>
              </div>
              <div className="h-[7px] bg-[#141414] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${widthPct}%`,
                    background: `linear-gradient(90deg, rgba(41,181,232,${opacity * 0.7}), rgba(41,181,232,${opacity}))`,
                    boxShadow: i === 0 ? '0 0 12px rgba(41,181,232,0.15)' : undefined,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </DashCard>
  );
}
