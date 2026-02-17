'use client';

import { useState, useMemo } from 'react';
import { Database, BarChart3, ArrowUpDown, Headphones, ChevronDown, X, AlertTriangle, AlertCircle, Gauge } from 'lucide-react';
import {
  CLOUD_PROVIDERS, REGIONS, TENANT_IDS, SUBSCRIPTIONS, INSTANCE_TYPES,
  QUOTA_USAGE_DATA, type QuotaUsageItem,
} from './constants';
import CurrentUsageTab from './components/CurrentUsageTab';
import QuotaAdjustmentsTab from './components/QuotaAdjustmentsTab';
import SupportCasesTab from './components/SupportCasesTab';

const tabs = [
  { id: 'current-usage', label: 'Current Usage', icon: BarChart3 },
  { id: 'adjustments', label: 'Quota Adjustments', icon: ArrowUpDown },
  { id: 'support', label: 'Support Cases', icon: Headphones },
];

export default function Quota() {
  const [activeTab, setActiveTab] = useState('current-usage');

  // Filter state
  const [cloud, setCloud] = useState('All');
  const [region, setRegion] = useState('All Regions');
  const [tenant, setTenant] = useState('all');
  const [subscription, setSubscription] = useState('all');
  const [instanceType, setInstanceType] = useState('All Types');

  const availableRegions = REGIONS[cloud] || REGIONS['All'];

  // Reset region when cloud changes
  const handleCloudChange = (val: string) => {
    setCloud(val);
    setRegion('All Regions');
  };

  // Compute filtered data
  const filteredUsage: QuotaUsageItem[] = useMemo(() => {
    return QUOTA_USAGE_DATA.filter((item) => {
      if (cloud !== 'All' && item.cloud !== cloud) return false;
      if (region !== 'All Regions' && item.region !== region) return false;
      if (tenant !== 'all') {
        const tenantLabel = TENANT_IDS.find((t) => t.id === tenant)?.label;
        if (tenantLabel && item.tenantId !== tenantLabel) return false;
      }
      if (subscription !== 'all') {
        const subLabel = SUBSCRIPTIONS.find((s) => s.id === subscription)?.label;
        if (subLabel && item.subscriptionName !== subLabel) return false;
      }
      if (instanceType !== 'All Types' && item.instanceType !== instanceType) return false;
      return true;
    });
  }, [cloud, region, tenant, subscription, instanceType]);

  // Active filter chips
  const activeFilters: { label: string; clear: () => void }[] = [];
  if (cloud !== 'All') activeFilters.push({ label: cloud, clear: () => handleCloudChange('All') });
  if (region !== 'All Regions') activeFilters.push({ label: region, clear: () => setRegion('All Regions') });
  if (tenant !== 'all') {
    const t = TENANT_IDS.find((t) => t.id === tenant);
    if (t) activeFilters.push({ label: t.label, clear: () => setTenant('all') });
  }
  if (subscription !== 'all') {
    const s = SUBSCRIPTIONS.find((s) => s.id === subscription);
    if (s) activeFilters.push({ label: s.label, clear: () => setSubscription('all') });
  }
  if (instanceType !== 'All Types') activeFilters.push({ label: instanceType, clear: () => setInstanceType('All Types') });

  // Summary metrics
  const totalQuotas = filteredUsage.length;
  const highUsage = filteredUsage.filter((q) => (q.usage / q.limit) * 100 >= 80).length;
  const mediumUsage = filteredUsage.filter((q) => {
    const pct = (q.usage / q.limit) * 100;
    return pct >= 50 && pct < 80;
  }).length;

  const clearAllFilters = () => {
    setCloud('All');
    setRegion('All Regions');
    setTenant('all');
    setSubscription('all');
    setInstanceType('All Types');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold">
          <span className="bg-gradient-to-r from-[#29B5E8] via-[#7DD3FC] to-white bg-clip-text text-transparent">
            Quota Management
          </span>
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Monitor usage, manage adjustments, and track support cases</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0a0a0a] rounded-2xl p-5 border border-[#1a1a1a]">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-[#29B5E8]" />
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Filters</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <FilterSelect label="Cloud Provider" value={cloud} onChange={handleCloudChange} options={CLOUD_PROVIDERS.map((c) => ({ value: c, label: c }))} />
          <FilterSelect label="Region" value={region} onChange={setRegion} options={availableRegions.map((r) => ({ value: r, label: r }))} />
          <FilterSelect label="Tenant ID" value={tenant} onChange={setTenant} options={TENANT_IDS.map((t) => ({ value: t.id, label: t.label }))} />
          <FilterSelect label="Subscription" value={subscription} onChange={setSubscription} options={SUBSCRIPTIONS.map((s) => ({ value: s.id, label: s.label }))} />
          <FilterSelect label="Instance Type" value={instanceType} onChange={setInstanceType} options={INSTANCE_TYPES.map((t) => ({ value: t, label: t }))} />
        </div>

        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#1a1a1a]">
            <span className="text-xs text-gray-500 uppercase tracking-wider mr-1">Active:</span>
            {activeFilters.map((f, i) => (
              <button
                key={i}
                onClick={f.clear}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#29B5E8]/10 border border-[#29B5E8]/30 text-[#29B5E8] text-xs font-medium hover:bg-[#29B5E8]/20 transition-all"
              >
                {f.label}
                <X className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-xs text-gray-500 hover:text-white transition-colors ml-1"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          icon={<Gauge className="w-5 h-5 text-[#29B5E8]" />}
          label="Total Quotas"
          value={totalQuotas}
          accent="border-[#29B5E8]/30 hover:border-[#29B5E8]/50"
          bgGlow="from-[#29B5E8]/10"
        />
        <SummaryCard
          icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
          label="High Usage"
          subtitle="≥ 80%"
          value={highUsage}
          accent="border-red-500/30 hover:border-red-500/50"
          bgGlow="from-red-500/10"
        />
        <SummaryCard
          icon={<AlertCircle className="w-5 h-5 text-yellow-400" />}
          label="Medium Usage"
          subtitle="50–79%"
          value={mediumUsage}
          accent="border-yellow-500/30 hover:border-yellow-500/50"
          bgGlow="from-yellow-500/10"
        />
      </div>

      {/* Pill Tabs */}
      <div className="flex items-center gap-1 p-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl w-fit">
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

      {/* Tab Content */}
      {activeTab === 'current-usage' && <CurrentUsageTab data={filteredUsage} />}
      {activeTab === 'adjustments' && <QuotaAdjustmentsTab />}
      {activeTab === 'support' && <SupportCasesTab />}
    </div>
  );
}

/* ─── Filter Select ─── */

function FilterSelect({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 font-medium">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-[#111] border border-[#2a2a2a] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#29B5E8]/50 focus:border-[#29B5E8]/50 transition-all cursor-pointer hover:border-[#3a3a3a] pr-9"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}

/* ─── Summary Card ─── */

function SummaryCard({
  icon, label, subtitle, value, accent, bgGlow,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  value: number;
  accent: string;
  bgGlow: string;
}) {
  return (
    <div className={`relative group bg-[#0a0a0a] rounded-2xl p-5 border ${accent} transition-all duration-300 overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGlow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-black/50 border border-[#1a1a1a]">
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-400 font-medium">{label}</p>
            {subtitle && <p className="text-[11px] text-gray-600">{subtitle}</p>}
          </div>
        </div>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
