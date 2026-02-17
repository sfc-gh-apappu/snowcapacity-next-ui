'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { TOTAL_UNUSED_COST_7D, TOP_UNUSED_RESERVATION_COSTS } from './constants';

const chartData = TOP_UNUSED_RESERVATION_COSTS.map((d) => ({
  ...d,
  name: `${d.label} (${d.instanceType})`,
}));

export default function ReservationsSummary() {
  return (
    <section className="space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 shadow-lg shadow-yellow-500/10">
          <Calendar className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Capacity Reservations Summary</h2>
          <p className="text-xs text-gray-500">Last 7 days</p>
        </div>
      </div>

      {/* Stat + Chart side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Stat card */}
        <div className="group relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/40 via-red-500/10 to-transparent p-px">
            <div className="w-full h-full rounded-2xl bg-[#070709]" />
          </div>
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="relative">
            <div className="h-[2px] w-full bg-gradient-to-r from-red-500 to-transparent" />
            <div className="p-6 flex flex-col justify-center h-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                  <DollarSign className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-sm text-gray-400 font-medium">Total Unused Cost</p>
              </div>
              <p className="text-4xl font-bold text-white tabular-nums">${TOTAL_UNUSED_COST_7D.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-3">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400/60" />
                <p className="text-xs text-gray-500">Estimated weekly waste across all reservations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 group relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500/30 via-transparent to-transparent p-px">
            <div className="w-full h-full rounded-2xl bg-[#070709]" />
          </div>
          <div className="absolute -top-16 -left-16 w-40 h-40 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="relative">
            <div className="h-[2px] w-full bg-gradient-to-r from-yellow-500/80 via-red-500/40 to-transparent" />
            <div className="p-5">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Top Unused Reservation Costs</h3>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
                    <XAxis
                      type="number"
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v.toLocaleString()}`}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={180}
                      tick={{ fill: '#9ca3af', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: 12, fontSize: 12 }}
                      labelStyle={{ color: '#fff', fontWeight: 600, marginBottom: 4 }}
                      itemStyle={{ color: '#9ca3af' }}
                      cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Unused Spend']}
                    />
                    <Bar dataKey="unusedSpend" radius={[0, 6, 6, 0]} barSize={18}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={`rgba(239, 68, 68, ${1 - i * 0.1})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
