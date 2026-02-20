'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Activity, Calendar, FileText } from 'lucide-react';
import CountUp from '@/components/CountUp';
import { CLOUD_HEALTH, type CloudHealth } from './constants';

const HEALTH_DOT: Record<CloudHealth['health'], { color: string; label: string }> = {
  healthy: { color: '#10B981', label: 'Healthy' },
  warning: { color: '#F59E0B', label: 'Warning' },
  critical: { color: '#EF4444', label: 'Critical' },
};

export default function CloudHealthStrip() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {CLOUD_HEALTH.map((cloud) => (
        <CloudCard key={cloud.provider} cloud={cloud} />
      ))}
    </div>
  );
}

function CloudCard({ cloud }: { cloud: CloudHealth }) {
  const dot = HEALTH_DOT[cloud.health];

  return (
    <div className="group relative rounded-2xl bg-[#0a0a0c] border border-[#141414] overflow-hidden hover:border-[#222] transition-all duration-300">
      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${cloud.color}, ${cloud.color}40, transparent)` }} />

      <div className="p-5 space-y-4">
        {/* Header row — links to capacity overview for this cloud */}
        <Link
          href={`/capacity-overview?cloud=${cloud.provider}`}
          className="flex items-center justify-between hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <Image src={cloud.logo} alt={cloud.label} width={28} height={28} className="object-contain" />
            <span className="text-base font-semibold text-white">{cloud.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: dot.color, boxShadow: `0 0 8px ${dot.color}50` }}
            />
            <span className="text-xs font-medium" style={{ color: dot.color }}>{dot.label}</span>
          </div>
        </Link>

        {/* Metrics — each links to its dedicated page */}
        <div className="grid grid-cols-3 gap-3">
          <Metric icon={<Calendar className="w-3.5 h-3.5" />} value={cloud.activeReservations} label="Reservations" color={cloud.color} href="/reservation" />
          <Metric icon={<Activity className="w-3.5 h-3.5" />} value={cloud.quotaUtilization} label="Quota Util %" color={cloud.color} href="/quota" />
          <Metric icon={<FileText className="w-3.5 h-3.5" />} value={cloud.pendingRequests} label="Pending Requests" color={cloud.color} href={`/request?tab=view&cloud=${cloud.provider}&status=pending`} />
        </div>
      </div>

      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: `${cloud.color}08` }}
      />
    </div>
  );
}

function Metric({ icon, value, label, color, href }: { icon: React.ReactNode; value: number; label: string; color: string; href: string }) {
  return (
    <Link href={href} className="text-center rounded-xl py-2 -mx-1 px-1 hover:bg-white/[0.03] transition-colors">
      <div className="flex items-center justify-center gap-1 mb-1" style={{ color }}>
        {icon}
      </div>
      <p className="text-xl font-bold text-white tabular-nums"><CountUp end={value} /></p>
      <p className="text-xs text-gray-400">{label}</p>
    </Link>
  );
}
