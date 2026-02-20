'use client';

import { Clock } from 'lucide-react';
import DashCard from './DashCard';
import type { ActivityItem } from './constants';

function getActivityColor(kind: string) {
  if (kind.startsWith('quota')) return '#29B5E8';
  if (kind.startsWith('reservation')) return '#EAB308';
  return '#8B5CF6';
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <DashCard
      title="Recent Activity"
      subtitle="Latest changes across all services"
      accentColor="#6B7280"
      icon={<Clock className="w-4 h-4" />}
    >
      {items.length === 0 ? (
        <p className="text-sm text-gray-600 py-6 text-center">No recent activity</p>
      ) : (
        <div className="space-y-0.5 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
          {items.map((a, i) => {
            const dotColor = getActivityColor(a.kind);
            const kindLabel = a.kind.replace(/_/g, ' ');
            return (
              <div
                key={`${a.timestamp}-${i}`}
                className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.02] transition-colors"
              >
                <div className="relative mt-[5px] flex-shrink-0">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: dotColor, boxShadow: `0 0 8px ${dotColor}40` }}
                  />
                  {i < items.length - 1 && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-[#222] to-transparent" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium leading-tight">{a.summary}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate capitalize">{kindLabel}</p>
                </div>

                <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0 tabular-nums mt-0.5">
                  {timeAgo(a.timestamp)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </DashCard>
  );
}
