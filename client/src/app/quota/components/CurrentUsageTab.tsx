'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import type { QuotaUsageItem } from '../constants';
import QuotaDetailModal from './QuotaDetailModal';

function getUsagePct(item: QuotaUsageItem) {
  return Math.round((item.usage / item.limit) * 100);
}

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

export default function CurrentUsageTab({ data }: { data: QuotaUsageItem[] }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<QuotaUsageItem | null>(null);

  const filtered = data.filter((item) =>
    item.quotaName.toLowerCase().includes(search.toLowerCase()) ||
    item.instanceType.toLowerCase().includes(search.toLowerCase()) ||
    item.region.toLowerCase().includes(search.toLowerCase()) ||
    item.subscriptionName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{filtered.length} quota{filtered.length !== 1 ? 's' : ''} found</p>
        <div className="relative w-72">
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
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Instance Type</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quota Name</th>
                <th className="text-right px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Usage</th>
                <th className="text-right px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Limit</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[180px]">Usage %</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Updated</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Region</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Subscription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {filtered.map((item) => {
                const pct = getUsagePct(item);
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a]">
                        {item.instanceType}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-white">{item.quotaName}</td>
                    <td className="px-5 py-4 text-sm text-white font-medium text-right tabular-nums">{item.usage}</td>
                    <td className="px-5 py-4 text-sm text-gray-400 text-right tabular-nums">{item.limit}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${getBarColor(pct)} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
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
