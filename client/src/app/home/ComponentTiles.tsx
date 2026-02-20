'use client';

import Link from 'next/link';
import { BarChart3, Database, Calendar, FileText, ArrowUpRight } from 'lucide-react';
import CountUp from '@/components/CountUp';
import { COMPONENT_SNAPSHOTS } from './constants';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  capacity: BarChart3,
  quotas: Database,
  reservations: Calendar,
  requests: FileText,
};

export default function ComponentTiles() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {COMPONENT_SNAPSHOTS.map((snap) => {
        const Icon = ICONS[snap.id] || BarChart3;
        return (
          <Link
            key={snap.id}
            href={snap.href}
            className="group relative rounded-2xl bg-[#0a0a0c] border border-[#141414] overflow-hidden hover:border-[#222] transition-all duration-300"
          >
            <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${snap.color}, transparent)` }} />

            <div className="p-5 flex flex-col justify-between h-[calc(100%-2px)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${snap.color}15`, color: snap.color }}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-400">{snap.label}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
              </div>

              <div>
                <p className="text-3xl font-bold text-white tabular-nums tracking-tight">
                  <CountUp end={snap.metric} />
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{snap.metricLabel}</p>
              </div>

              <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-[#141414]">{snap.subMetric}</p>
            </div>

            <div
              className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ backgroundColor: `${snap.color}08` }}
            />
          </Link>
        );
      })}
    </div>
  );
}
