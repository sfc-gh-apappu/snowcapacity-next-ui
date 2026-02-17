'use client';

import { useState } from 'react';
import { Search, Layers, Server, ServerOff, DollarSign } from 'lucide-react';
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

  const filtered = data.filter((item) =>
    item.reservationId.toLowerCase().includes(search.toLowerCase()) ||
    item.accountName.toLowerCase().includes(search.toLowerCase()) ||
    item.instanceType.toLowerCase().includes(search.toLowerCase())
  );

  const totalReservations = filtered.length;
  const totalInstances = filtered.reduce((sum, r) => sum + r.totalInstanceCount, 0);
  const totalUsedInstances = filtered.reduce((sum, r) => sum + r.usedInstanceCount, 0);
  const totalUnusedInstances = filtered.reduce((sum, r) => sum + r.availableInstanceCount, 0);
  const totalUnusedSpend = filtered.reduce((sum, r) => {
    if (r.totalInstanceCount === 0) return sum;
    const unusedRatio = r.availableInstanceCount / r.totalInstanceCount;
    return sum + (r.monthlyRate * unusedRatio);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard
          icon={<Layers className="w-5 h-5 text-[#29B5E8]" />}
          label="Total Reservations"
          value={totalReservations.toString()}
          accent="border-[#29B5E8]/30 hover:border-[#29B5E8]/50"
          bgGlow="from-[#29B5E8]/10"
        />
        <SummaryCard
          icon={<Server className="w-5 h-5 text-emerald-400" />}
          label="Total Instances"
          value={totalInstances.toLocaleString()}
          accent="border-emerald-500/30 hover:border-emerald-500/50"
          bgGlow="from-emerald-500/10"
        />
        <SummaryCard
          icon={<Server className="w-5 h-5 text-violet-400" />}
          label="Used Instances"
          value={totalUsedInstances.toLocaleString()}
          accent="border-violet-500/30 hover:border-violet-500/50"
          bgGlow="from-violet-500/10"
        />
        <SummaryCard
          icon={<ServerOff className="w-5 h-5 text-yellow-400" />}
          label="Unused Instances"
          value={totalUnusedInstances.toLocaleString()}
          accent="border-yellow-500/30 hover:border-yellow-500/50"
          bgGlow="from-yellow-500/10"
        />
        <SummaryCard
          icon={<DollarSign className="w-5 h-5 text-red-400" />}
          label="Unused Spend"
          value={`$${Math.round(totalUnusedSpend).toLocaleString()}/mo`}
          accent="border-red-500/30 hover:border-red-500/50"
          bgGlow="from-red-500/10"
        />
      </div>

      {/* Search */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{filtered.length} reservation{filtered.length !== 1 ? 's' : ''}</p>
        <div className="relative w-72">
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
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">AWS Reservation ID</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account Name</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Instance Type</th>
                <th className="text-right px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="text-right px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Used</th>
                <th className="text-right px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Available</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider min-w-[150px]">Usage</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Created</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">State</th>
                <th className="px-3 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {filtered.map((item) => {
                const pct = getUsagePct(item.totalInstanceCount, item.availableInstanceCount);
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
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
                    <td className="px-3 py-4">
                      {item.state === 'active' && (
                        <ActionsDropdown onAction={(a) => setPendingAction(a)} />
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-5 py-12 text-center text-gray-500 text-sm">
                    No reservations match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ReservationDetailModal item={selected} onClose={() => setSelected(null)} />
      <ActionUnavailableModal action={pendingAction} onClose={() => setPendingAction(null)} />
    </div>
  );
}

/* ─── Summary Card ─── */

function SummaryCard({
  icon, label, value, accent, bgGlow,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  bgGlow: string;
}) {
  return (
    <div className={`relative group bg-[#0a0a0a] rounded-2xl p-5 border ${accent} transition-all duration-300 overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGlow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-black/50 border border-[#1a1a1a]">
            {icon}
          </div>
          <p className="text-sm text-gray-400 font-medium">{label}</p>
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
