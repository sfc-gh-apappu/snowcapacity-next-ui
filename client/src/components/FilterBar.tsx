'use client';

import { SlidersHorizontal } from 'lucide-react';
import type { ReactNode } from 'react';

export default function FilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]">
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
