'use client';

import { useState, useMemo, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  key: string;
  direction: SortDirection;
}

export function useSortableData<T>(data: T[], defaultSort?: SortState) {
  const [sort, setSort] = useState<SortState>(defaultSort ?? { key: '', direction: null });

  const toggle = useCallback((key: string) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return { key: '', direction: null };
    });
  }, []);

  const sorted = useMemo(() => {
    if (!sort.key || !sort.direction) return data;
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sort.key];
      const bVal = (b as Record<string, unknown>)[sort.key];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const cmp = String(aVal).localeCompare(String(bVal));
      return sort.direction === 'asc' ? cmp : -cmp;
    });
  }, [data, sort]);

  return { sorted, sort, toggle };
}

const thAlignClass: Record<string, string> = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
};

export function SortHeader({
  label,
  sortKey,
  currentSort,
  onSort,
  align = 'left',
}: {
  label: string;
  sortKey: string;
  currentSort: SortState;
  onSort: (key: string) => void;
  align?: 'left' | 'right' | 'center';
}) {
  const active = currentSort.key === sortKey;

  return (
    <th
      className={`px-5 py-4 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none group transition-colors hover:text-[#29B5E8] ${
        active ? 'text-[#29B5E8]' : 'text-gray-400'
      } ${thAlignClass[align]}`}
      onClick={() => onSort(sortKey)}
    >
      <span className="relative">
        {label}
        <span className={`absolute top-1/2 -translate-y-1/2 ml-1 ${
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
        } transition-opacity`}>
          {active && currentSort.direction === 'asc' ? (
            <ChevronUp className="w-3 h-3" />
          ) : active && currentSort.direction === 'desc' ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronsUpDown className="w-3 h-3" />
          )}
        </span>
      </span>
    </th>
  );
}
