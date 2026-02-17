'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Database, TrendingUp, ArrowUpRight } from 'lucide-react';
import {
  TOTAL_ADJUSTMENTS_30D, ADJUSTED_SUBSCRIPTIONS_30D,
  TOP_ADJUSTED_QUOTAS, TOP_QUOTA_USAGE,
} from './constants';

function truncateLabel(label: string, max = 22) {
  return label.length > max ? label.slice(0, max) + '…' : label;
}

function getUsageColor(pct: number) {
  if (pct >= 90) return '#EF4444';
  if (pct >= 80) return '#F59E0B';
  if (pct >= 60) return '#29B5E8';
  return '#10B981';
}

export default function QuotaSummary() {
  return (
    <section className="space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#29B5E8]/20 to-[#29B5E8]/5 border border-[#29B5E8]/30 shadow-lg shadow-[#29B5E8]/10">
          <Database className="w-5 h-5 text-[#29B5E8]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Quota Summary</h2>
          <p className="text-xs text-gray-500">Last 30 days</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          label="Total Adjustments"
          value={TOTAL_ADJUSTMENTS_30D}
          icon={<TrendingUp className="w-5 h-5 text-[#29B5E8]" />}
          accentColor="#29B5E8"
          gradientBorder="from-[#29B5E8]/40 via-[#29B5E8]/10 to-transparent"
        />
        <StatCard
          label="Adjusted Subscriptions"
          value={ADJUSTED_SUBSCRIPTIONS_30D}
          icon={<ArrowUpRight className="w-5 h-5 text-violet-400" />}
          accentColor="#8B5CF6"
          gradientBorder="from-violet-500/40 via-violet-500/10 to-transparent"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Adjusted Quotas */}
        <GlowCard accentBorder="from-[#29B5E8]/30 to-transparent" glowClass="from-[#29B5E8]/10" accentColor="#29B5E8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Top Adjusted Quotas</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_ADJUSTED_QUOTAS} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
                <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="quotaName"
                  type="category"
                  width={160}
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => truncateLabel(v, 20)}
                />
                <Tooltip
                  contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: '#fff', fontWeight: 600, marginBottom: 4 }}
                  itemStyle={{ color: '#9ca3af' }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  formatter={(value: number) => [`${value} adjustments`, '']}
                />
                <Bar dataKey="adjustments" radius={[0, 6, 6, 0]} barSize={18}>
                  {TOP_ADJUSTED_QUOTAS.map((_, i) => (
                    <Cell key={i} fill={`rgba(41, 181, 232, ${1 - i * 0.09})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlowCard>

        {/* Top Quota Usage */}
        <GlowCard accentBorder="from-amber-500/30 to-transparent" glowClass="from-amber-500/10" accentColor="#F59E0B">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Top Quota Usage</h3>
          <div className="space-y-3.5">
            {TOP_QUOTA_USAGE.map((q, i) => (
              <div key={i} className="group flex items-center gap-3">
                <div className="w-[160px] min-w-[160px] truncate">
                  <p className="text-sm text-white font-medium truncate">{q.quotaName}</p>
                  <p className="text-[10px] text-gray-600 font-mono">{q.region}</p>
                </div>
                <div className="flex-1 relative bg-[#1a1a1a] rounded-full h-3.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${q.usagePct}%`,
                      background: `linear-gradient(90deg, ${getUsageColor(q.usagePct)}66, ${getUsageColor(q.usagePct)})`,
                      boxShadow: `0 0 12px ${getUsageColor(q.usagePct)}30`,
                    }}
                  />
                </div>
                <span
                  className="text-xs font-bold w-10 text-right tabular-nums"
                  style={{ color: getUsageColor(q.usagePct) }}
                >
                  {q.usagePct}%
                </span>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>
    </section>
  );
}

/* ─── Stat Card ─── */

function StatCard({
  label, value, icon, accentColor, gradientBorder,
}: {
  label: string; value: number; icon: React.ReactNode; accentColor: string; gradientBorder: string;
}) {
  return (
    <div className="group relative rounded-2xl overflow-hidden">
      {/* Gradient border */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradientBorder} p-px`}>
        <div className="w-full h-full rounded-2xl bg-[#070709]" />
      </div>
      {/* Corner glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: `${accentColor}15` }}
      />
      <div className="relative">
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
        <div className="px-5 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border border-[#1a1a1a]" style={{ backgroundColor: `${accentColor}10` }}>
              {icon}
            </div>
            <p className="text-sm text-gray-400 font-medium">{label}</p>
          </div>
          <p className="text-3xl font-bold text-white tabular-nums">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Glow Card Wrapper ─── */

function GlowCard({
  children, accentBorder, glowClass, accentColor,
}: {
  children: React.ReactNode; accentBorder: string; glowClass: string; accentColor: string;
}) {
  return (
    <div className="group relative rounded-2xl overflow-hidden">
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accentBorder} via-transparent p-px`}>
        <div className="w-full h-full rounded-2xl bg-[#070709]" />
      </div>
      <div className={`absolute -top-16 -left-16 w-40 h-40 bg-gradient-to-br ${glowClass} to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
      <div className="relative">
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}
