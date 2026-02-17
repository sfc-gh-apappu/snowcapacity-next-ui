'use client';

import { DollarSign } from 'lucide-react';
import DashCard from './DashCard';
import { TOP_UNUSED_RESERVATION_COSTS } from './constants';

/* ─────────────────────────────────────────────────────────
   Unused Reservation Costs — Proportional bars with $ emphasis
   ───────────────────────────────────────────────────────── */

export function UnusedCosts() {
  const items = TOP_UNUSED_RESERVATION_COSTS.slice(0, 6);
  const maxVal = items[0].unusedSpend;

  return (
    <DashCard
      title="Unused Reservation Costs"
      subtitle="Top weekly waste by reservation"
      accentColor="#EF4444"
      icon={<DollarSign className="w-4 h-4" />}
    >
      <div className="space-y-3.5">
        {items.map((item, i) => {
          const widthPct = (item.unusedSpend / maxVal) * 100;
          const intensity = 0.35 + ((items.length - i) / items.length) * 0.65;

          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-gray-400 truncate">{item.label}</span>
                  <span className="text-[10px] text-gray-600 font-mono flex-shrink-0">
                    {item.instanceType}
                  </span>
                </div>
                <span className="text-xs font-semibold text-red-400 tabular-nums ml-2 flex-shrink-0">
                  ${item.unusedSpend.toLocaleString()}
                </span>
              </div>
              <div className="h-[7px] bg-[#141414] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${widthPct}%`,
                    background: `linear-gradient(90deg, rgba(239,68,68,${intensity * 0.5}), rgba(239,68,68,${intensity}))`,
                    boxShadow: i === 0 ? '0 0 12px rgba(239,68,68,0.12)' : undefined,
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
