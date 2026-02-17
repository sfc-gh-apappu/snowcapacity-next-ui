'use client';

import React, { useState } from 'react';
import { Copy, Check, History, TrendingUp, Terminal } from 'lucide-react';
import { buildHistoricalQuery, buildForecastQuery } from '../constants';

interface QueryViewTabProps {
  filters: {
    cloud: string;
    product: string;
    region: string;
    deployment: string;
    warehouseType: string;
    metric: string;
    fromDate: string;
    toDate: string;
  };
}

export default function QueryViewTab({ filters }: QueryViewTabProps) {
  const historical = buildHistoricalQuery(filters);
  const forecast = buildForecastQuery(filters);

  return (
    <div className="space-y-6">
      <QueryBlock
        title="Historical Query"
        icon={<History className="w-4 h-4 text-[#29B5E8]" />}
        sql={historical.sql}
        params={historical.params}
        accentColor="#29B5E8"
        accentBorder="from-[#29B5E8]/40 to-transparent"
        glowClass="from-[#29B5E8]/15"
      />
      <QueryBlock
        title="Forecast Query"
        icon={<TrendingUp className="w-4 h-4 text-violet-400" />}
        sql={forecast.sql}
        params={forecast.params}
        accentColor="#8B5CF6"
        accentBorder="from-violet-500/40 to-transparent"
        glowClass="from-violet-500/15"
      />
    </div>
  );
}

function QueryBlock({
  title, icon, sql, params, accentColor, accentBorder, glowClass,
}: {
  title: string;
  icon: React.ReactNode;
  sql: string;
  params: Record<string, string>;
  accentColor: string;
  accentBorder: string;
  glowClass: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden">
      {/* Gradient border */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accentBorder} via-transparent p-px`}>
        <div className="w-full h-full rounded-2xl bg-[#070709]" />
      </div>

      {/* Hover glow */}
      <div className={`absolute -top-16 -left-16 w-40 h-40 bg-gradient-to-br ${glowClass} to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

      <div className="relative">
        {/* Top accent */}
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />

        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${accentColor}15` }}>
              {icon}
            </div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all hover:scale-[1.02]"
            style={{
              borderColor: copied ? '#10B98140' : '#2a2a2a',
              backgroundColor: copied ? '#10B98115' : '#1a1a1a',
              color: copied ? '#10B981' : '#9ca3af',
            }}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy SQL'}
          </button>
        </div>

        {/* SQL */}
        <div className="px-6 py-4 border-b border-[#1a1a1a] relative">
          <div className="absolute top-4 right-6">
            <Terminal className="w-4 h-4 text-gray-700" />
          </div>
          <pre className="text-sm font-mono text-gray-300 leading-relaxed overflow-x-auto whitespace-pre">
            {highlightSQL(sql)}
          </pre>
        </div>

        {/* Params */}
        <div className="px-6 py-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">Parameters</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(params).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2 text-sm py-1">
                <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ color: accentColor, backgroundColor: `${accentColor}15` }}>:{key}</span>
                <span className="text-gray-600">=</span>
                <span className="font-mono text-white text-xs bg-[#1a1a1a] px-2.5 py-1 rounded-lg border border-[#2a2a2a]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Simple SQL keyword highlighting via JSX ─── */

function highlightSQL(sql: string) {
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'GROUP BY', 'ORDER BY',
    'ASC', 'DESC', 'AS', 'BETWEEN', 'WITHIN GROUP', 'LIMIT',
    'JOIN', 'ON', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
    'MAX', 'MIN', 'AVG', 'SUM', 'COUNT', 'MEDIAN',
    'PERCENTILE_CONT', 'DATE_TRUNC',
  ];

  const lines = sql.split('\n');

  return (
    <>
      {lines.map((line, i) => {
        const result = line;
        const parts: (string | React.ReactElement)[] = [];
        const remaining = line;
        let keyIdx = 0;

        const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
        let match;
        let lastIdx = 0;

        while ((match = regex.exec(remaining)) !== null) {
          if (match.index > lastIdx) {
            parts.push(highlightParams(remaining.slice(lastIdx, match.index), `${i}-pre-${keyIdx}`));
          }
          parts.push(
            <span key={`${i}-kw-${keyIdx}`} className="text-[#29B5E8] font-semibold">
              {match[0]}
            </span>
          );
          lastIdx = match.index + match[0].length;
          keyIdx++;
        }

        if (lastIdx < remaining.length) {
          parts.push(highlightParams(remaining.slice(lastIdx), `${i}-end`));
        }

        return (
          <span key={i}>
            {parts.length > 0 ? parts : result}
            {i < lines.length - 1 && '\n'}
          </span>
        );
      })}
    </>
  );
}

function highlightParams(text: string, keyPrefix: string) {
  const parts: (string | React.ReactElement)[] = [];
  const regex = /(:[a-z_]+)/g;
  let match;
  let lastIdx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    parts.push(
      <span key={`${keyPrefix}-p-${match.index}`} className="text-amber-400">
        {match[0]}
      </span>
    );
    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }

  return <span key={keyPrefix}>{parts}</span>;
}
