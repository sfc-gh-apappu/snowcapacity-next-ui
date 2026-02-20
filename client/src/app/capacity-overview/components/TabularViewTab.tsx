'use client';

import { useState } from 'react';
import { HISTORICAL_TABLE_DATA, FORECAST_TABLE_DATA } from '../constants';
import type { TabularRow } from '../constants';
import { History, TrendingUp, Search, ChevronDown, ChevronRight } from 'lucide-react';

export default function TabularViewTab() {
  const [search, setSearch] = useState('');

  const filterRows = (rows: TabularRow[]) => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.date.toLowerCase().includes(q) ||
        r.product.toLowerCase().includes(q) ||
        r.region.toLowerCase().includes(q) ||
        r.deployment.toLowerCase().includes(q) ||
        r.warehouseType.toLowerCase().includes(q),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          {filterRows(HISTORICAL_TABLE_DATA).length + filterRows(FORECAST_TABLE_DATA).length} total rows
        </p>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search rows..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29B5E8]/50 text-sm text-white placeholder-gray-600"
          />
        </div>
      </div>

      <DemandTable
        title="Historical Data"
        icon={<History className="w-4 h-4 text-[#29B5E8]" />}
        data={filterRows(HISTORICAL_TABLE_DATA)}
        accentColor="#29B5E8"
        accentBorder="from-[#29B5E8]/40 to-transparent"
        glowClass="from-[#29B5E8]/15"
      />
      <DemandTable
        title="Forecast Data"
        icon={<TrendingUp className="w-4 h-4 text-violet-400" />}
        data={filterRows(FORECAST_TABLE_DATA)}
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
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="group relative rounded-2xl overflow-hidden">
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accentBorder} via-transparent p-px`}>
        <div className="w-full h-full rounded-2xl bg-[#070709]" />
      </div>
      <div className={`absolute -top-16 -left-16 w-40 h-40 bg-gradient-to-br ${glowClass} to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

      <div className="relative">
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
                <th className="w-8 px-3 py-3.5" />
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
              {data.map((row, i) => {
                const isExpanded = expandedIdx === i;
                return (
                  <ExpandableRow
                    key={`${row.date}-${i}`}
                    row={row}
                    isExpanded={isExpanded}
                    onToggle={() => setExpandedIdx(isExpanded ? null : i)}
                    accentColor={accentColor}
                  />
                );
              })}
              {data.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-500 text-sm">
                    No rows match the current search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ExpandableRow({ row, isExpanded, onToggle, accentColor }: {
  row: TabularRow;
  isExpanded: boolean;
  onToggle: () => void;
  accentColor: string;
}) {
  const total = row.customerUse + row.internalUse + row.freePool;

  return (
    <>
      <tr className="table-row-hover cursor-pointer" onClick={onToggle}>
        <td className="px-3 py-3.5 text-gray-500">
          {isExpanded
            ? <ChevronDown className="w-4 h-4 text-gray-400" />
            : <ChevronRight className="w-4 h-4 text-gray-600" />
          }
        </td>
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
      {isExpanded && (
        <tr>
          <td colSpan={8} className="bg-[#060608] px-8 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <BreakdownCard label="Customer Use" value={row.customerUse} total={total} color="#10B981" />
              <BreakdownCard label="Internal Use" value={row.internalUse} total={total} color="#F59E0B" />
              <BreakdownCard label="Free Pool" value={row.freePool} total={total} color="#6366F1" />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function BreakdownCard({ label, value, total, color }: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="bg-[#0a0a0a] rounded-xl p-3 border border-[#1a1a1a]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs text-gray-400">{label}</span>
        </div>
        <span className="text-xs font-bold tabular-nums" style={{ color }}>{pct}%</span>
      </div>
      <p className="text-lg font-bold text-white tabular-nums">{value.toLocaleString()}</p>
      <div className="mt-2 w-full bg-[#1a1a1a] rounded-full h-1.5 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
