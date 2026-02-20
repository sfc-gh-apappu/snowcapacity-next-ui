'use client';

import Link from 'next/link';
import { Calendar, FileText, ArrowRight, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { MY_RESERVATIONS, MY_REQUESTS, type MyRequest } from './constants';

const STATUS_CONFIG: Record<MyRequest['status'], { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  pending: { icon: Clock, color: '#EAB308', label: 'Pending' },
  approved: { icon: CheckCircle, color: '#10B981', label: 'Approved' },
  rejected: { icon: XCircle, color: '#EF4444', label: 'Rejected' },
  in_progress: { icon: Loader2, color: '#29B5E8', label: 'In Progress' },
};

export default function MyActivity() {
  return (
    <div className="space-y-5">
      {/* My Reservations */}
      <div className="rounded-2xl bg-[#0a0a0c] border border-[#141414] overflow-hidden">
        <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500/60 to-transparent" />
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-300">My Reservations</h3>
                <p className="text-xs text-gray-500">{MY_RESERVATIONS.length} active</p>
              </div>
            </div>
            <Link href="/reservation" className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {MY_RESERVATIONS.map((r) => (
              <div key={r.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#111] border border-[#1a1a1a] hover:border-[#222] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-gray-500 flex-shrink-0">{r.id}</span>
                  <span className="text-sm text-white font-medium truncate">{r.instanceType}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-gray-400">{r.region}</span>
                  <span className="text-sm font-semibold text-emerald-400 tabular-nums">&times;{r.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Requests */}
      <div className="rounded-2xl bg-[#0a0a0c] border border-[#141414] overflow-hidden">
        <div className="h-[2px] w-full bg-gradient-to-r from-amber-500/60 to-transparent" />
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-300">My Requests</h3>
                <p className="text-xs text-gray-500">{MY_REQUESTS.length} recent</p>
              </div>
            </div>
            <Link href="/request?tab=my-requests" className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {MY_REQUESTS.map((req) => {
              const cfg = STATUS_CONFIG[req.status];
              const StatusIcon = cfg.icon;
              return (
                <div key={req.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#111] border border-[#1a1a1a] hover:border-[#222] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-[#29B5E8] flex-shrink-0">{req.id}</span>
                    <span className="text-sm text-white font-medium truncate">{req.title}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0" style={{ color: cfg.color }}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{cfg.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
