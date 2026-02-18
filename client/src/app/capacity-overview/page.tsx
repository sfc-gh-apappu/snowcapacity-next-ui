'use client';

import { useState } from 'react';
import { BarChart3, Table2, Code2, ChevronDown } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import PageTransition from '@/components/PageTransition';
import {
  CLOUD_PROVIDERS, VIEW_TYPES, PRODUCTS, REGIONS, DEPLOYMENTS,
  WAREHOUSE_TYPES, DEMAND_METRICS,
} from './constants';
import { DatePicker } from '@/components/ui/date-picker';
import GraphViewTab from './components/GraphViewTab';
import TabularViewTab from './components/TabularViewTab';
import QueryViewTab from './components/QueryViewTab';

const tabs = [
  { id: 'graph', label: 'Graph View', icon: BarChart3 },
  { id: 'tabular', label: 'Tabular View', icon: Table2 },
  { id: 'query', label: 'Query View', icon: Code2 },
];

export default function CapacityOverview() {
  const [activeTab, setActiveTab] = useState('graph');

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

      {/* Tab Content */}
      {activeTab === 'graph' && <GraphViewTab filters={filters} />}
      {activeTab === 'tabular' && <TabularViewTab />}
      {activeTab === 'query' && <QueryViewTab filters={filters} />}
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
