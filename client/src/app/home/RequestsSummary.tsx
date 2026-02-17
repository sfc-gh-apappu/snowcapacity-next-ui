'use client';

import { FileText, CheckCircle2, Clock } from 'lucide-react';
import { TOTAL_REQUESTS, COMPLETED_REQUESTS, REQUEST_BREAKDOWN, RECENT_ACTIVITIES } from './constants';

function getActivityDot(type: string) {
  if (type === 'quota') return 'bg-[#29B5E8]';
  if (type === 'reservation') return 'bg-yellow-400';
  return 'bg-violet-400';
}

function getActivityGlow(type: string) {
  if (type === 'quota') return '#29B5E8';
  if (type === 'reservation') return '#EAB308';
  return '#8B5CF6';
}

export default function RequestsSummary() {
  const completionPct = Math.round((COMPLETED_REQUESTS / TOTAL_REQUESTS) * 100);

  return (
    <section className="space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 border border-violet-500/30 shadow-lg shadow-violet-500/10">
          <FileText className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Capacity Requests Summary</h2>
          <p className="text-xs text-gray-500">All time overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Stats + Breakdown */}
        <div className="space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4">
            <MiniStatCard
              icon={<FileText className="w-4 h-4 text-violet-400" />}
              label="Total"
              value={TOTAL_REQUESTS}
              accentColor="#8B5CF6"
              gradientBorder="from-violet-500/40 via-violet-500/10 to-transparent"
            />
            <MiniStatCard
              icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              label="Completed"
              value={COMPLETED_REQUESTS}
              accentColor="#10B981"
              gradientBorder="from-emerald-500/40 via-emerald-500/10 to-transparent"
            />
          </div>

          {/* Status Breakdown */}
          <div className="group relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 via-transparent to-transparent p-px">
              <div className="w-full h-full rounded-2xl bg-[#070709]" />
            </div>
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative">
              <div className="h-[2px] w-full bg-gradient-to-r from-violet-500 via-emerald-500/40 to-transparent" />
              <div className="p-5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Status Breakdown</h3>

                {/* Completion bar */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Completion Rate</span>
                    <span className="text-xs font-bold text-emerald-400 tabular-nums">{completionPct}%</span>
                  </div>
                  <div className="relative bg-[#1a1a1a] rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${completionPct}%`,
                        background: 'linear-gradient(90deg, #10B981, #34D399)',
                        boxShadow: '0 0 16px #10B98130',
                      }}
                    />
                  </div>
                </div>

                {/* Breakdown rows */}
                <div className="space-y-3">
                  {REQUEST_BREAKDOWN.map((b) => {
                    const barPct = Math.round((b.count / TOTAL_REQUESTS) * 100);
                    return (
                      <div key={b.status} className="group/row">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: b.color, boxShadow: `0 0 6px ${b.color}40` }} />
                            <span className="text-sm text-gray-400">{b.status}</span>
                          </div>
                          <span className="text-sm font-bold text-white tabular-nums">{b.count}</span>
                        </div>
                        <div className="relative bg-[#1a1a1a] rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${barPct}%`, backgroundColor: b.color, opacity: 0.6 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Activity Feed */}
        <div className="lg:col-span-2 group relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-500/20 via-transparent to-transparent p-px">
            <div className="w-full h-full rounded-2xl bg-[#070709]" />
          </div>
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-violet-500/8 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="h-[2px] w-full bg-gradient-to-r from-gray-500/40 via-violet-500/20 to-transparent" />
            <div className="p-5">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="p-1.5 rounded-lg bg-white/5">
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Activity</h3>
              </div>
              <div className="space-y-0.5">
                {RECENT_ACTIVITIES.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 px-4 py-4 rounded-xl hover:bg-white/[0.03] transition-all duration-200 border border-transparent hover:border-[#1a1a1a]"
                  >
                    <div className="relative mt-1 flex-shrink-0">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${getActivityDot(a.type)}`}
                        style={{ boxShadow: `0 0 10px ${getActivityGlow(a.type)}50` }}
                      />
                      {i < RECENT_ACTIVITIES.length - 1 && (
                        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-[#222] to-transparent" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">{a.action}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{a.detail}</p>
                    </div>
                    <span className="text-[11px] text-gray-600 whitespace-nowrap flex-shrink-0 font-medium tabular-nums">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Mini Stat Card ─── */

function MiniStatCard({
  icon, label, value, accentColor, gradientBorder,
}: {
  icon: React.ReactNode; label: string; value: number; accentColor: string; gradientBorder: string;
}) {
  return (
    <div className="group relative rounded-2xl overflow-hidden">
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradientBorder} p-px`}>
        <div className="w-full h-full rounded-2xl bg-[#070709]" />
      </div>
      <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: `${accentColor}15` }}
      />
      <div className="relative">
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg border border-[#1a1a1a]" style={{ backgroundColor: `${accentColor}10` }}>
              {icon}
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</p>
          </div>
          <p className="text-3xl font-bold text-white tabular-nums">{value}</p>
        </div>
      </div>
    </div>
  );
}
