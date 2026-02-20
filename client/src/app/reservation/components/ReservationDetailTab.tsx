'use client';

import { useState, useMemo } from 'react';
import { Search, Check, XCircle, X } from 'lucide-react';
import { useSortableData, SortHeader } from '@/components/SortableTable';
import type { ReservationDetail } from '../constants';
import { STATE_STYLES } from '../constants';
import ReservationDetailModal from './ReservationDetailModal';
import ActionsDropdown, { ActionUnavailableModal } from './ActionsDropdown';

function formatState(state: string) {
  return state.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getUsagePct(total: number, available: number) {
  if (total === 0) return 0;
  return Math.round(((total - available) / total) * 100);
}

function getBarColor(pct: number) {
  if (pct >= 90) return 'from-emerald-500 to-emerald-600';
  if (pct >= 60) return 'from-[#29B5E8] to-[#56C9F5]';
  if (pct >= 30) return 'from-yellow-500 to-amber-400';
  return 'from-red-400 to-orange-400';
}

export default function ReservationDetailTab({ data }: { data: ReservationDetail[] }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ReservationDetail | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  const searched = data.filter((item) =>
    item.reservationId.toLowerCase().includes(search.toLowerCase()) ||
    item.accountName.toLowerCase().includes(search.toLowerCase()) ||
    item.instanceType.toLowerCase().includes(search.toLowerCase())
  );

  const { sorted: filtered, sort, toggle } = useSortableData(searched);

  const activeIds = useMemo(() => new Set(filtered.filter((r) => r.state === 'active').map((r) => r.id)), [filtered]);

  const allActiveChecked = activeIds.size > 0 && [...activeIds].every((id) => checkedIds.has(id));
  const someChecked = checkedIds.size > 0;

  const toggleAll = () => {
    if (allActiveChecked) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(activeIds));
    }
  };

  const toggleOne = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-gray-500">{filtered.length} reservation{filtered.length !== 1 ? 's' : ''}</p>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search reservations..."
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
                <th className="px-3 py-4 w-10">
                  <button onClick={toggleAll} className="flex items-center justify-center">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      allActiveChecked ? 'bg-[#29B5E8] border-[#29B5E8]' : 'border-[#3a3a3a] hover:border-[#555]'
                    }`}>
                      {allActiveChecked && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                </th>
                <SortHeader label="AWS Reservation ID" sortKey="reservationId" currentSort={sort} onSort={toggle} />
                <SortHeader label="Account Name" sortKey="accountName" currentSort={sort} onSort={toggle} />
                <SortHeader label="Type" sortKey="reservationType" currentSort={sort} onSort={toggle} />
                <SortHeader label="Instance Type" sortKey="instanceType" currentSort={sort} onSort={toggle} />
                <SortHeader label="Total" sortKey="totalInstanceCount" currentSort={sort} onSort={toggle} align="right" />
                <SortHeader label="Used" sortKey="usedInstanceCount" currentSort={sort} onSort={toggle} align="right" />
                <SortHeader label="Available" sortKey="availableInstanceCount" currentSort={sort} onSort={toggle} align="right" />
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[150px]">Usage</th>
                <SortHeader label="Created" sortKey="createdDate" currentSort={sort} onSort={toggle} />
                <SortHeader label="State" sortKey="state" currentSort={sort} onSort={toggle} />
                <th className="px-3 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {filtered.map((item) => {
                const pct = getUsagePct(item.totalInstanceCount, item.availableInstanceCount);
                const isActive = item.state === 'active';
                const isChecked = checkedIds.has(item.id);
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className={`table-row-hover cursor-pointer ${isChecked ? 'bg-[#29B5E8]/5' : ''}`}
                  >
                    <td className="px-3 py-4" onClick={(e) => e.stopPropagation()}>
                      {isActive ? (
                        <button onClick={() => toggleOne(item.id)} className="flex items-center justify-center">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-[#29B5E8] border-[#29B5E8]' : 'border-[#3a3a3a] hover:border-[#555]'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </button>
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono text-[#29B5E8]">{item.reservationId}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-white">{item.accountName}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                        item.reservationType === 'Standard'
                          ? 'bg-[#1a1a1a] text-gray-300 border-[#2a2a2a]'
                          : item.reservationType === 'ODCR'
                            ? 'bg-[#29B5E8]/10 text-[#29B5E8] border-[#29B5E8]/30'
                            : 'bg-violet-500/10 text-violet-400 border-violet-500/30'
                      }`}>
                        {item.reservationType}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a]">
                        {item.instanceType}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-white font-medium text-right tabular-nums">{item.totalInstanceCount}</td>
                    <td className="px-5 py-4 text-sm text-emerald-400 font-medium text-right tabular-nums">{item.usedInstanceCount}</td>
                    <td className="px-5 py-4 text-sm text-gray-400 text-right tabular-nums">{item.availableInstanceCount}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${getBarColor(pct)} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-white w-10 text-right tabular-nums">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{item.createdDate.split(' ')[0]}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATE_STYLES[item.state]}`}>
                        {formatState(item.state)}
                      </span>
                    </td>
                    <td className="px-3 py-4" onClick={(e) => e.stopPropagation()}>
                      {isActive && (
                        <ActionsDropdown onAction={(a) => setPendingAction(a)} />
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-5 py-12 text-center text-gray-500 text-sm">
                    No reservations match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {someChecked && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 bg-[#111] border border-[#2a2a2a] rounded-2xl shadow-2xl shadow-black/60 backdrop-blur-md">
          <span className="text-sm text-white font-medium tabular-nums">{checkedIds.size} selected</span>
          <div className="w-px h-5 bg-[#2a2a2a]" />
          <button
            onClick={() => setPendingAction('bulk-cancel')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            Cancel Selected
          </button>
          <button
            onClick={() => setCheckedIds(new Set())}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 text-sm font-medium hover:text-white hover:border-[#3a3a3a] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      )}

      {/* Modals */}
      <ReservationDetailModal item={selected} onClose={() => setSelected(null)} />
      <ActionUnavailableModal action={pendingAction} onClose={() => setPendingAction(null)} />
    </div>
  );
}
