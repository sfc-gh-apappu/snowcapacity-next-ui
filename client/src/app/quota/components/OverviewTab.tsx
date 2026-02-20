'use client';

import { useState, useEffect } from 'react';
import {
  Gauge, AlertTriangle, Ticket, XCircle, ArrowUpDown,
  AlertOctagon, ExternalLink, ChevronRight, Loader2,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import CountUp from '@/components/CountUp';
import type {
  OverviewKPIs, UsageTrendPoint, TopQuotaBar, AtRiskQuotaRow,
} from '../constants';

interface OverviewTabProps {
  kpis: OverviewKPIs | null;
  usageTrend: UsageTrendPoint[];
  topQuotasByUsage: TopQuotaBar[];
  atRiskQuotas: AtRiskQuotaRow[];
  onNavigateTab: (tabId: string, filter?: string, timeRange?: string) => void;
  isLoading: boolean;
  error: string | null;
  isFiltered?: boolean;
}

function getBarFill(pct: number) {
  if (pct >= 90) return '#ef4444';
  if (pct >= 80) return '#f97316';
  if (pct >= 50) return '#eab308';
  return '#29B5E8';
}

function getPctColor(pct: number) {
  if (pct >= 90) return 'text-red-400';
  if (pct >= 80) return 'text-orange-400';
  if (pct >= 50) return 'text-yellow-400';
  return 'text-emerald-400';
}

export default function OverviewTab({
  kpis, usageTrend, topQuotasByUsage, atRiskQuotas, onNavigateTab, isLoading, error, isFiltered,
}: OverviewTabProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <XCircle className="w-10 h-10 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-1">Failed to load overview</h3>
        <p className="text-sm text-gray-500 max-w-md">{error}</p>
      </div>
    );
  }

  if (isLoading || !kpis) {
    return (
      <div className="space-y-6">
        {/* KPI skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-[#0a0a0a] rounded-2xl p-4 border border-[#1a1a1a] animate-pulse">
              <div className="h-4 w-24 bg-[#1a1a1a] rounded mb-3" />
              <div className="h-8 w-16 bg-[#1a1a1a] rounded" />
            </div>
          ))}
        </div>
        {/* Chart skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] p-5 animate-pulse">
            <div className="h-4 w-32 bg-[#1a1a1a] rounded mb-4" />
            <div className="h-[260px] bg-[#111] rounded-xl" />
          </div>
          <div className="lg:col-span-2 bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] p-5 animate-pulse">
            <div className="h-4 w-40 bg-[#1a1a1a] rounded mb-4" />
            <div className="h-[260px] bg-[#111] rounded-xl" />
          </div>
        </div>
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 text-[#29B5E8] animate-spin" />
          <span className="ml-2 text-sm text-gray-500">Loading quota data…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard
          icon={<Gauge className="w-5 h-5 text-[#29B5E8]" />}
          label="Total Quotas"
          value={kpis.totalQuotas}
          accent="border-[#29B5E8]/30"
          glow="from-[#29B5E8]/10"
        />
        <KpiCard
          icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
          label="Critical"
          subtitle="≥90%"
          value={kpis.critical}
          accent="border-red-500/30"
          glow="from-red-500/10"
          onClick={() => onNavigateTab('current-usage')}
        />
        <KpiCard
          icon={<Ticket className="w-5 h-5 text-violet-400" />}
          label="Open Tickets"
          value={kpis.openTickets}
          accent="border-violet-500/30"
          glow="from-violet-500/10"
          onClick={() => onNavigateTab('support', 'open')}
        />
        <KpiCard
          icon={<XCircle className="w-5 h-5 text-orange-400" />}
          label="Failed Increases"
          value={kpis.failedIncreases}
          accent="border-orange-500/30"
          glow="from-orange-500/10"
          onClick={() => onNavigateTab('adjustments', 'failed')}
        />
        <KpiCard
          icon={<ArrowUpDown className="w-5 h-5 text-emerald-400" />}
          label="Recent Adjustments"
          subtitle="Last 30d"
          value={kpis.recentAdjustments30d}
          accent="border-emerald-500/30"
          glow="from-emerald-500/10"
          onClick={() => onNavigateTab('adjustments', 'all', '30d')}
        />
      </div>

      {/* Alerts Banner */}
      {kpis.criticalQuotas.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-red-500/10 mt-0.5">
              <AlertOctagon className="w-4 h-4 text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-400">
                {kpis.criticalQuotas.length} quota{kpis.criticalQuotas.length > 1 ? 's' : ''} at critical utilization ({'≥'}90%)
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {kpis.criticalQuotas.map((q) => (
                  <span
                    key={q.quotaName}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300"
                  >
                    {q.quotaName}
                    <span className="text-red-400 font-bold">{Math.round(q.usagePct)}%</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Usage Trend Line Chart */}
        <div className="lg:col-span-3 bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Usage Trend (90d)</h3>
              <span className="px-2 py-0.5 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                All Quotas
              </span>
            </div>
          </div>
          <div className="h-[260px]">
            {mounted && usageTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageTrend}>
                  <defs>
                    <linearGradient id="gradMax" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradAvg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#29B5E8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#29B5E8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis
                    dataKey="usageDate"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: '#1a1a1a' }}
                    tickFormatter={(v: string) => {
                      const d = new Date(v);
                      return `${d.getMonth() + 1}/${d.getDate()}`;
                    }}
                    interval={Math.max(0, Math.floor(usageTrend.length / 6) - 1)}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: '#1a1a1a' }}
                    domain={[0, 'auto']}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0a0a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#e5e7eb',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    }}
                    itemStyle={{ color: '#e5e7eb' }}
                    labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                    labelFormatter={(v) => String(v)}
                    formatter={(value?: number, name?: string) => [
                      `${value ?? 0}%`,
                      name === 'maxUsagePct' ? 'Max' : 'Avg',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="maxUsagePct"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#gradMax)"
                    dot={false}
                    name="maxUsagePct"
                  />
                  <Area
                    type="monotone"
                    dataKey="avgUsagePct"
                    stroke="#29B5E8"
                    strokeWidth={2}
                    fill="url(#gradAvg)"
                    dot={false}
                    name="avgUsagePct"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-600">
                No trend data available
              </div>
            )}
          </div>
        </div>

        {/* Top Quotas Bar Chart */}
        <div className="lg:col-span-2 bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] p-5">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Top Quotas by Usage</h3>
          <div className="h-[260px]">
            {mounted && topQuotasByUsage.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topQuotasByUsage} layout="vertical" margin={{ left: 0, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: '#1a1a1a' }}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="quotaName"
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={140}
                    tickFormatter={(v: string) => v.length > 18 ? v.slice(0, 18) + '…' : v}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0a0a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#e5e7eb',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    }}
                    itemStyle={{ color: '#e5e7eb' }}
                    labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    formatter={(value: number | undefined) => [`${value ?? 0}%`, 'Usage']}
                    labelFormatter={(v) => String(v)}
                  />
                  <Bar dataKey="usagePct" radius={[0, 4, 4, 0]} barSize={16}>
                    {topQuotasByUsage.map((entry, index) => (
                      <Cell key={index} fill={getBarFill(entry.usagePct)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-600">
                No quota data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* At-Risk Quotas Table */}
      <div className="bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">At-Risk Quotas</h3>
            <span className="text-xs text-gray-600">({'≥'}80% utilization)</span>
          </div>
          <button
            onClick={() => onNavigateTab('current-usage')}
            className="flex items-center gap-1 text-xs text-[#29B5E8] hover:text-white transition-colors"
          >
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {atRiskQuotas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/50 border-b border-[#1a1a1a]">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quota Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Region</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Usage</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Limit</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Usage %</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Open Ticket</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {atRiskQuotas.map((q, i) => (
                  <tr key={`${q.quotaName}-${q.region}-${i}`} className="table-row-hover">
                    <td className="px-5 py-3 text-sm font-medium text-white">{q.quotaName}</td>
                    <td className="px-5 py-3 text-sm text-gray-400">{q.region}</td>
                    <td className="px-5 py-3 text-sm text-white text-right tabular-nums">{q.currentUsage}</td>
                    <td className="px-5 py-3 text-sm text-gray-400 text-right tabular-nums">{q.quotaLimit}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`text-sm font-bold tabular-nums ${getPctColor(q.usagePct)}`}>{q.usagePct}%</span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      {q.hasOpenTicket ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400">
                          <Ticket className="w-3 h-3" /> Yes
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600">None</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {q.hasPendingAdjustment ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-400">
                          <ArrowUpDown className="w-3 h-3" /> Pending
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-3">
              <Gauge className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-sm font-medium text-gray-300">All clear</p>
            <p className="text-xs text-gray-600 mt-1">No quotas are at or above 80% utilization</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── KPI Card ─── */

function KpiCard({
  icon, label, subtitle, value, accent, glow, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  value: number;
  accent: string;
  glow: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`relative group bg-[#0a0a0a] rounded-2xl p-4 border ${accent} transition-all duration-300 overflow-hidden ${
        onClick ? 'cursor-pointer hover:border-opacity-80' : ''
      }`}
      onClick={onClick}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-black/50 border border-[#1a1a1a]">{icon}</div>
          <div>
            <p className="text-xs text-gray-400 font-medium">{label}</p>
            {subtitle && <p className="text-[10px] text-gray-600">{subtitle}</p>}
          </div>
        </div>
        <p className="text-2xl font-bold text-white"><CountUp end={value} /></p>
      </div>
      {onClick && (
        <ExternalLink className="absolute top-3 right-3 w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  );
}
