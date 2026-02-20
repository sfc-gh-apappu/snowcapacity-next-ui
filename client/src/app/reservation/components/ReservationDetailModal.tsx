'use client';

import { useEffect } from 'react';
import { X, ClipboardList, DollarSign } from 'lucide-react';
import type { ReservationDetail } from '../constants';
import { STATE_STYLES } from '../constants';

interface Props {
  item: ReservationDetail | null;
  onClose: () => void;
}

function formatState(state: string) {
  return state.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export default function ReservationDetailModal({ item, onClose }: Props) {
  useEffect(() => {
    if (!item) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#29B5E8] to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#29B5E8]/10 border border-[#29B5E8]/20">
              <ClipboardList className="w-4 h-4 text-[#29B5E8]" />
            </div>
            <span className="text-sm font-medium text-gray-400">Reservation Detail</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#1a1a1a] text-gray-500 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Title + State */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-mono text-[#29B5E8] mb-1">{item.reservationId}</p>
              <h3 className="text-lg font-semibold text-white">{item.ownerAccountName}</h3>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${STATE_STYLES[item.state]}`}>
              {formatState(item.state)}
            </span>
          </div>

          {/* Instance stats card */}
          <div className="bg-black/50 rounded-xl p-4 border border-[#1a1a1a]">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total</p>
                <p className="text-xl font-bold text-white tabular-nums">{item.totalInstanceCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Used</p>
                <p className="text-xl font-bold text-emerald-400 tabular-nums">{item.usedInstanceCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Available</p>
                <p className="text-xl font-bold text-yellow-400 tabular-nums">{item.availableInstanceCount}</p>
              </div>
            </div>
          </div>

          {/* Cost & Utilization card */}
          <CostCard item={item} />

          {/* Detail fields */}
          <div className="space-y-0 divide-y divide-[#1a1a1a]">
            <DetailRow label="AWS Reservation ID" value={item.reservationId} mono />
            <DetailRow label="Instance Type" value={item.instanceType} mono />
            <DetailRow label="Instance Platform" value={item.instancePlatform} />
            <DetailRow label="Reservation Type" value={item.reservationType} />
            <DetailRow label="Instance Match Criteria" value={item.instanceMatchCriteria} />
            <DetailRow label="Unlimited Use" value={item.unlimitedUse ? 'True' : 'False'} />
            <DetailRow label="Availability Zone" value={item.availabilityZone} />
            <DetailRow label="Region" value={item.region} />
            <DetailRow label="Owner Account ID" value={item.ownerAccountId} mono />
            <DetailRow label="Owner Account Name" value={item.ownerAccountName} />
            <DetailRow label="Created Date" value={item.createdDate} />
            <DetailRow label="Start Date" value={item.startDate} />
            <DetailRow label="End Date" value={item.endDate ?? 'N/A'} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CostCard({ item }: { item: ReservationDetail }) {
  const utilPct = item.totalInstanceCount > 0
    ? Math.round((item.usedInstanceCount / item.totalInstanceCount) * 100)
    : 0;
  const unusedRatio = item.totalInstanceCount > 0
    ? item.availableInstanceCount / item.totalInstanceCount
    : 0;
  const unusedCost = Math.round(item.monthlyRate * unusedRatio);

  const barColor = utilPct >= 90
    ? 'from-emerald-500 to-emerald-600'
    : utilPct >= 60
      ? 'from-[#29B5E8] to-[#56C9F5]'
      : utilPct >= 30
        ? 'from-yellow-500 to-amber-400'
        : 'from-red-400 to-orange-400';

  return (
    <div className="bg-black/50 rounded-xl p-4 border border-[#1a1a1a]">
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="w-4 h-4 text-[#29B5E8]" />
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Cost &amp; Utilization</span>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Monthly Rate</p>
          <p className="text-lg font-bold text-white tabular-nums">${item.monthlyRate.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Unused Cost</p>
          <p className="text-lg font-bold text-red-400 tabular-nums">${unusedCost.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Utilization</p>
          <p className="text-lg font-bold text-white tabular-nums">{utilPct}%</p>
        </div>
      </div>
      <div className="relative bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
          style={{ width: `${utilPct}%` }}
        />
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm text-white font-medium text-right max-w-[55%] truncate ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}
