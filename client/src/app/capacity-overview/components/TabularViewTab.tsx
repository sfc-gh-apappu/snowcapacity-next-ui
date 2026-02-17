'use client';

import { HISTORICAL_TABLE_DATA, FORECAST_TABLE_DATA } from '../constants';
import type { TabularRow } from '../constants';
import { History, TrendingUp } from 'lucide-react';

export default function TabularViewTab() {
  return (
    <div className="space-y-6">
      <DemandTable
        title="Historical Data"
        icon={<History className="w-4 h-4 text-[#29B5E8]" />}
        data={HISTORICAL_TABLE_DATA}
        accentColor="#29B5E8"
        accentBorder="from-[#29B5E8]/40 to-transparent"
        glowClass="from-[#29B5E8]/15"
      />
      <DemandTable
        title="Forecast Data"
        icon={<TrendingUp className="w-4 h-4 text-violet-400" />}
        data={FORECAST_TABLE_DATA}
        accentColor="#8B5CF6"
        accentBorder="from-violet-500/40 to-transparent"
        glowClass="from-violet-500/15"
      />
    </div>
  );
}

function DemandTable({
  title, icon, data, accentColor, accentBorder, glowClass,
}: {
  title: string;
  icon: React.ReactNode;
  data: TabularRow[];
  accentColor: string;
  accentBorder: string;
  glowClass: string;
}) {
  return (
    <div className="group relative rounded-2xl overflow-hidden">
      {/* Gradient border */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accentBorder} via-transparent p-px`}>
        <div className="w-full h-full rounded-2xl bg-[#070709]" />
      </div>

      {/* Hover glow */}
      <div className={`absolute -top-16 -left-16 w-40 h-40 bg-gradient-to-br ${glowClass} to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

      <div className="relative">
        {/* Top accent */}
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />

        <div className="px-6 py-4 border-b border-[#1a1a1a] flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${accentColor}15` }}>
            {icon}
          </div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <span className="text-xs text-gray-500 ml-auto tabular-nums">{data.length} rows</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/40 border-b border-[#1a1a1a]">
              <tr>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Region</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Deployment</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Warehouse Type</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Demand</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Metric</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-5 py-3.5 text-sm text-white font-medium whitespace-nowrap">{row.date}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-300">{row.product}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-400">{row.region}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-400">{row.deployment}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a]">
                      {row.warehouseType}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-right tabular-nums" style={{ color: accentColor }}>
                    {row.demand.toLocaleString()}
                    <span className="text-gray-500 font-normal ml-1">{row.unit}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-400">{row.metric}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
