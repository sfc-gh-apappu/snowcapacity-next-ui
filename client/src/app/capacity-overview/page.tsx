'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, TrendingUp, Activity, ArrowUpRight, Shield } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import PageTransition from '@/components/PageTransition';
import CountUp from '@/components/CountUp';
import {
  CLOUD_PROVIDERS, VIEW_TYPES, PRODUCTS, REGIONS, DEPLOYMENTS,
  WAREHOUSE_TYPES, DEMAND_METRICS, DEMAND_DATA,
} from './constants';
import { DatePicker } from '@/components/ui/date-picker';
import GraphViewTab from './components/GraphViewTab';

export default function CapacityOverview() {
  const [cloud, setCloud] = useState<string>('Azure');
  const [viewType, setViewType] = useState<string>('All');
  const [product, setProduct] = useState<string>('Snowpark');
  const [region, setRegion] = useState<string>('East US 2');
  const [deployment, setDeployment] = useState<string>('Primary');
  const [warehouseType, setWarehouseType] = useState<string>('Snowpark-Optimized');
  const [fromDate, setFromDate] = useState('2025-09-01');
  const [toDate, setToDate] = useState('2026-08-15');
  const [metric, setMetric] = useState<string>('Maximum');

  const filters = { cloud, viewType, product, region, deployment, warehouseType, fromDate, toDate, metric };

  const kpis = useMemo(() => {
    const hist = DEMAND_DATA.filter((d) => d.type === 'historical');
    const fore = DEMAND_DATA.filter((d) => d.type === 'forecast');
    const currentDemand = hist[hist.length - 1]?.totalDemand ?? 0;
    const currentSupply = hist[hist.length - 1]?.supply ?? 0;
    const forecastPeak = Math.max(...fore.map((d) => d.totalDemand), 0);
    const earliest = hist[0]?.totalDemand ?? 0;
    const growthRate = earliest > 0 ? ((currentDemand - earliest) / earliest) * 100 : 0;
    const supplyHeadroom = currentSupply - currentDemand;
    return { currentDemand, forecastPeak, growthRate: Math.round(growthRate * 10) / 10, supplyHeadroom };
  }, []);

  return (
    <PageTransition>
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
          <span className="bg-gradient-to-r from-[#29B5E8] via-[#7DD3FC] to-white bg-clip-text text-transparent">
            Capacity Overview
          </span>
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Analyze historical demand and forecast trends</p>
      </div>

      {/* Filter Bar */}
      <FilterBar>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
          <FilterSelect label="Cloud Provider" value={cloud} onChange={setCloud} options={CLOUD_PROVIDERS.map((c) => ({ value: c, label: c }))} />
          <FilterSelect label="View Type" value={viewType} onChange={setViewType} options={VIEW_TYPES.map((v) => ({ value: v, label: v }))} />
          <FilterSelect label="Product" value={product} onChange={setProduct} options={PRODUCTS.map((p) => ({ value: p, label: p }))} />
          <FilterSelect label="Region" value={region} onChange={setRegion} options={REGIONS.map((r) => ({ value: r, label: r }))} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <FilterSelect label="Deployment" value={deployment} onChange={setDeployment} options={DEPLOYMENTS.map((d) => ({ value: d, label: d }))} />
          <FilterSelect label="Warehouse Type" value={warehouseType} onChange={setWarehouseType} options={WAREHOUSE_TYPES.map((w) => ({ value: w, label: w }))} />
          <div>
            <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 font-medium">From Date</label>
            <DatePicker value={fromDate} onChange={setFromDate} placeholder="Start date" className="bg-[#111] border-[#2a2a2a] hover:bg-[#111] hover:border-[#3a3a3a]" />
          </div>
          <div>
            <label className="block text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 font-medium">To Date</label>
            <DatePicker value={toDate} onChange={setToDate} placeholder="End date" className="bg-[#111] border-[#2a2a2a] hover:bg-[#111] hover:border-[#3a3a3a]" />
          </div>
          <FilterSelect label="Demand Metric" value={metric} onChange={setMetric} options={DEMAND_METRICS.map((m) => ({ value: m, label: m }))} />
        </div>
      </FilterBar>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={<Activity className="w-5 h-5 text-[#29B5E8]" />} label="Current Demand" value={kpis.currentDemand} suffix="" accent="border-[#29B5E8]/30" glow="from-[#29B5E8]/10" />
        <KpiCard icon={<TrendingUp className="w-5 h-5 text-violet-400" />} label="Forecast Peak" subtitle="Next 6mo" value={kpis.forecastPeak} suffix="" accent="border-violet-500/30" glow="from-violet-500/10" />
        <KpiCard icon={<ArrowUpRight className="w-5 h-5 text-emerald-400" />} label="Growth Rate" value={kpis.growthRate} suffix="%" accent="border-emerald-500/30" glow="from-emerald-500/10" />
        <KpiCard icon={<Shield className="w-5 h-5 text-amber-400" />} label="Supply Headroom" value={kpis.supplyHeadroom} suffix="" accent="border-amber-500/30" glow="from-amber-500/10" />
      </div>

      {/* Charts */}
      <GraphViewTab filters={filters} />
    </div>
    </PageTransition>
  );
}

/* ─── KPI Card ─── */

function KpiCard({ icon, label, subtitle, value, suffix, accent, glow }: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  value: number;
  suffix: string;
  accent: string;
  glow: string;
}) {
  return (
    <div className={`relative group bg-[#0a0a0a] rounded-2xl p-4 border ${accent} transition-all duration-300 overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-black/50 border border-[#1a1a1a]">{icon}</div>
          <div>
            <p className="text-xs text-gray-400 font-medium">{label}</p>
            {subtitle && <p className="text-[10px] text-gray-600">{subtitle}</p>}
          </div>
        </div>
        <p className="text-2xl font-bold text-white tabular-nums">
          <CountUp end={value} decimals={suffix === '%' ? 1 : 0} />{suffix && <span className="text-sm text-gray-400 ml-0.5">{suffix}</span>}
        </p>
      </div>
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
