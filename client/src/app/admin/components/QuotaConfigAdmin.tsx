'use client';

import { useState, useMemo } from 'react';
import { Search, Eye, Plus, CheckCircle2, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import {
  QUOTA_CONFIGS, CLOUD_OPTIONS, TEAM_OPTIONS,
  type QuotaConfig,
} from '../constants';

type SubView = 'view' | 'add';

export default function QuotaConfigAdmin() {
  const [subView, setSubView] = useState<SubView>('view');

  return (
    <div className="space-y-6">
      {/* Sub-nav pills */}
      <div className="flex items-center gap-2">
        {([
          { key: 'view', label: 'View Configurations', icon: Eye },
          { key: 'add', label: 'Add Configuration', icon: Plus },
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

      {subView === 'view' ? <ViewConfigs /> : <AddConfig onDone={() => setSubView('view')} />}
    </div>
  );
}

/* ─────────── View Configurations ─────────── */

function ViewConfigs() {
  const [search, setSearch] = useState('');
  const [enabledOnly, setEnabledOnly] = useState(false);

  const filtered = useMemo(() => {
    return QUOTA_CONFIGS.filter((c) => {
      if (enabledOnly && !c.enabled) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          c.cloud.toLowerCase().includes(s) ||
          c.instanceType.toLowerCase().includes(s) ||
          c.quotaName.toLowerCase().includes(s) ||
          c.team.toLowerCase().includes(s) ||
          c.requestor.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [search, enabledOnly]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Enabled toggle */}
        <button
          onClick={() => setEnabledOnly(!enabledOnly)}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
            enabledOnly
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
              : 'bg-[#0a0a0a] text-gray-500 border-[#1a1a1a] hover:text-gray-300'
          }`}
        >
          {enabledOnly ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
          Show Enabled Only
        </button>

        <div className="relative w-64 ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search configs..."
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
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cloud</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Instance Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quota Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Team</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Requestor</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Threshold</th>
                <th className="text-center px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Enabled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a] font-medium">{c.cloud}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a]">{c.instanceType}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-white">{c.quotaName}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-400">{c.team}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-400">{c.requestor}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-sm font-bold text-white tabular-nums">{c.threshold}%</span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${c.enabled ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500 text-sm">
                    No configurations match the current filters
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

/* ─────────── Add Configuration ─────────── */

function AddConfig({ onDone }: { onDone: () => void }) {
  const [cloud, setCloud] = useState('');
  const [team, setTeam] = useState('');
  const [instanceType, setInstanceType] = useState('');
  const [requestor, setRequestor] = useState('');
  const [threshold, setThreshold] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [description, setDescription] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cloud || !team || !instanceType || !requestor || !threshold) {
      setToast({ type: 'error', msg: 'Please fill in all required fields.' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setToast({ type: 'success', msg: 'Configuration added successfully.' });
    setTimeout(() => { setToast(null); onDone(); }, 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <FormSelect label="Cloud Provider *" value={cloud} onChange={setCloud} options={CLOUD_OPTIONS} placeholder="Select cloud…" />
        <FormSelect label="Team *" value={team} onChange={setTeam} options={TEAM_OPTIONS} placeholder="Select team…" />
        <FormInput label="Instance Type *" value={instanceType} onChange={setInstanceType} placeholder="e.g. Standard_E32ds_v5" />
        <FormInput label="Requestor *" value={requestor} onChange={setRequestor} placeholder="e.g. user@snowflake.com" />
        <FormInput label="Threshold % *" value={threshold} onChange={setThreshold} placeholder="e.g. 80" type="number" />
        <div>
          <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 font-medium">Enabled</label>
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              enabled
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-black text-gray-500 border-[#1a1a1a]'
            }`}
          >
            {enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            {enabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Optional description for this configuration…"
          className="w-full px-4 py-3 bg-black border border-[#1a1a1a] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#29B5E8]/50 resize-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#29B5E8] hover:bg-[#29B5E8]/90 text-black font-semibold text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Configuration
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

/* ─── Form Helpers ─── */

function FormInput({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#29B5E8]/50"
      />
    </div>
  );
}

function FormSelect({
  label, value, onChange, options, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder: string;
}) {
  return (
    <div>
      <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#29B5E8]/50 cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
