'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Check, ClipboardList, FileText, LayoutDashboard, Plus, Loader2 } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import FilterBar from '@/components/FilterBar';
import { useApiQuery } from '@/lib/api';
import type { ReservationOverviewResponse } from './constants';
import OverviewTab from './components/OverviewTab';
import ReservationDetailTab from './components/ReservationDetailTab';
import ReservationRequestTab from './components/ReservationRequestTab';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'detail', label: 'Reservation Detail', icon: ClipboardList },
  { id: 'request', label: 'Reservation Request', icon: FileText },
];

export default function Reservation() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // ─── Backend data (TanStack Query — cached & deduped) ───
  const { data, isLoading, error: queryError } =
    useApiQuery<ReservationOverviewResponse>('/api/reservations/overview');
  const error = queryError?.message ?? null;

  // ─── Filter options from backend ───
  const filterOptions = data?.filterOptions;

  // Multiselect filter state — empty array means "all selected"
  const [accounts, setAccounts] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [zones, setZones] = useState<string[]>([]);
  const [instanceTypes, setInstanceTypes] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [resTypes, setResTypes] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [ownership, setOwnership] = useState<string[]>([]);

  // Filter data client-side
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.reservations.filter((item) => {
      if (accounts.length > 0 && !accounts.includes(item.accountName)) return false;
      if (regions.length > 0 && !regions.includes(item.region)) return false;
      if (zones.length > 0 && !zones.includes(item.availabilityZone)) return false;
      if (instanceTypes.length > 0 && !instanceTypes.includes(item.instanceType)) return false;
      if (platforms.length > 0 && !platforms.includes(item.instancePlatform)) return false;
      if (resTypes.length > 0 && !resTypes.includes(item.reservationType)) return false;
      if (states.length > 0 && !states.includes(item.state)) return false;
      if (ownership.length > 0) {
        const label = item.owned ? 'Owned' : 'Shared With';
        if (!ownership.includes(label)) return false;
      }
      return true;
    });
  }, [data, accounts, regions, zones, instanceTypes, platforms, resTypes, states, ownership]);

  return (
    <PageTransition>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#29B5E8] via-[#7DD3FC] to-white bg-clip-text text-transparent">
              Reservations
            </span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Manage and monitor reserved instance inventory</p>
        </div>
        <button
          onClick={() => router.push('/request?tab=create&type=RESERVATION_CREATE')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white text-sm font-medium shadow-lg shadow-[#29B5E8]/20 hover:shadow-[#29B5E8]/40 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Create Reservation
        </button>
      </div>

      {/* Filter Bar */}
      {filterOptions && (
        <FilterBar>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <MultiSelect label="Account" options={filterOptions.accounts.map((a) => a.accountName)} selected={accounts} onChange={setAccounts} />
            <MultiSelect label="Region" options={filterOptions.regions} selected={regions} onChange={setRegions} />
            <MultiSelect label="Availability Zone" options={filterOptions.availabilityZones} selected={zones} onChange={setZones} />
            <MultiSelect label="Instance Type" options={filterOptions.instanceTypes} selected={instanceTypes} onChange={setInstanceTypes} />
            <MultiSelect label="Instance Platform" options={filterOptions.instancePlatforms} selected={platforms} onChange={setPlatforms} />
            <MultiSelect label="Reservation Type" options={filterOptions.reservationTypes} selected={resTypes} onChange={setResTypes} />
            <MultiSelect label="State" options={filterOptions.states} selected={states} onChange={setStates} />
            <MultiSelect label="Owned / Shared" options={filterOptions.ownedOrSharedWith} selected={ownership} onChange={setOwnership} />
          </div>
        </FilterBar>
      )}

      {/* Pill Tabs */}
      <div className="flex items-center gap-1 p-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl w-fit max-w-full overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
                ${isActive
                  ? 'bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white shadow-lg shadow-[#29B5E8]/30'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Loading / Error */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-5 h-5 text-[#29B5E8] animate-spin" />
          <span className="ml-2 text-sm text-gray-500">Loading reservation data…</span>
        </div>
      )}
      {error && (
        <div className="text-center py-20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Tab Content */}
      {!isLoading && !error && (
        <>
          {activeTab === 'overview' && <OverviewTab data={filteredData} />}
          {activeTab === 'detail' && <ReservationDetailTab data={filteredData} />}
          {activeTab === 'request' && <ReservationRequestTab />}
        </>
      )}
    </div>
    </PageTransition>
  );
}

/* ─── MultiSelect Dropdown ─── */

function MultiSelect({
  label, options, selected, onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const allSelected = selected.length === 0;
  const displayText = allSelected
    ? 'All'
    : selected.length === 1
      ? selected[0]
      : `${selected.length} selected`;

  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      const next = [...selected, option];
      if (next.length === options.length) {
        onChange([]);
      } else {
        onChange(next);
      }
    }
  };

  const selectAll = () => onChange([]);

  return (
    <div className="relative" ref={ref}>
      <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 font-medium">{label}</label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-[#111] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-sm text-white hover:border-[#3a3a3a] transition-all text-left"
      >
        <span className={`truncate ${allSelected ? 'text-gray-400' : 'text-white'}`}>{displayText}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-[#111] border border-[#2a2a2a] rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
          <button
            onClick={selectAll}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm hover:bg-[#1a1a1a] transition-colors border-b border-[#1a1a1a]"
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
              allSelected ? 'bg-[#29B5E8] border-[#29B5E8]' : 'border-[#3a3a3a]'
            }`}>
              {allSelected && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className={allSelected ? 'text-white font-medium' : 'text-gray-400'}>All</span>
          </button>

          <div className="max-h-48 overflow-y-auto">
            {options.map((option) => {
              const isChecked = allSelected || selected.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => toggle(option)}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                    isChecked && !allSelected ? 'bg-[#29B5E8] border-[#29B5E8]' : allSelected ? 'bg-[#29B5E8]/30 border-[#29B5E8]/50' : 'border-[#3a3a3a]'
                  }`}>
                    {(isChecked || allSelected) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-gray-300 truncate">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
