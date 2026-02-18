'use client';

import { useState } from 'react';
import { FileText, Settings2, Lock } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import RequestAdmin from './components/RequestAdmin';
import QuotaConfigAdmin from './components/QuotaConfigAdmin';
import ConstrainedQuotasAdmin from './components/ConstrainedQuotasAdmin';

const TABS = [
  { key: 'requests', label: 'Requests', icon: FileText },
  { key: 'quota-config', label: 'Quota Configuration', icon: Settings2 },
  { key: 'constrained', label: 'Constrained Quotas', icon: Lock },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function Admin() {
  const [activeTab, setActiveTab] = useState<TabKey>('requests');

  return (
    <PageTransition>
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
          <span className="bg-gradient-to-r from-[#29B5E8] via-[#7DD3FC] to-white bg-clip-text text-transparent">
            Admin
          </span>
        </h1>
        <p className="text-gray-400 mt-2 text-lg">System administration and configuration</p>
      </div>

      {/* Pill Tabs */}
      <div className="flex items-center gap-1 p-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl w-fit max-w-full overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`
              relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300
              ${activeTab === key
                ? 'bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white shadow-lg shadow-[#29B5E8]/30'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'requests' && <RequestAdmin />}
      {activeTab === 'quota-config' && <QuotaConfigAdmin />}
      {activeTab === 'constrained' && <ConstrainedQuotasAdmin />}
    </div>
    </PageTransition>
  );
}
