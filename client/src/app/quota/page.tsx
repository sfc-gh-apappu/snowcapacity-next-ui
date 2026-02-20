'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, BarChart3, ArrowUpDown, Headphones, ChevronDown, X, AlertTriangle, AlertCircle, Gauge, Plus } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import CountUp from '@/components/CountUp';
import FilterBar from '@/components/FilterBar';
import { apiFetch, type PaginatedData } from '@/lib/api';
import type {
  QuotaOverviewResponse,
  QuotaAdjustmentRow,
  AtRiskQuotaRow,
  TopQuotaBar,
  UsageTrendPoint,
} from './constants';
import OverviewTab from './components/OverviewTab';
import CurrentUsageTab from './components/CurrentUsageTab';
import QuotaAdjustmentsTab from './components/QuotaAdjustmentsTab';
import SupportCasesTab from './components/SupportCasesTab';

const OPEN_STATUSES = new Set(['submitted', 'active', 'inprogress', 'partiallycompleted']);
const FAILED_STATUSES = new Set(['failed', 'timedout']);

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'current-usage', label: 'Current Usage', icon: BarChart3 },
  { id: 'adjustments', label: 'Quota Adjustments', icon: ArrowUpDown },
  { id: 'support', label: 'Support Cases', icon: Headphones },
];

