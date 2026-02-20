'use client';

import { useState, useMemo } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import type { QuotaAdjustmentRow } from '../constants';
import { getAdjustmentStatusStyle, TICKET_URL_PATTERN } from '../constants';
import QuotaDetailModal from './QuotaDetailModal';

function formatStatus(status: string) {
  const s = status.toLowerCase();
  if (s === 'inprogress') return 'In Progress';
  if (s === 'partiallycompleted') return 'Partially Completed';
  if (s === 'timedout') return 'Timed Out';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getPctColor(pct: number) {
  if (pct >= 90) return 'text-red-400';
  if (pct >= 80) return 'text-orange-400';
  if (pct >= 50) return 'text-yellow-400';
  return 'text-emerald-400';
}

const OPEN_STATUSES = new Set(['submitted', 'active', 'inprogress', 'partiallycompleted']);

type StatusGroup = 'all' | 'open' | 'completed' | 'failed';

const STATUS_GROUPS: { value: StatusGroup; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
];

function getStatusBucket(status: string): StatusGroup {
  const s = status.toLowerCase();
  if (OPEN_STATUSES.has(s)) return 'open';
  if (s === 'completed') return 'completed';
  if (s === 'failed' || s === 'timedout') return 'failed';
  return 'all';
}

export default function SupportCasesTab({ data, initialStatus }: { data: QuotaAdjustmentRow[]; initialStatus?: string }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusGroup>((initialStatus as StatusGroup) ?? 'all');
  const [selected, setSelected] = useState<QuotaAdjustmentRow | null>(null);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (statusFilter !== 'all' && getStatusBucket(item.requestStatus) !== statusFilter) return false;
      if (search) {
        const term = search.toLowerCase();
        if (
          !item.quotaName.toLowerCase().includes(term) &&
          !item.cspSupportRequestId.toLowerCase().includes(term) &&
          !item.subscriptionName.toLowerCase().includes(term) &&
          !item.region.toLowerCase().includes(term)
        ) return false;
      }
      return true;
    });
  }, [data, statusFilter, search]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1.5">
            {STATUS_GROUPS.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatusFilter(s.value)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                  statusFilter === s.value
                    ? 'bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white shadow-lg shadow-[#29B5E8]/30'
                    : 'bg-[#0a0a0a] border border-[#1a1a1a] text-gray-400 hover:text-white hover:border-[#2a2a2a]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{filtered.length} case{filtered.length !== 1 ? 's' : ''}</span>
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
      </div>

      {/* Table */}
      <div className="bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] overflow-hidden">
        <table className="w-full">
          <thead className="bg-black/50 border-b border-[#1a1a1a]">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Support ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quota Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Region</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden xl:table-cell">Subscription</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">Limit Change</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Usage</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Requestor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {filtered.map((item, i) => (
              <tr
                key={item.id || `sc-${i}`}
                onClick={() => setSelected(item)}
                className="table-row-hover cursor-pointer"
              >
                <td className="px-4 py-3 text-sm font-medium">
                  <a
                    href={`${TICKET_URL_PATTERN}${item.cspSupportRequestId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[#29B5E8] hover:text-white transition-colors"
                  >
                    {item.cspSupportRequestId}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-white max-w-[200px] truncate">{item.quotaName}</td>
                <td className="px-4 py-3 text-sm text-gray-400 hidden lg:table-cell">{item.region}</td>
                <td className="px-4 py-3 text-sm text-gray-400 hidden xl:table-cell max-w-[180px] truncate">{item.subscriptionName}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <span className="text-sm tabular-nums text-gray-400">{item.limitBeforeAdjustment}</span>
                  <span className="text-gray-600 mx-1">→</span>
                  <span className="text-sm tabular-nums text-white font-medium">{item.requestedNewLimit}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`text-sm font-bold tabular-nums ${getPctColor(item.usagePercent)}`}>{item.usagePercent}%</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getAdjustmentStatusStyle(item.requestStatus)}`}>
                    {formatStatus(item.requestStatus)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400 hidden md:table-cell max-w-[140px] truncate">{item.requestor}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-500 text-sm">
                  No support cases match the current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <QuotaDetailModal
        entry={selected ? { type: 'support', data: selected } : null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
