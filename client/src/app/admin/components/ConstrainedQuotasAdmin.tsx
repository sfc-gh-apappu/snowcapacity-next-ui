'use client';

import { useState, useMemo } from 'react';
import { Search, Eye, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { CONSTRAINED_QUOTAS, CONSTRAINED_REGION_OPTIONS, type ConstrainedQuota } from '../constants';

type SubView = 'view' | 'add';

export default function ConstrainedQuotasAdmin() {
  const [subView, setSubView] = useState<SubView>('view');

  return (
    <div className="space-y-6">
      {/* Sub-nav pills */}
      <div className="flex items-center gap-2">
        {([
          { key: 'view', label: 'View Constrained Quotas', icon: Eye },
          { key: 'add', label: 'Add Constrained Quota', icon: Plus },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSubView(key)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              subView === key
                ? 'bg-[#29B5E8]/15 text-[#29B5E8] border-[#29B5E8]/40'
                : 'bg-[#0a0a0a] text-gray-500 border-[#1a1a1a] hover:text-gray-300 hover:border-[#2a2a2a]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {subView === 'view' ? <ViewConstrained /> : <AddConstrained onDone={() => setSubView('view')} />}
    </div>
  );
}

/* ─────────── View Constrained Quotas ─────────── */

function ViewConstrained() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return CONSTRAINED_QUOTAS;
    const s = search.toLowerCase();
    return CONSTRAINED_QUOTAS.filter(
      (q) =>
        q.quotaName.toLowerCase().includes(s) ||
        q.region.toLowerCase().includes(s)
    );
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{filtered.length} constrained quota{filtered.length !== 1 ? 's' : ''}</p>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search quotas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29B5E8]/50 text-sm text-white placeholder-gray-600"
          />
        </div>
      </div>

      <div className="bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/50 border-b border-[#1a1a1a]">
              <tr>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quota Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Region</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Increment %</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Created</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {filtered.map((q) => (
                <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-sm text-white font-medium">{q.quotaName}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a]">{q.region}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm font-bold text-[#29B5E8] tabular-nums">{q.incrementPct}%</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{q.created}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{q.lastUpdated}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-500 text-sm">
                    No constrained quotas match
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

/* ─────────── Add Constrained Quota ─────────── */

function AddConstrained({ onDone }: { onDone: () => void }) {
  const [quotaName, setQuotaName] = useState('');
  const [region, setRegion] = useState('');
  const [incrementPct, setIncrementPct] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!quotaName.trim() || !region || !incrementPct) {
      setToast({ type: 'error', msg: 'Please fill in all required fields.' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setToast({ type: 'success', msg: 'Constrained quota added successfully.' });
    setTimeout(() => { setToast(null); onDone(); }, 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 font-medium">Quota Name *</label>
          <input
            type="text"
            value={quotaName}
            onChange={(e) => setQuotaName(e.target.value)}
            placeholder="e.g. standardEDSv5Family"
            className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#29B5E8]/50"
          />
        </div>
        <div>
          <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 font-medium">Region *</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#29B5E8]/50 cursor-pointer"
          >
            <option value="">Select region…</option>
            {CONSTRAINED_REGION_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 font-medium">Increment % *</label>
          <input
            type="number"
            value={incrementPct}
            onChange={(e) => setIncrementPct(e.target.value)}
            placeholder="e.g. 10"
            className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#29B5E8]/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#29B5E8] hover:bg-[#29B5E8]/90 text-black font-semibold text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Constrained Quota
        </button>
        {toast && (
          <div className={`inline-flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-left-2 duration-200 ${
            toast.type === 'success' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
          </div>
        )}
      </div>
    </form>
  );
}