export default function Quota() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [adjStatusOverride, setAdjStatusOverride] = useState<string | undefined>(undefined);
  const [adjTimeOverride, setAdjTimeOverride] = useState<string | undefined>(undefined);
  const [supportStatusOverride, setSupportStatusOverride] = useState<string | undefined>(undefined);

  // ─── Backend data ───
  const [overviewData, setOverviewData] = useState<QuotaOverviewResponse | null>(null);
  const [adjustmentsData, setAdjustmentsData] = useState<QuotaAdjustmentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    Promise.all([
      apiFetch<QuotaOverviewResponse>('/api/quota/overview'),
      apiFetch<PaginatedData<QuotaAdjustmentRow>>('/api/quota/adjustments'),
    ])
      .then(([overview, adjustments]) => {
        if (cancelled) return;
        setOverviewData(overview);
        setAdjustmentsData(adjustments.items);
      })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, []);

  // ─── Derive filter options from raw quotas ───
  const filterOptions = useMemo(() => {
    const quotas = overviewData?.quotas ?? [];
    const regions = new Set<string>();
    const tenants = new Set<string>();
    const subs = new Map<string, string>(); // id → name
    const types = new Set<string>();

    for (const q of quotas) {
      if (q.region) regions.add(q.region);
      if (q.tenantId) tenants.add(q.tenantId);
      if (q.subscriptionId) subs.set(q.subscriptionId, q.subscriptionName);
      if (q.instanceType) types.add(q.instanceType);
    }

    return {
      regions: ['All Regions', ...Array.from(regions).sort()],
      tenants: ['All Tenants', ...Array.from(tenants).sort()],
      subscriptions: [
        { id: 'all', label: 'All Subscriptions' },
        ...Array.from(subs.entries())
          .map(([id, name]) => ({ id, label: name }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      ],
      instanceTypes: ['All Types', ...Array.from(types).sort()],
    };
  }, [overviewData]);

  // ─── Filter state ───
  const [region, setRegion] = useState('All Regions');
  const [tenant, setTenant] = useState('All Tenants');
  const [subscription, setSubscription] = useState('all');
  const [instanceType, setInstanceType] = useState('All Types');

  const isFiltered = region !== 'All Regions' || tenant !== 'All Tenants' || subscription !== 'all' || instanceType !== 'All Types';

  // ─── Filtered raw arrays ───
  const filteredQuotas = useMemo(() => {
    if (!overviewData) return [];
    return overviewData.quotas.filter((q) => {
      if (region !== 'All Regions' && q.region !== region) return false;
      if (tenant !== 'All Tenants' && q.tenantId !== tenant) return false;
      if (subscription !== 'all' && q.subscriptionId !== subscription) return false;
      if (instanceType !== 'All Types' && q.instanceType !== instanceType) return false;
      return true;
    });
  }, [overviewData, region, tenant, subscription, instanceType]);

  const filteredAdjustments = useMemo(() => {
    if (!overviewData) return [];
    return overviewData.adjustments.filter((a) => {
      if (region !== 'All Regions' && a.region !== region) return false;
      if (tenant !== 'All Tenants' && a.tenantId !== tenant) return false;
      if (subscription !== 'all' && a.subscriptionId !== subscription) return false;
      if (instanceType !== 'All Types' && a.instanceType !== instanceType) return false;
      return true;
    });
  }, [overviewData, region, tenant, subscription, instanceType]);

  // ─── Recompute KPIs from filtered data ───
  const computedKPIs = useMemo(() => {
    if (!overviewData) return null;

    const totalQuotas = filteredQuotas.length;
    const criticalList = filteredQuotas.filter((q) => q.usagePct >= 90);
    const critical = criticalList.length;
    const criticalQuotas = criticalList.map((q) => ({ quotaName: q.quotaName, usagePct: q.usagePct }));

    const openTickets = filteredAdjustments.filter(
      (a) => a.cspSupportRequestId && OPEN_STATUSES.has(a.requestStatus.toLowerCase()),
    ).length;
    const failedIncreases = filteredAdjustments.filter(
      (a) => FAILED_STATUSES.has(a.requestStatus.toLowerCase()),
    ).length;

    const cutoff30d = new Date();
    cutoff30d.setDate(cutoff30d.getDate() - 30);
    const recentAdjustments30d = filteredAdjustments.filter(
      (a) => new Date(a.createdAt) >= cutoff30d,
    ).length;

    return { totalQuotas, critical, openTickets, failedIncreases, recentAdjustments30d, criticalQuotas };
  }, [overviewData, filteredQuotas, filteredAdjustments]);

  // ─── Top quotas bar chart ───
  const computedTopQuotas: TopQuotaBar[] = useMemo(() => {
    if (!overviewData) return [];
    if (!isFiltered) return overviewData.charts.topQuotasByUsage;

    return [...filteredQuotas]
      .sort((a, b) => b.usagePct - a.usagePct)
      .slice(0, 10)
      .map((q) => ({
        quotaName: q.quotaName,
        usagePct: q.usagePct,
        currentUsage: q.currentUsage,
        quotaLimit: q.quotaLimit,
      }));
  }, [overviewData, isFiltered, filteredQuotas]);

  // ─── At-risk quotas ───
  const computedAtRisk: AtRiskQuotaRow[] = useMemo(() => {
    if (!overviewData) return [];
    if (!isFiltered) return overviewData.atRiskQuotas;

    return filteredQuotas
      .filter((q) => q.usagePct >= 80)
      .map((q) => {
        const hasOpenTicket = filteredAdjustments.some(
          (a) =>
            a.quotaName === q.quotaName &&
            a.subscriptionId === q.subscriptionId &&
            a.cspSupportRequestId !== '' &&
            OPEN_STATUSES.has(a.requestStatus.toLowerCase()),
        );
        const hasPendingAdjustment = filteredAdjustments.some(
          (a) =>
            a.quotaName === q.quotaName &&
            a.subscriptionId === q.subscriptionId &&
            OPEN_STATUSES.has(a.requestStatus.toLowerCase()),
        );
        return {
          quotaName: q.quotaName,
          region: q.region,
          currentUsage: q.currentUsage,
          quotaLimit: q.quotaLimit,
          usagePct: q.usagePct,
          hasOpenTicket,
          hasPendingAdjustment,
          lastUpdated: q.lastUpdated,
        };
      })
      .sort((a, b) => b.usagePct - a.usagePct);
  }, [overviewData, isFiltered, filteredQuotas, filteredAdjustments]);

  // ─── Page-level filtered full adjustment rows (for Adjustments tab) ───
  const filteredFullAdjustments = useMemo(() => {
    return adjustmentsData.filter((a) => {
      if (region !== 'All Regions' && a.region !== region) return false;
      if (tenant !== 'All Tenants' && a.tenantId !== tenant) return false;
      if (subscription !== 'all' && a.subscriptionId !== subscription) return false;
      if (instanceType !== 'All Types' && a.instanceType !== instanceType) return false;
      return true;
    });
  }, [adjustmentsData, region, tenant, subscription, instanceType]);

  // Usage trend is global (not per-filter), always from pre-computed
  const usageTrend: UsageTrendPoint[] = overviewData?.charts.usageTrend ?? [];

  // ─── Summary metrics for non-overview tabs ───
  const totalQuotas = filteredQuotas.length;
  const highUsage = filteredQuotas.filter((q) => q.usagePct >= 80).length;
  const mediumUsage = filteredQuotas.filter((q) => q.usagePct >= 50 && q.usagePct < 80).length;

  // Active filter chips
  const activeFilters: { label: string; clear: () => void }[] = [];
  if (region !== 'All Regions') activeFilters.push({ label: region, clear: () => setRegion('All Regions') });
  if (tenant !== 'All Tenants') activeFilters.push({ label: tenant, clear: () => setTenant('All Tenants') });
  if (subscription !== 'all') {
    const s = filterOptions.subscriptions.find((s) => s.id === subscription);
    if (s) activeFilters.push({ label: s.label, clear: () => setSubscription('all') });
  }
  if (instanceType !== 'All Types') activeFilters.push({ label: instanceType, clear: () => setInstanceType('All Types') });

  const clearAllFilters = () => {
    setRegion('All Regions');
    setTenant('All Tenants');
    setSubscription('all');
    setInstanceType('All Types');
  };

  const handleNavigateTab = useCallback((tabId: string, filter?: string, timeRange?: string) => {
    setActiveTab(tabId);
    if (tabId === 'adjustments') {
      setAdjStatusOverride(filter ?? 'all');
      setAdjTimeOverride(timeRange);
    }
    if (tabId === 'support') {
      setSupportStatusOverride(filter ?? undefined);
    }
  }, []);

  return (
    <PageTransition>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-[#29B5E8] via-[#7DD3FC] to-white bg-clip-text text-transparent">
              Quota Management
            </span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Monitor usage, manage adjustments, and track support cases</p>
        </div>
        <button
          onClick={() => router.push('/request?tab=create&type=QUOTA_CREATE')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white text-sm font-medium shadow-lg shadow-[#29B5E8]/20 hover:shadow-[#29B5E8]/40 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Request Quota Increase
        </button>
      </div>

      {/* Filter Bar */}
      <FilterBar>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FilterSelect label="Region" value={region} onChange={setRegion} options={filterOptions.regions.map((r) => ({ value: r, label: r }))} />
          <FilterSelect label="Tenant ID" value={tenant} onChange={setTenant} options={filterOptions.tenants.map((t) => ({ value: t, label: t }))} />
          <FilterSelect label="Subscription" value={subscription} onChange={setSubscription} options={filterOptions.subscriptions.map((s) => ({ value: s.id, label: s.label }))} />
          <FilterSelect label="Instance Type" value={instanceType} onChange={setInstanceType} options={filterOptions.instanceTypes.map((t) => ({ value: t, label: t }))} />
        </div>

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
      </FilterBar>

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

      {/* Summary Strip (shown on drill-down tabs) */}
      {activeTab !== 'overview' && (
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
      )}

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab
          kpis={computedKPIs}
          usageTrend={usageTrend}
          topQuotasByUsage={computedTopQuotas}
          atRiskQuotas={computedAtRisk}
          onNavigateTab={handleNavigateTab}
          isFiltered={isFiltered}
          isLoading={isLoading}
          error={error}
        />
      )}
      {activeTab === 'current-usage' && <CurrentUsageTab data={isLoading ? [] : filteredQuotas} />}
      {activeTab === 'adjustments' && <QuotaAdjustmentsTab data={filteredFullAdjustments} initialStatus={adjStatusOverride} initialTimeRange={adjTimeOverride} />}
      {activeTab === 'support' && <SupportCasesTab data={filteredFullAdjustments.filter((a) => a.cspSupportRequestId)} initialStatus={supportStatusOverride} />}
    </div>
    </PageTransition>
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
        <p className="text-3xl font-bold text-white"><CountUp end={value} /></p>
      </div>
    </div>
  );
}
