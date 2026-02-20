'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, CheckCircle, Clock, Loader, XCircle, AlertTriangle } from 'lucide-react';
import type { QuotaAdjustmentRow, AdjustmentStatusGroup } from '../constants';
import { getAdjustmentStatusStyle, getStatusGroup } from '../constants';
import QuotaDetailModal from './QuotaDetailModal';

function getStatusIcon(status: string) {
  const group = getStatusGroup(status);
  switch (group) {
    case 'completed': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    case 'in-progress': return <Loader className="w-4 h-4 text-[#29B5E8]" />;
    case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
    default: return <Clock className="w-4 h-4 text-gray-400" />;
  }
}

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

type TimeRange = 'all' | '7d' | '30d';

const STATUS_GROUPS: { value: AdjustmentStatusGroup; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'failed', label: 'Failed' },
];

export default function QuotaAdjustmentsTab({ data, initialStatus, initialTimeRange }: { data: QuotaAdjustmentRow[]; initialStatus?: string; initialTimeRange?: string }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AdjustmentStatusGroup>(
    (initialStatus as AdjustmentStatusGroup) ?? 'all',
  );
  const [timeRange, setTimeRange] = useState<TimeRange>((initialTimeRange as TimeRange) ?? 'all');
  const [selected, setSelected] = useState<QuotaAdjustmentRow | null>(null);

  useEffect(() => {
    if (initialStatus) setStatusFilter((initialStatus as AdjustmentStatusGroup) ?? 'all');
    if (initialTimeRange) setTimeRange((initialTimeRange as TimeRange) ?? 'all');
  }, [initialStatus, initialTimeRange]);

  const filtered = useMemo(() => {
    const now = new Date();
    return data.filter((item) => {
      if (statusFilter !== 'all' && getStatusGroup(item.requestStatus) !== statusFilter) return false;
      if (timeRange !== 'all') {
        const days = timeRange === '7d' ? 7 : 30;
        const cutoff = new Date(now);
        cutoff.setDate(cutoff.getDate() - days);
        if (new Date(item.createdAt) < cutoff) return false;
      }
      if (search) {
        const term = search.toLowerCase();
        if (
          !item.quotaName.toLowerCase().includes(term) &&
          !item.id.toLowerCase().includes(term) &&
          !item.subscriptionName.toLowerCase().includes(term) &&
          !item.region.toLowerCase().includes(term)
        ) return false;
      }
      return true;
    });
  }, [data, statusFilter, timeRange, search]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
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
          <div className="w-px h-5 bg-[#2a2a2a] hidden sm:block" />
          <div className="flex gap-1">
            {(['all', '7d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  timeRange === r
                    ? 'bg-[#29B5E8]/15 text-[#29B5E8] border border-[#29B5E8]/30'
                    : 'text-gray-500 hover:text-white border border-transparent'
                }`}
              >
                {r === 'all' ? 'All time' : `Last ${r}`}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search adjustments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29B5E8]/50 text-sm text-white placeholder-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/50 border-b border-[#1a1a1a]">
              <tr>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Region</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Subscription</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quota Name</th>
                <th className="text-right px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Previous Limit</th>
                <th className="text-right px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Requested</th>
                <th className="text-right px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Usage %</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Requestor</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {filtered.map((item, i) => (
                <tr
                  key={item.id || `adj-${i}`}
                  onClick={() => setSelected(item)}
                  className="table-row-hover cursor-pointer"
                >
                  <td className="px-5 py-4 text-sm text-gray-400">{item.region}</td>
                  <td className="px-5 py-4 text-sm text-gray-400 max-w-[200px] truncate">{item.subscriptionName}</td>
                  <td className="px-5 py-4 text-sm font-medium text-white">{item.quotaName}</td>
                  <td className="px-5 py-4 text-sm text-gray-400 text-right tabular-nums">{item.limitBeforeAdjustment}</td>
                  <td className="px-5 py-4 text-sm text-white font-medium text-right tabular-nums">{item.requestedNewLimit}</td>
                  <td className="px-5 py-4 text-right">
                    <span className={`text-sm font-bold tabular-nums ${getPctColor(item.usagePercent)}`}>{item.usagePercent}%</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.requestStatus)}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getAdjustmentStatusStyle(item.requestStatus)}`}>
                        {formatStatus(item.requestStatus)}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-400">{item.requestor}</td>
                  <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{item.createdAt}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-gray-500 text-sm">
                    No adjustments match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <QuotaDetailModal
        entry={selected ? { type: 'adjustment', data: selected } : null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
