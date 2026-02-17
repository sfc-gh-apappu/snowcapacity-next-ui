'use client';

import { useState, useMemo } from 'react';
import { Search, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  ADMIN_REQUESTS, REQUEST_STATUSES, REQUEST_STATUS_STYLES, UPDATE_STATUS_OPTIONS,
  type AdminRequest,
} from '../constants';

export default function RequestAdmin() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Update form state
  const [updateId, setUpdateId] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const filtered = useMemo(() => {
    return ADMIN_REQUESTS.filter((r) => {
      if (statusFilter !== 'All' && r.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          r.requestId.toLowerCase().includes(s) ||
          r.requestor.toLowerCase().includes(s) ||
          r.team.toLowerCase().includes(s) ||
          r.type.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [statusFilter, search]);

  function handleUpdate() {
    if (!updateId.trim() || !newStatus) {
      setToast({ type: 'error', msg: 'Please enter a Request ID and select a status.' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setToast({ type: 'success', msg: `Status for ${updateId} updated to "${newStatus}".` });
    setUpdateId('');
    setNewStatus('');
    setStatusMessage('');
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="space-y-8">
      {/* ── Filter & Table ── */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Status pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {REQUEST_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  statusFilter === s
                    ? 'bg-[#29B5E8]/15 text-[#29B5E8] border-[#29B5E8]/40'
                    : 'bg-[#0a0a0a] text-gray-500 border-[#1a1a1a] hover:text-gray-300 hover:border-[#2a2a2a]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-64 ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29B5E8]/50 text-sm text-white placeholder-gray-600"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/50 border-b border-[#1a1a1a]">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Request ID</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Requestor</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Team</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cloud</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Region</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono text-[#29B5E8]">{r.requestId}</td>
                    <td className="px-5 py-3.5 text-sm text-white">{r.type}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{r.requestor}</td>
                    <td className="px-5 py-3.5 text-sm text-white">{r.team}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a] font-medium">
                        {r.cloud}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-400 font-mono text-xs">{r.region}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${REQUEST_STATUS_STYLES[r.status] ?? ''}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-gray-500 text-sm">
                      No requests match the current filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Update Request Status ── */}
      <section className="bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] p-6">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Update Request Status</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 font-medium">Request ID</label>
            <input
              type="text"
              placeholder="e.g. REQ-20260201-001"
              value={updateId}
              onChange={(e) => setUpdateId(e.target.value)}
              className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#29B5E8]/50"
            />
          </div>
          <div>
            <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 font-medium">New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#29B5E8]/50 cursor-pointer"
            >
              <option value="">Select status…</option>
              {UPDATE_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 font-medium">Status Message</label>
            <input
              type="text"
              placeholder="Optional message…"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#29B5E8]/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleUpdate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#29B5E8] hover:bg-[#29B5E8]/90 text-black font-semibold text-sm transition-all"
          >
            <Send className="w-4 h-4" />
            Update Status
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
      </section>
    </div>
  );
}
