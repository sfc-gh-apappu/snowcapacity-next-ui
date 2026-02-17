'use client';

import { useState } from 'react';
import { FileText, Settings2, Lock } from 'lucide-react';
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold">
          <span className="bg-gradient-to-r from-[#29B5E8] via-[#7DD3FC] to-white bg-clip-text text-transparent">
            Admin
          </span>
        </h1>
        <p className="text-gray-400 mt-2 text-lg">System administration and configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1a1a1a] pb-px">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-xl border-b-2 transition-all ${
              activeTab === key
                ? 'text-[#29B5E8] border-[#29B5E8] bg-[#29B5E8]/5'
                : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-white/[0.02]'
            }`}
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
  );
}
