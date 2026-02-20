'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import type { OverviewQuotaRow } from '../constants';
import QuotaDetailModal from './QuotaDetailModal';
import { useSortableData, SortHeader } from '@/components/SortableTable';

function getBarColor(pct: number) {
  if (pct >= 90) return 'from-red-500 to-red-600';
  if (pct >= 80) return 'from-orange-500 to-amber-500';
  if (pct >= 50) return 'from-yellow-500 to-amber-400';
  return 'from-[#29B5E8] to-[#56C9F5]';
}

function getPctColor(pct: number) {
  if (pct >= 90) return 'text-red-400';
  if (pct >= 80) return 'text-orange-400';
  if (pct >= 50) return 'text-yellow-400';
  return 'text-emerald-400';
}

export default function CurrentUsageTab({ data }: { data: OverviewQuotaRow[] }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<OverviewQuotaRow | null>(null);

  const filtered = data.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.quotaName.toLowerCase().includes(term) ||
      item.instanceType.toLowerCase().includes(term) ||
      item.region.toLowerCase().includes(term) ||
      item.subscriptionName.toLowerCase().includes(term)
    );
  });

  const { sorted, sort, toggle } = useSortableData(filtered, { key: 'usagePct', direction: 'desc' });

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-gray-500">{filtered.length} quota{filtered.length !== 1 ? 's' : ''} found</p>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search quotas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29B5E8]/50 text-sm text-white placeholder-gray-600"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/50 border-b border-[#1a1a1a]">
              <tr>
                <SortHeader label="Instance Type" sortKey="instanceType" currentSort={sort} onSort={toggle} />
                <SortHeader label="Quota Name" sortKey="quotaName" currentSort={sort} onSort={toggle} />
                <SortHeader label="Usage" sortKey="currentUsage" currentSort={sort} onSort={toggle} align="right" />
                <SortHeader label="Limit" sortKey="quotaLimit" currentSort={sort} onSort={toggle} align="right" />
                <SortHeader label="Usage %" sortKey="usagePct" currentSort={sort} onSort={toggle} />
                <SortHeader label="Last Updated" sortKey="lastUpdated" currentSort={sort} onSort={toggle} />
                <SortHeader label="Region" sortKey="region" currentSort={sort} onSort={toggle} />
                <SortHeader label="Subscription" sortKey="subscriptionName" currentSort={sort} onSort={toggle} />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {sorted.map((item, i) => {
                const pct = item.usagePct;
                return (
                  <tr
                    key={`${item.quotaName}-${item.subscriptionId}-${i}`}
                    onClick={() => setSelected(item)}
                    className="table-row-hover cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a]">
                        {item.instanceType}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-white">{item.quotaName}</td>
                    <td className="px-5 py-4 text-sm text-white font-medium text-right tabular-nums">{item.currentUsage}</td>
                    <td className="px-5 py-4 text-sm text-gray-400 text-right tabular-nums">{item.quotaLimit}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${getBarColor(pct)} transition-all duration-500`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold w-10 text-right tabular-nums ${getPctColor(pct)}`}>{pct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{item.lastUpdated}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{item.region}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{item.subscriptionName}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-gray-500 text-sm">
                    No quotas match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <QuotaDetailModal
        entry={selected ? { type: 'usage', data: selected } : null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
