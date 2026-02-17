'use client';

import { useEffect } from 'react';
import { X, BarChart3, ArrowUpDown, Headphones, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { QuotaUsageItem, QuotaAdjustment, SupportCase } from '../constants';
import { ADJUSTMENT_STATUS_STYLES, CASE_STATUS_STYLES } from '../constants';

type ModalData =
  | { type: 'usage'; data: QuotaUsageItem }
  | { type: 'adjustment'; data: QuotaAdjustment }
  | { type: 'support'; data: SupportCase };

interface QuotaDetailModalProps {
  entry: ModalData | null;
  onClose: () => void;
}

function formatStatus(status: string) {
  return status.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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

const TYPE_CONFIG = {
  usage: { label: 'Current Usage', icon: BarChart3, accent: '#29B5E8' },
  adjustment: { label: 'Quota Adjustment', icon: ArrowUpDown, accent: '#8B5CF6' },
  support: { label: 'Support Case', icon: Headphones, accent: '#F59E0B' },
};

export default function QuotaDetailModal({ entry, onClose }: QuotaDetailModalProps) {
  useEffect(() => {
    if (!entry) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [entry, onClose]);

  if (!entry) return null;

  const config = TYPE_CONFIG[entry.type];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${config.accent}, transparent)` }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg border border-[#2a2a2a]" style={{ backgroundColor: `${config.accent}15` }}>
              <config.icon className="w-4 h-4" style={{ color: config.accent }} />
            </div>
            <span className="text-sm font-medium text-gray-400">{config.label}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#1a1a1a] text-gray-500 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {entry.type === 'usage' && <UsageContent data={entry.data} />}
          {entry.type === 'adjustment' && <AdjustmentContent data={entry.data} />}
          {entry.type === 'support' && <SupportContent data={entry.data} />}
        </div>
      </div>
    </div>
  );
}

/* ─── Current Usage ─── */

function UsageContent({ data }: { data: QuotaUsageItem }) {
  const pct = Math.round((data.usage / data.limit) * 100 * 10) / 10;

  return (
    <>
      {/* Quota Name + Instance Type */}
      <div>
        <h3 className="text-lg font-semibold text-white">{data.quotaName}</h3>
        <span className="inline-block mt-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a]">
          {data.instanceType}
        </span>
      </div>

      {/* Usage gauge */}
      <div className="bg-black/50 rounded-xl p-4 border border-[#1a1a1a]">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Usage</p>
            <p className="text-2xl font-bold text-white tabular-nums">{data.usage} <span className="text-sm text-gray-500 font-normal">/ {data.limit}</span></p>
          </div>
          <p className={`text-2xl font-bold tabular-nums ${getPctColor(pct)}`}>{pct}%</p>
        </div>
        <div className="w-full bg-[#1a1a1a] rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getBarColor(pct)} transition-all duration-500`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>

      {/* Detail fields */}
      <div className="space-y-0 divide-y divide-[#1a1a1a]">
        <DetailRow label="Subscription Name" value={data.subscriptionName} />
        <CopyableRow label="Subscription ID" value={data.subscriptionId} />
        <DetailRow label="Region" value={data.region} />
        <DetailRow label="Last Updated" value={data.lastUpdated} />
      </div>
    </>
  );
}

/* ─── Quota Adjustment ─── */

function AdjustmentContent({ data }: { data: QuotaAdjustment }) {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{data.quotaName}</h3>
          <span className="inline-block mt-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a]">
            {data.instanceType}
          </span>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${ADJUSTMENT_STATUS_STYLES[data.status]}`}>
          {formatStatus(data.status)}
        </span>
      </div>

      {/* Usage + Limits */}
      <div className="bg-black/50 rounded-xl p-4 border border-[#1a1a1a]">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Usage</p>
            <p className="text-xl font-bold text-white tabular-nums">{data.usage}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Limit</p>
            <p className="text-xl font-bold text-white tabular-nums">{data.limit}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Usage %</p>
            <p className={`text-xl font-bold tabular-nums ${getPctColor(data.usagePct)}`}>{data.usagePct}%</p>
          </div>
        </div>
      </div>

      {/* Detail fields */}
      <div className="space-y-0 divide-y divide-[#1a1a1a]">
        <DetailRow label="Subscription Name" value={data.subscriptionName} />
        <CopyableRow label="Subscription ID" value={data.subscriptionId} />
        <DetailRow label="Region" value={data.region} />
        <DetailRow label="Last Updated" value={data.lastUpdated} />
      </div>
    </>
  );
}

/* ─── Support Case ─── */

function SupportContent({ data }: { data: SupportCase }) {
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{data.quotaName}</h3>
          <span className="text-sm text-[#29B5E8] font-medium mt-0.5 block">{data.supportId}</span>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${CASE_STATUS_STYLES[data.status]}`}>
          {formatStatus(data.status)}
        </span>
      </div>

      {/* Limits */}
      <div className="bg-black/50 rounded-xl p-4 border border-[#1a1a1a]">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Limit</p>
            <p className="text-xl font-bold text-white tabular-nums">{data.currentLimit.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Requested</p>
            <p className="text-xl font-bold text-white tabular-nums">{data.requested.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Usage %</p>
            <p className={`text-xl font-bold tabular-nums ${getPctColor(data.usagePct)}`}>{data.usagePct}%</p>
          </div>
        </div>
      </div>

      {/* Detail fields */}
      <div className="space-y-0 divide-y divide-[#1a1a1a]">
        <DetailRow label="Subscription Name" value={data.subscriptionName} />
        <CopyableRow label="Subscription ID" value={data.subscriptionId} />
        <DetailRow label="Region" value={data.region} />
        <DetailRow label="Requestor" value={data.requestor} />
        <DetailRow label="Created" value={data.created} />
        <DetailRow label="Last Updated" value={data.lastUpdated} />
      </div>
    </>
  );
}

/* ─── Shared Field Components ─── */

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm text-white font-medium text-right max-w-[60%] truncate">{value}</span>
    </div>
  );
}

function CopyableRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 text-sm text-gray-300 font-mono hover:text-white transition-colors group"
        title="Click to copy"
      >
        <span className="truncate max-w-[200px]">{value}</span>
        {copied
          ? <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          : <Copy className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 flex-shrink-0 transition-colors" />
        }
      </button>
    </div>
  );
}
