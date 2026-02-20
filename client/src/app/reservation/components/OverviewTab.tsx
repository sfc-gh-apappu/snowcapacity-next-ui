'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
} from 'recharts';
import { Layers, Server, ServerOff, DollarSign, Download, Check } from 'lucide-react';
import CountUp from '@/components/CountUp';
import type { ReservationDetail } from '../constants';

interface OverviewTabProps {
  data: ReservationDetail[];
}

const COLORS = ['#29B5E8', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#14B8A6'];

function fmt$(v: number) {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${v}`;
}

function getBarColor(pct: number) {
  if (pct >= 90) return '#10B981';
  if (pct >= 60) return '#29B5E8';
  if (pct >= 30) return '#F59E0B';
  return '#EF4444';
}

export default function OverviewTab({ data }: OverviewTabProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const totalReservations = data.length;
  const totalInstances = data.reduce((s, r) => s + r.totalInstanceCount, 0);
  const totalUsed = data.reduce((s, r) => s + r.usedInstanceCount, 0);
  const totalUnused = data.reduce((s, r) => s + r.availableInstanceCount, 0);
  const totalUnusedSpend = data.reduce((s, r) => {
    if (r.totalInstanceCount === 0) return s;
    return s + r.monthlyRate * (r.availableInstanceCount / r.totalInstanceCount);
  }, 0);

  const costByAccount = useMemo(() => {
    const map = new Map<string, { used: number; unused: number }>();
    for (const r of data) {
      const prev = map.get(r.accountName) ?? { used: 0, unused: 0 };
      const unusedRatio = r.totalInstanceCount > 0 ? r.availableInstanceCount / r.totalInstanceCount : 0;
      prev.unused += r.monthlyRate * unusedRatio;
      prev.used += r.monthlyRate * (1 - unusedRatio);
      map.set(r.accountName, prev);
    }
    return Array.from(map.entries())
      .map(([name, v]) => ({ name, used: Math.round(v.used), unused: Math.round(v.unused), total: Math.round(v.used + v.unused) }))
      .sort((a, b) => b.total - a.total);
  }, [data]);

  const byInstanceType = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of data) map.set(r.instanceType, (map.get(r.instanceType) ?? 0) + 1);
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const utilization = useMemo(() => {
    return data
      .filter((r) => r.state === 'active')
      .map((r) => {
        const pct = r.totalInstanceCount > 0 ? Math.round((r.usedInstanceCount / r.totalInstanceCount) * 100) : 0;
        return { name: r.reservationId.slice(-8), pct, full: r.reservationId, account: r.accountName, type: r.instanceType };
      })
      .sort((a, b) => a.pct - b.pct);
  }, [data]);

  const exportCostByAccount = useCallback(() => {
    const headers = ['Account', 'Used Cost', 'Unused Cost', 'Total Cost'];
    const rows = costByAccount.map((r) => [r.name, r.used, r.unused, r.total]);
    downloadCsv('reservation_cost_by_account.csv', headers, rows);
  }, [costByAccount]);

  const exportUtilization = useCallback(() => {
    const headers = ['Reservation ID', 'Account', 'Instance Type', 'Utilization %'];
    const rows = utilization.map((r) => [r.full, r.account, r.type, r.pct]);
    downloadCsv('reservation_utilization.csv', headers, rows);
  }, [utilization]);

  return (
    <div className="space-y-6">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard icon={<Layers className="w-5 h-5 text-[#29B5E8]" />} label="Total Reservations" value={totalReservations} accent="border-[#29B5E8]/30" glow="from-[#29B5E8]/10" />
        <KpiCard icon={<Server className="w-5 h-5 text-emerald-400" />} label="Total Instances" value={totalInstances} accent="border-emerald-500/30" glow="from-emerald-500/10" />
        <KpiCard icon={<Server className="w-5 h-5 text-violet-400" />} label="Used Instances" value={totalUsed} accent="border-violet-500/30" glow="from-violet-500/10" />
        <KpiCard icon={<ServerOff className="w-5 h-5 text-yellow-400" />} label="Unused Instances" value={totalUnused} accent="border-yellow-500/30" glow="from-yellow-500/10" />
        <KpiCard icon={<DollarSign className="w-5 h-5 text-red-400" />} label="Unused Spend" value={totalUnusedSpend} prefix="$" suffix="/mo" accent="border-red-500/30" glow="from-red-500/10" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost by Account */}
        <ChartCard
          title="Cost by Account"
          subtitle="Monthly spend (used vs unused)"
          accentColor="#29B5E8"
          onExport={exportCostByAccount}
          className="lg:col-span-2"
        >
          {mounted && costByAccount.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costByAccount} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt$} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
                <Tooltip content={<CostTooltip />} />
                <Bar dataKey="used" stackId="cost" fill="#29B5E8" radius={[0, 0, 0, 0]} />
                <Bar dataKey="unused" stackId="cost" fill="#EF4444" fillOpacity={0.6} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* By Instance Type */}
        <ChartCard
          title="By Instance Type"
          subtitle="Reservation distribution"
          accentColor="#8B5CF6"
        >
          {mounted && byInstanceType.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byInstanceType}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {byInstanceType.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
          {/* Legend */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {byInstanceType.slice(0, 6).map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5 text-[10px]">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-gray-400">{item.name}</span>
                </div>
              ))}
              {byInstanceType.length > 6 && <span className="text-[10px] text-gray-600">+{byInstanceType.length - 6} more</span>}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Utilization Bar */}
      <ChartCard
        title="Utilization by Reservation"
        subtitle="Active reservations sorted by usage — lowest first"
        accentColor="#F59E0B"
        onExport={exportUtilization}
        tall
      >
        {mounted && utilization.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={utilization} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={{ stroke: '#1a1a1a' }} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} />
              <Tooltip content={<UtilTooltip />} />
              <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                {utilization.map((entry, i) => (
                  <Cell key={i} fill={getBarColor(entry.pct)} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}

/* ─── KPI Card ─── */

function KpiCard({ icon, label, value, prefix, suffix, accent, glow }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  accent: string;
  glow: string;
}) {
  return (
    <div className={`relative group bg-[#0a0a0a] rounded-2xl p-4 border ${accent} transition-all duration-300 overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-black/50 border border-[#1a1a1a]">{icon}</div>
          <p className="text-xs text-gray-400 font-medium">{label}</p>
        </div>
        <p className="text-2xl font-bold text-white tabular-nums">
          <CountUp end={Math.round(value)} prefix={prefix} />{suffix && <span className="text-sm text-gray-400 ml-0.5">{suffix}</span>}
        </p>
      </div>
    </div>
  );
}

/* ─── Chart Card ─── */

function ChartCard({ title, subtitle, accentColor, onExport, children, className, tall }: {
  title: string;
  subtitle: string;
  accentColor: string;
  onExport?: () => void;
  children: React.ReactNode;
  className?: string;
  tall?: boolean;
}) {
  return (
    <div className={`group relative rounded-2xl overflow-hidden bg-[#0a0a0a] border border-[#1a1a1a] ${className ?? ''}`}>
      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
      <div className="px-5 pt-4 pb-2 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        {onExport && <ExportButton onClick={onExport} />}
      </div>
      <div className="px-2 pb-4 relative" style={{ height: tall ? 280 : 240 }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Export Button ─── */

function ExportButton({ onClick }: { onClick: () => void }) {
  const [done, setDone] = useState(false);
  const handle = () => {
    onClick();
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };
  return (
    <button
      onClick={handle}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
        done
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#3a3a3a]'
      }`}
    >
      {done ? <Check className="w-3 h-3" /> : <Download className="w-3 h-3" />}
      {done ? 'Saved' : 'CSV'}
    </button>
  );
}

/* ─── CSV Export ─── */

function downloadCsv(filename: string, headers: string[], rows: (string | number | null)[][]) {
  const escape = (v: string | number | null) => {
    if (v == null || v === '') return '';
    const s = String(v);
    return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── Tooltips ─── */

function TooltipShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm">
      {children}
    </div>
  );
}

function CostTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const used = payload.find((p) => p.dataKey === 'used')?.value ?? 0;
  const unused = payload.find((p) => p.dataKey === 'unused')?.value ?? 0;
  return (
    <TooltipShell>
      <p className="text-xs text-gray-400 mb-2 font-medium">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-[#29B5E8]" />
          <span className="text-gray-400">Used:</span>
          <span className="text-white font-semibold">${used.toLocaleString()}/mo</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <span className="text-gray-400">Unused:</span>
          <span className="text-white font-semibold">${unused.toLocaleString()}/mo</span>
        </div>
        <div className="text-[11px] text-gray-500 pt-1 border-t border-[#2a2a2a]">
          Total: <span className="text-white font-medium">${(used + unused).toLocaleString()}/mo</span>
        </div>
      </div>
    </TooltipShell>
  );
}

function PieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <TooltipShell>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">{payload[0].name}:</span>
        <span className="text-white font-semibold">{payload[0].value} reservation{payload[0].value !== 1 ? 's' : ''}</span>
      </div>
    </TooltipShell>
  );
}

function UtilTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { full: string; account: string; type: string; pct: number } }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <TooltipShell>
      <p className="text-xs font-mono text-[#29B5E8] mb-1">{d.full}</p>
      <p className="text-xs text-gray-400 mb-2">{d.account} &middot; {d.type}</p>
      <p className="text-sm font-semibold" style={{ color: getBarColor(d.pct) }}>{d.pct}% utilized</p>
    </TooltipShell>
  );
}
