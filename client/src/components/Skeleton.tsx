'use client';

import React from 'react';

function Pulse({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse rounded-lg bg-[#1a1a1a] ${className ?? ''}`} style={style} />
  );
}

export function SkeletonKpiStrip({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-[#0a0a0c] border border-[#141414] p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <Pulse className="w-8 h-8 rounded-lg" />
            <div className="space-y-1.5">
              <Pulse className="w-24 h-3" />
              <Pulse className="w-16 h-2" />
            </div>
          </div>
          <Pulse className="w-20 h-8" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] overflow-hidden">
      <div className="border-b border-[#1a1a1a] bg-black/50 px-5 py-4 flex gap-6">
        {Array.from({ length: cols }).map((_, i) => (
          <Pulse key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-6 px-5 py-4 border-b border-[#0f0f0f]">
          {Array.from({ length: cols }).map((_, j) => (
            <Pulse key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonFilterBar() {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#29B5E8]/20 via-transparent to-violet-500/10 p-px">
        <div className="w-full h-full rounded-2xl bg-[#0a0a0a]" />
      </div>
      <div className="relative p-5">
        <div className="flex items-center gap-2 mb-4">
          <Pulse className="w-7 h-7 rounded-lg" />
          <Pulse className="w-16 h-3" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Pulse className="w-20 h-2.5" />
              <Pulse className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonChart({ height = 'h-64' }: { height?: string }) {
  return (
    <div className={`bg-[#0a0a0a] rounded-2xl border border-[#1a1a1a] p-5 ${height}`}>
      <Pulse className="w-40 h-4 mb-4" />
      <div className="flex items-end gap-2 h-[calc(100%-2rem)]">
        {Array.from({ length: 8 }).map((_, i) => (
          <Pulse
            key={i}
            className="flex-1 rounded-t-md"
            style={{ height: `${30 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Pulse className="w-72 h-10" />
        <Pulse className="w-96 h-5" />
      </div>
      <SkeletonKpiStrip />
      <SkeletonFilterBar />
      <SkeletonTable />
    </div>
  );
}
