'use client';

import { SlidersHorizontal } from 'lucide-react';
import type { ReactNode } from 'react';

export default function FilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#29B5E8]/20 via-transparent to-violet-500/10 p-px">
        <div className="w-full h-full rounded-2xl bg-[#0a0a0a]" />
      </div>
      <div className="relative p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-[#29B5E8]/10">
            <SlidersHorizontal className="w-4 h-4 text-[#29B5E8]" />
          </div>
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Filters</span>
        </div>
        {children}
      </div>
    </div>
  );
}
