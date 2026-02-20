'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ResponsiveContainer, ComposedChart, AreaChart, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';
import { Download, Check } from 'lucide-react';
import { DEMAND_DATA } from '../constants';

interface GraphViewTabProps {
  filters: {
    product: string;
    region: string;
    metric: string;
  };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

type ChartRow = {
  date: string;
  dateLabel: string;
  totalHist: number | null;
  totalFore: number | null;
  supply: number | null;
  predLb: number | null;
  predUb: number | null;
  custHist: number | null;
  intHist: number | null;
  freeHist: number | null;
  custFore: number | null;
  intFore: number | null;
  freeFore: number | null;
  prodHist: number | null;
  prodFore: number | null;
  prodLb: number | null;
  prodUb: number | null;
};

function formatNum(v: number) {
  return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);
}

export default function GraphViewTab({ filters }: GraphViewTabProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const { totalChartData, breakdownChartData, productChartData, lastHistDate } = useMemo(() => {
    const historical = DEMAND_DATA.filter((d) => d.type === 'historical');
    const forecast = DEMAND_DATA.filter((d) => d.type === 'forecast');
    const lastHist = historical[historical.length - 1]?.date ?? '';

    const dateMap = new Map<string, Record<string, number | null>>();

    for (const d of DEMAND_DATA) {
      if (!dateMap.has(d.date)) {
        dateMap.set(d.date, {
          totalHist: null, totalFore: null, supply: d.supply,
          predLb: null, predUb: null,
          custHist: null, intHist: null, freeHist: null,
          custFore: null, intFore: null, freeFore: null,
          prodHist: null, prodFore: null,
          prodLb: null, prodUb: null,
        });
      }
      const row = dateMap.get(d.date)!;
      row.supply = d.supply;

      if (d.type === 'historical') {
        row.totalHist = d.totalDemand;
        row.custHist = d.customerUse;
        row.intHist = d.internalUse;
        row.freeHist = d.freePool;
        row.prodHist = d.productDemand;
      }
      if (d.type === 'forecast') {
        row.totalFore = d.totalDemand;
        row.predLb = d.predLb ?? null;
        row.predUb = d.predUb ?? null;
        row.custFore = d.customerUse;
        row.intFore = d.internalUse;
        row.freeFore = d.freePool;
        row.prodFore = d.productDemand;
        row.prodLb = d.productPredLb ?? null;
        row.prodUb = d.productPredUb ?? null;
      }
    }

    const sorted: ChartRow[] = Array.from(dateMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, row]) => ({ date, dateLabel: formatDate(date), ...row } as ChartRow));

    return {
      totalChartData: sorted,
      breakdownChartData: sorted,
      productChartData: sorted,
      lastHistDate: lastHist,
    };
  }, []);

  const lastHistLabel = lastHistDate ? formatDate(lastHistDate) : undefined;

  const exportDemandSupply = useCallback(() => {
    const headers = ['Date', 'Total Demand (Historical)', 'Total Demand (Forecast)', 'Supply', 'Confidence LB', 'Confidence UB'];
    const rows = totalChartData.map((d) => [d.date, d.totalHist ?? '', d.totalFore ?? '', d.supply ?? '', d.predLb ?? '', d.predUb ?? '']);
    downloadCsv('demand_vs_supply.csv', headers, rows);
  }, [totalChartData]);

  const exportBreakdown = useCallback(() => {
    const headers = ['Date', 'Customer Use (Hist)', 'Internal Use (Hist)', 'Free Pool (Hist)', 'Customer Use (Fore)', 'Internal Use (Fore)', 'Free Pool (Fore)'];
    const rows = breakdownChartData.map((d) => [d.date, d.custHist ?? '', d.intHist ?? '', d.freeHist ?? '', d.custFore ?? '', d.intFore ?? '', d.freeFore ?? '']);
    downloadCsv('demand_breakdown.csv', headers, rows);
  }, [breakdownChartData]);

  const exportProduct = useCallback(() => {
    const headers = ['Date', 'Product Demand (Historical)', 'Product Demand (Forecast)', 'Confidence LB', 'Confidence UB'];
    const rows = productChartData.map((d) => [d.date, d.prodHist ?? '', d.prodFore ?? '', d.prodLb ?? '', d.prodUb ?? '']);
    downloadCsv('product_demand.csv', headers, rows);
  }, [productChartData]);

  return (
    <div className="space-y-6">
      {/* 1. Total Demand vs Supply */}
      <ChartContainer
        title="Total Demand vs Supply"
        subtitle={`${filters.metric} metric`}
        accentBorder="from-[#29B5E8]/40 to-violet-500/20"
        accentFrom="from-[#29B5E8]/20"
        accentColor="#29B5E8"
        forecastColor="#8B5CF6"
        onExport={exportDemandSupply}
        legends={[
          { color: '#29B5E8', label: 'Historical' },
          { color: '#8B5CF6', label: 'Forecast' },
          { color: '#F59E0B', label: 'Supply', dashed: true },
          { color: '#8B5CF6', label: 'Confidence Band', band: true },
        ]}
      >
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={totalChartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="grad-totalHist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#29B5E8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#29B5E8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad-totalFore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
              <XAxis dataKey="dateLabel" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={{ stroke: '#1a1a1a' }} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatNum} />
              <Tooltip content={<DemandSupplyTooltip />} />
              {lastHistLabel && <ReferenceLine x={lastHistLabel} stroke="#333" strokeDasharray="4 4" label={{ value: 'Today', position: 'top', fill: '#6b7280', fontSize: 10 }} />}

              {/* Confidence band */}
              <Area type="monotone" dataKey="predUb" stroke="none" fill="#8B5CF6" fillOpacity={0.08} connectNulls={false} dot={false} activeDot={false} />
              <Area type="monotone" dataKey="predLb" stroke="none" fill="#070709" fillOpacity={1} connectNulls={false} dot={false} activeDot={false} />

              {/* Demand lines */}
              <Area type="monotone" dataKey="totalHist" stroke="#29B5E8" strokeWidth={2} fill="url(#grad-totalHist)" connectNulls={false} dot={false} activeDot={{ r: 5, fill: '#29B5E8', stroke: '#070709', strokeWidth: 3 }} />
              <Area type="monotone" dataKey="totalFore" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="6 3" fill="url(#grad-totalFore)" connectNulls={false} dot={false} activeDot={{ r: 5, fill: '#8B5CF6', stroke: '#070709', strokeWidth: 3 }} />

              {/* Supply line */}
              <Line type="stepAfter" dataKey="supply" stroke="#F59E0B" strokeWidth={2} strokeDasharray="8 4" dot={false} activeDot={{ r: 4, fill: '#F59E0B', stroke: '#070709', strokeWidth: 2 }} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>

      {/* 2. Demand Breakdown by Source */}
      <ChartContainer
        title="Demand Breakdown by Source"
        subtitle="Customer Use + Internal Use + Free Pool"
        accentBorder="from-emerald-500/40 to-[#29B5E8]/20"
        accentFrom="from-emerald-500/20"
        accentColor="#10B981"
        forecastColor="#29B5E8"
        onExport={exportBreakdown}
        legends={[
          { color: '#10B981', label: 'Customer Use' },
          { color: '#F59E0B', label: 'Internal Use' },
          { color: '#6366F1', label: 'Free Pool' },
        ]}
      >
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={breakdownChartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="grad-cust" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="grad-int" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="grad-free" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
              <XAxis dataKey="dateLabel" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={{ stroke: '#1a1a1a' }} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatNum} />
              <Tooltip content={<BreakdownTooltip />} />
              {lastHistLabel && <ReferenceLine x={lastHistLabel} stroke="#333" strokeDasharray="4 4" label={{ value: 'Today', position: 'top', fill: '#6b7280', fontSize: 10 }} />}

              <Area type="monotone" dataKey="custHist" stackId="hist" stroke="#10B981" strokeWidth={1.5} fill="url(#grad-cust)" connectNulls={false} dot={false} />
              <Area type="monotone" dataKey="intHist" stackId="hist" stroke="#F59E0B" strokeWidth={1.5} fill="url(#grad-int)" connectNulls={false} dot={false} />
              <Area type="monotone" dataKey="freeHist" stackId="hist" stroke="#6366F1" strokeWidth={1.5} fill="url(#grad-free)" connectNulls={false} dot={false} />

              <Area type="monotone" dataKey="custFore" stackId="fore" stroke="#10B981" strokeWidth={1.5} strokeDasharray="4 2" fill="url(#grad-cust)" fillOpacity={0.5} connectNulls={false} dot={false} />
              <Area type="monotone" dataKey="intFore" stackId="fore" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="4 2" fill="url(#grad-int)" fillOpacity={0.5} connectNulls={false} dot={false} />
              <Area type="monotone" dataKey="freeFore" stackId="fore" stroke="#6366F1" strokeWidth={1.5} strokeDasharray="4 2" fill="url(#grad-free)" fillOpacity={0.5} connectNulls={false} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>

      {/* 3. Product Demand */}
      <ChartContainer
        title={`${filters.product} Demand (Historical + Forecast)`}
        subtitle={`${filters.region} \u00B7 ${filters.metric} metric`}
        accentBorder="from-emerald-500/40 to-amber-500/20"
        accentFrom="from-emerald-500/20"
        accentColor="#10B981"
        forecastColor="#F59E0B"
        onExport={exportProduct}
        legends={[
          { color: '#10B981', label: 'Historical' },
          { color: '#F59E0B', label: 'Forecast' },
          { color: '#F59E0B', label: 'Confidence Band', band: true },
        ]}
      >
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={productChartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="grad-prodHist" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad-prodFore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
              <XAxis dataKey="dateLabel" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={{ stroke: '#1a1a1a' }} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={formatNum} />
              <Tooltip content={<ProductTooltip />} />
              {lastHistLabel && <ReferenceLine x={lastHistLabel} stroke="#333" strokeDasharray="4 4" label={{ value: 'Today', position: 'top', fill: '#6b7280', fontSize: 10 }} />}

              {/* Product confidence band */}
              <Area type="monotone" dataKey="prodUb" stroke="none" fill="#F59E0B" fillOpacity={0.08} connectNulls={false} dot={false} activeDot={false} />
              <Area type="monotone" dataKey="prodLb" stroke="none" fill="#070709" fillOpacity={1} connectNulls={false} dot={false} activeDot={false} />

              <Area type="monotone" dataKey="prodHist" stroke="#10B981" strokeWidth={2} fill="url(#grad-prodHist)" connectNulls={false} dot={false} activeDot={{ r: 5, fill: '#10B981', stroke: '#070709', strokeWidth: 3 }} />
              <Area type="monotone" dataKey="prodFore" stroke="#F59E0B" strokeWidth={2} strokeDasharray="6 3" fill="url(#grad-prodFore)" connectNulls={false} dot={false} activeDot={{ r: 5, fill: '#F59E0B', stroke: '#070709', strokeWidth: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>
    </div>
  );
}

/* ─── CSV Export Utility ─── */

function downloadCsv(filename: string, headers: string[], rows: (string | number | null)[][]) {
  const escape = (v: string | number | null) => {
    if (v == null || v === '') return '';
    const s = String(v);
    return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── Chart Container ─── */

type LegendItem = { color: string; label: string; dashed?: boolean; band?: boolean };

function ChartContainer({ title, subtitle, accentBorder, accentFrom, accentColor, children, legends, onExport }: {
  title: string;
  subtitle: string;
  accentBorder: string;
  accentFrom: string;
  accentColor: string;
  forecastColor: string;
  legends: LegendItem[];
  onExport?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative rounded-2xl overflow-hidden">
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accentBorder} via-transparent p-px`}>
        <div className="w-full h-full rounded-2xl bg-[#070709]" />
      </div>
      <div className={`absolute -top-20 -left-20 w-48 h-48 bg-gradient-to-br ${accentFrom} to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

      <div className="relative">
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
        <div className="px-6 pt-5 pb-2 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {legends.map((l) => (
              <div key={l.label + l.color} className="flex items-center gap-1.5">
                {l.band ? (
                  <div className="w-4 h-2.5 rounded-sm" style={{ backgroundColor: l.color, opacity: 0.2 }} />
                ) : (
                  <div className="w-3 h-[3px] rounded-full" style={{ backgroundColor: l.color, ...(l.dashed ? { backgroundImage: `repeating-linear-gradient(90deg, ${l.color} 0, ${l.color} 3px, transparent 3px, transparent 6px)`, backgroundColor: 'transparent' } : {}) }} />
                )}
                <span className="text-gray-400">{l.label}</span>
              </div>
            ))}
            {onExport && <ExportButton onClick={onExport} />}
          </div>
        </div>
        <div className="px-2 pb-4" style={{ height: 320 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Export Button ─── */

function ExportButton({ onClick }: { onClick: () => void }) {
  const [done, setDone] = useState(false);

  const handle = () => {
    onClick();
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };

  return (
    <button
      onClick={handle}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ml-1 ${
        done
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#3a3a3a]'
      }`}
    >
      {done ? <Check className="w-3 h-3" /> : <Download className="w-3 h-3" />}
      {done ? 'Saved' : 'CSV'}
    </button>
  );
}

/* ─── Tooltips ─── */

function TooltipShell({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm">
      {label && <p className="text-xs text-gray-500 mb-2 font-medium">{label}</p>}
      {children}
    </div>
  );
}

function TooltipRow({ color, label, value }: { color: string; label: string; value: number | null | undefined }) {
  if (value == null) return null;
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }} />
      <span className="text-gray-400">{label}:</span>
      <span className="text-white font-semibold tabular-nums">{value.toLocaleString()}</span>
    </div>
  );
}

function DemandSupplyTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number | null }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const get = (key: string) => payload.find((p) => p.dataKey === key)?.value ?? null;
  return (
    <TooltipShell label={label}>
      <TooltipRow color="#29B5E8" label="Historical" value={get('totalHist')} />
      <TooltipRow color="#8B5CF6" label="Forecast" value={get('totalFore')} />
      <TooltipRow color="#F59E0B" label="Supply" value={get('supply')} />
      {get('predLb') != null && get('predUb') != null && (
        <div className="text-[11px] text-gray-500 mt-1">
          Band: {get('predLb')?.toLocaleString()} &ndash; {get('predUb')?.toLocaleString()}
        </div>
      )}
    </TooltipShell>
  );
}

function BreakdownTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number | null }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const get = (key: string) => payload.find((p) => p.dataKey === key)?.value ?? null;
  const cust = get('custHist') ?? get('custFore');
  const int_ = get('intHist') ?? get('intFore');
  const free = get('freeHist') ?? get('freeFore');
  return (
    <TooltipShell label={label}>
      <TooltipRow color="#10B981" label="Customer Use" value={cust} />
      <TooltipRow color="#F59E0B" label="Internal Use" value={int_} />
      <TooltipRow color="#6366F1" label="Free Pool" value={free} />
      {cust != null && int_ != null && free != null && (
        <div className="text-[11px] text-gray-500 mt-1 pt-1 border-t border-[#2a2a2a]">
          Total: <span className="text-white font-medium">{(cust + int_ + free).toLocaleString()}</span>
        </div>
      )}
    </TooltipShell>
  );
}

function ProductTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number | null }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const get = (key: string) => payload.find((p) => p.dataKey === key)?.value ?? null;
  return (
    <TooltipShell label={label}>
      <TooltipRow color="#10B981" label="Historical" value={get('prodHist')} />
      <TooltipRow color="#F59E0B" label="Forecast" value={get('prodFore')} />
      {get('prodLb') != null && get('prodUb') != null && (
        <div className="text-[11px] text-gray-500 mt-1">
          Band: {get('prodLb')?.toLocaleString()} &ndash; {get('prodUb')?.toLocaleString()}
        </div>
      )}
    </TooltipShell>
  );
}
