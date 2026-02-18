'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { SUPPORT_CASES_DATA, CASE_STATUS_STYLES } from '../constants';
import type { SupportCase } from '../constants';
import QuotaDetailModal from './QuotaDetailModal';

function formatStatus(status: string) {
  return status.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getPctColor(pct: number) {
  if (pct >= 90) return 'text-red-400';
  if (pct >= 80) return 'text-orange-400';
  if (pct >= 50) return 'text-yellow-400';
  return 'text-emerald-400';
}

export default function SupportCasesTab() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<SupportCase | null>(null);

  const filtered = SUPPORT_CASES_DATA.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (search &&
      !item.quotaName.toLowerCase().includes(search.toLowerCase()) &&
      !item.supportId.toLowerCase().includes(search.toLowerCase()) &&
      !item.subscriptionName.toLowerCase().includes(search.toLowerCase())
    ) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex gap-2">
          {['all', 'open', 'in-progress', 'resolved', 'closed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                statusFilter === s
                  ? 'bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white shadow-lg shadow-[#29B5E8]/30'
                  : 'bg-[#0a0a0a] border border-[#1a1a1a] text-gray-400 hover:text-white hover:border-[#2a2a2a]'
              }`}
            >
              {s === 'all' ? 'All' : formatStatus(s)}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search cases..."
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
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Region</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Support ID</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Subscription</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quota Name</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Created</th>
                <th className="text-right px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Limit</th>
                <th className="text-right px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Request</th>
                <th className="text-right px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Usage %</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="table-row-hover cursor-pointer"
                >
                  <td className="px-5 py-4 text-sm text-gray-400">{item.region}</td>
                  <td className="px-5 py-4 text-sm font-medium text-[#29B5E8]">{item.supportId}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">{item.subscriptionName}</td>
                  <td className="px-5 py-4 text-sm font-medium text-white">{item.quotaName}</td>
                  <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{item.created}</td>
                  <td className="px-5 py-4 text-sm text-gray-400 text-right tabular-nums">{item.currentLimit.toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm text-white font-medium text-right tabular-nums">{item.requested.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right">
                    <span className={`text-sm font-bold tabular-nums ${getPctColor(item.usagePct)}`}>{item.usagePct}%</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${CASE_STATUS_STYLES[item.status]}`}>
                      {formatStatus(item.status)}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-gray-500 text-sm">
                    No support cases match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <QuotaDetailModal
        entry={selected ? { type: 'support', data: selected } : null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
