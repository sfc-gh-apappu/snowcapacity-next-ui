'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieIcon, Clock } from 'lucide-react';
import DashCard from './DashCard';
import {
  TOTAL_REQUESTS,
  COMPLETED_REQUESTS,
  REQUEST_BREAKDOWN,
  RECENT_ACTIVITIES,
} from './constants';

/* ─────────────────────────────────────────────────────────
   Request Status Donut
   ───────────────────────────────────────────────────────── */

export function RequestDonut() {
  const completionPct = Math.round((COMPLETED_REQUESTS / TOTAL_REQUESTS) * 100);

  return (
    <DashCard
      title="Request Status"
      subtitle="Distribution across all requests"
      accentColor="#8B5CF6"
      icon={<PieIcon className="w-4 h-4" />}
    >
      <div className="flex flex-col items-center">
        {/* Donut */}
        <div className="relative w-[180px] h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={REQUEST_BREAKDOWN}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={80}
                dataKey="count"
                stroke="none"
                paddingAngle={3}
                cornerRadius={4}
              >
                {REQUEST_BREAKDOWN.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#111',
                  border: '1px solid #222',
                  borderRadius: 12,
                  fontSize: 12,
                  padding: '8px 12px',
                }}
                itemStyle={{ color: '#9ca3af' }}
                formatter={(value) => [`${value} requests`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-white tabular-nums">{completionPct}%</span>
            <span className="text-[10px] text-gray-500 font-medium">completed</span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mt-5 w-full max-w-[280px]">
          {REQUEST_BREAKDOWN.map((b) => (
            <div key={b.status} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: b.color, boxShadow: `0 0 6px ${b.color}30` }}
              />
              <span className="text-[11px] text-gray-500 truncate">{b.status}</span>
              <span className="text-[11px] font-semibold text-white ml-auto tabular-nums">{b.count}</span>
            </div>
          ))}
        </div>
      </div>
    </DashCard>
  );
}

/* ─────────────────────────────────────────────────────────
   Activity Feed
   ───────────────────────────────────────────────────────── */

function getActivityColor(type: string) {
  if (type === 'quota') return '#29B5E8';
  if (type === 'reservation') return '#EAB308';
  return '#8B5CF6';
}

export function ActivityFeed() {
  return (
    <DashCard
      title="Recent Activity"
      subtitle="Latest changes across all services"
      accentColor="#6B7280"
      icon={<Clock className="w-4 h-4" />}
    >
      <div className="space-y-0.5">
        {RECENT_ACTIVITIES.map((a, i) => {
          const dotColor = getActivityColor(a.type);
          return (
            <div
              key={i}
              className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.02] transition-colors"
            >
              {/* Timeline dot + connector */}
              <div className="relative mt-[5px] flex-shrink-0">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: dotColor, boxShadow: `0 0 8px ${dotColor}40` }}
                />
                {i < RECENT_ACTIVITIES.length - 1 && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-[#222] to-transparent" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white font-medium leading-tight">{a.action}</p>
                <p className="text-[10px] text-gray-600 mt-0.5 truncate">{a.detail}</p>
              </div>

              {/* Time */}
              <span className="text-[10px] text-gray-600 whitespace-nowrap flex-shrink-0 tabular-nums mt-0.5">
                {a.time}
              </span>
            </div>
          );
        })}
      </div>
    </DashCard>
  );
}
