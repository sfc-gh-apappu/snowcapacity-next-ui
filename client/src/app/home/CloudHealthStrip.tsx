'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Globe, Server, Activity, FileText, CheckCircle } from 'lucide-react';
import CountUp from '@/components/CountUp';
import type { CloudSummary } from './constants';
import { CLOUD_DISPLAY } from './constants';

function getHealth(cloud: CloudSummary): { color: string; label: string } {
  if (cloud.activeRequests >= 10)
    return { color: '#EF4444', label: 'Critical' };
  if (cloud.activeRequests >= 5)
    return { color: '#F59E0B', label: 'Warning' };
  return { color: '#10B981', label: 'Healthy' };
}

export default function CloudHealthStrip({ byCloud }: { byCloud: CloudSummary[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {byCloud.map((cloud) => (
        <CloudCard key={cloud.cloud} cloud={cloud} />
      ))}
    </div>
  );
}

function CloudCard({ cloud }: { cloud: CloudSummary }) {
  const display = CLOUD_DISPLAY[cloud.cloud] ?? { provider: cloud.cloud.toLowerCase(), label: cloud.cloud, logo: '', color: '#6B7280' };
  const health = getHealth(cloud);

  return (
    <div className="group relative rounded-2xl bg-[#0a0a0c] border border-[#141414] overflow-hidden hover:border-[#222] transition-all duration-300">
      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${display.color}, ${display.color}40, transparent)` }} />

      <div className="p-5 space-y-4">
        <Link
          href={`/capacity-overview?cloud=${display.provider}`}
          className="flex items-center justify-between hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-3">
            {display.logo && <Image src={display.logo} alt={display.label} width={28} height={28} className="object-contain" />}
            <span className="text-base font-semibold text-white">{display.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: health.color, boxShadow: `0 0 8px ${health.color}50` }}
            />
            <span className="text-xs font-medium" style={{ color: health.color }}>{health.label}</span>
          </div>
        </Link>

        <div className="grid grid-cols-5 gap-2">
          <Metric icon={<Globe className="w-3.5 h-3.5" />} value={cloud.regions ?? 0} label="Regions" color={display.color} href={`/capacity-overview?cloud=${display.provider}`} />
          <Metric icon={<Server className="w-3.5 h-3.5" />} value={cloud.deployments ?? 0} label="Deployments" color={display.color} href={`/capacity-overview?cloud=${display.provider}`} />
          <Metric icon={<Activity className="w-3.5 h-3.5" />} value={Math.round(cloud.avgDemandProxy ?? 0)} suffix="inst" label="Avg Demand" color={display.color} href={`/capacity-overview?cloud=${display.provider}`} />
          <Metric icon={<FileText className="w-3.5 h-3.5" />} value={cloud.activeRequests ?? 0} label="Active Reqs" color={display.color} href={`/request?tab=view&cloud=${display.provider}&status=pending`} />
          <Metric icon={<CheckCircle className="w-3.5 h-3.5" />} value={cloud.completedThisMonth ?? 0} label="Done/Mo" color={display.color} href={`/request?tab=view&cloud=${display.provider}`} />
        </div>
      </div>

      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: `${display.color}08` }}
      />
    </div>
  );
}

function Metric({ icon, value, suffix, label, color, href }: { icon: React.ReactNode; value: number; suffix?: string; label: string; color: string; href: string }) {
  return (
    <Link href={href} className="text-center rounded-xl py-2 hover:bg-white/[0.03] transition-colors">
      <div className="flex items-center justify-center gap-1 mb-1" style={{ color }}>
        {icon}
      </div>
      <p className="text-lg font-bold text-white tabular-nums">
        <CountUp end={value} />
        {suffix && <span className="text-[10px] font-normal text-gray-500 ml-0.5">{suffix}</span>}
      </p>
      <p className="text-[10px] text-gray-400 leading-tight">{label}</p>
    </Link>
  );
}
