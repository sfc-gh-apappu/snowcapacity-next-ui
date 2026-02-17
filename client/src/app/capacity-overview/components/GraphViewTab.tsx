'use client';

import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine,
} from 'recharts';
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

export default function GraphViewTab({ filters }: GraphViewTabProps) {
  const historicalData = DEMAND_DATA.filter((d) => d.type === 'historical');
  const forecastData = DEMAND_DATA.filter((d) => d.type === 'forecast');

  const chartData = DEMAND_DATA.map((d) => ({
    date: d.date,
    dateLabel: formatDate(d.date),
    totalHistorical: d.type === 'historical' ? d.totalDemand : null,
    productHistorical: d.type === 'historical' ? d.productDemand : null,
    totalForecast: d.type === 'forecast' ? d.totalDemand : null,
    productForecast: d.type === 'forecast' ? d.productDemand : null,
  }));

  const seen = new Set<string>();
  const mergedData: typeof chartData = [];
  for (const point of chartData) {
    if (seen.has(point.date)) {
      const existing = mergedData.find((p) => p.date === point.date)!;
      existing.totalForecast = point.totalForecast ?? existing.totalForecast;
      existing.productForecast = point.productForecast ?? existing.productForecast;
      existing.totalHistorical = point.totalHistorical ?? existing.totalHistorical;
      existing.productHistorical = point.productHistorical ?? existing.productHistorical;
    } else {
      seen.add(point.date);
      mergedData.push({ ...point });
    }
  }

  const lastHistDate = historicalData[historicalData.length - 1]?.date;

  return (
    <div className="space-y-6">
      <ChartCard
        title={`Total Demand (Historical + Forecast)`}
        subtitle={`${filters.metric} metric`}
        data={mergedData}
        historicalKey="totalHistorical"
        forecastKey="totalForecast"
        color="#29B5E8"
        forecastColor="#8B5CF6"
        accentFrom="from-[#29B5E8]/20"
        accentBorder="from-[#29B5E8]/40 to-violet-500/20"
        lastHistDate={lastHistDate}
      />

      <ChartCard
        title={`${filters.product} Demand (Historical + Forecast)`}
        subtitle={`${filters.region} · ${filters.metric} metric`}
        data={mergedData}
        historicalKey="productHistorical"
        forecastKey="productForecast"
        color="#10B981"
        forecastColor="#F59E0B"
        accentFrom="from-emerald-500/20"
        accentBorder="from-emerald-500/40 to-amber-500/20"
        lastHistDate={lastHistDate}
      />
    </div>
  );
}

/* ─── Chart Card ─── */

function ChartCard({
  title, subtitle, data, historicalKey, forecastKey, color, forecastColor, accentFrom, accentBorder, lastHistDate,
}: {
  title: string;
  subtitle: string;
  data: Record<string, unknown>[];
  historicalKey: string;
  forecastKey: string;
  color: string;
  forecastColor: string;
  accentFrom: string;
  accentBorder: string;
  lastHistDate: string;
}) {
  return (
    <div className="group relative rounded-2xl overflow-hidden">
      {/* Animated gradient border */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accentBorder} via-transparent p-px`}>
        <div className="w-full h-full rounded-2xl bg-[#070709]" />
      </div>

      {/* Subtle corner glow */}
      <div className={`absolute -top-20 -left-20 w-48 h-48 bg-gradient-to-br ${accentFrom} to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

      <div className="relative">
        {/* Top accent bar */}
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${color}, ${forecastColor}, transparent)` }} />

        <div className="px-6 pt-5 pb-2 flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-[3px] rounded-full" style={{ backgroundColor: color }} />
              <span className="text-gray-400">Historical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-[3px] rounded-full" style={{ backgroundColor: forecastColor }} />
              <span className="text-gray-400">Forecast</span>
            </div>
          </div>
        </div>

        <div className="px-2 pb-4" style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${historicalKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
                <linearGradient id={`grad-${forecastKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={forecastColor} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={forecastColor} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />

              <XAxis
                dataKey="dateLabel"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={{ stroke: '#1a1a1a' }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
              />

              <Tooltip content={<CustomTooltip color={color} forecastColor={forecastColor} />} />

              {lastHistDate && (
                <ReferenceLine
                  x={formatDate(lastHistDate)}
                  stroke="#333"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Today',
                    position: 'top',
                    fill: '#6b7280',
                    fontSize: 10,
                  }}
                />
              )}

              <Area
                type="monotone"
                dataKey={historicalKey}
                stroke={color}
                strokeWidth={2}
                fill={`url(#grad-${historicalKey})`}
                connectNulls={false}
                dot={false}
                activeDot={{ r: 5, fill: color, stroke: '#070709', strokeWidth: 3 }}
              />
              <Area
                type="monotone"
                dataKey={forecastKey}
                stroke={forecastColor}
                strokeWidth={2}
                strokeDasharray="6 3"
                fill={`url(#grad-${forecastKey})`}
                connectNulls={false}
                dot={false}
                activeDot={{ r: 5, fill: forecastColor, stroke: '#070709', strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ─── Custom Tooltip ─── */

function CustomTooltip({ active, payload, label, color, forecastColor }: {
  active?: boolean;
  payload?: { dataKey: string; value: number | null }[];
  label?: string;
  color: string;
  forecastColor: string;
}) {
  if (!active || !payload?.length) return null;

  const hist = payload.find((p) => p.dataKey.includes('Historical') && p.value !== null);
  const forecast = payload.find((p) => p.dataKey.includes('Forecast') && p.value !== null);

  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm">
      <p className="text-xs text-gray-500 mb-2 font-medium">{label}</p>
      {hist && (
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }} />
          <span className="text-gray-400">Historical:</span>
          <span className="text-white font-semibold tabular-nums">{hist.value?.toLocaleString()}</span>
        </div>
      )}
      {forecast && (
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: forecastColor, boxShadow: `0 0 6px ${forecastColor}60` }} />
          <span className="text-gray-400">Forecast:</span>
          <span className="text-white font-semibold tabular-nums">{forecast.value?.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
