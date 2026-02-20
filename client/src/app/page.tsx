'use client';

import Link from 'next/link';
import { Plus, Share2, Loader2 } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useApiQuery } from '@/lib/api';
import type { HomeOverviewResponse } from './home/constants';
import CloudHealthStrip from './home/CloudHealthStrip';
import ComponentTiles from './home/ComponentTiles';
import MyActivity from './home/MyActivity';
import { ActivityFeed } from './home/RequestsSummary';

export default function Home() {
  const { data, isLoading, error } = useApiQuery<HomeOverviewResponse>('/api/home/overview');

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* ─── Welcome Header + Quick Actions ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              <span className="bg-gradient-to-r from-[#29B5E8] via-[#7DD3FC] to-white bg-clip-text text-transparent">
                Snowflake Capacity Platform
              </span>
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              All systems operational &mdash; capacity overview across AWS, Azure, and GCP.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/request?tab=create"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white hover:shadow-lg hover:shadow-[#29B5E8]/30 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Request New Capacity
            </Link>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm border border-[#1a1a1a] text-gray-400 hover:text-white hover:border-[#2a2a2a] transition-all duration-300"
            >
              <Share2 className="w-4 h-4" />
              Share to CSP
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-5 h-5 text-[#29B5E8] animate-spin" />
            <span className="ml-2 text-sm text-gray-500">Loading dashboard…</span>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-sm text-red-400">{error.message}</p>
          </div>
        )}

        {data && (
          <>
            {/* ─── Cloud Health Strip ─── */}
            <section>
              <SectionLabel label="Cloud Health" />
              <CloudHealthStrip byCloud={data.byCloud} />
            </section>

            {/* ─── Component Snapshots ─── */}
            <section>
              <SectionLabel label="Platform at a Glance" />
              <ComponentTiles data={data} />
            </section>

            {/* ─── Two-Column Bottom ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              <section>
                <SectionLabel label="My Activity" />
                <MyActivity />
              </section>
              <section className="flex flex-col" style={{ height: 'fit-content' }}>
                <SectionLabel label="Platform Feed" />
                <ActivityFeed items={data.recentActivity} />
              </section>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{label}</p>
  );
}
