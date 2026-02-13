'use client';

import { useState } from 'react';
import { Plus, ListFilter, Eye } from 'lucide-react';
import CreateRequestTab from './components/CreateRequestTab';
import MyRequestsTab from './components/MyRequestsTab';
import ViewRequestsTab from './components/ViewRequestsTab';

const tabs = [
  { id: 'create', label: 'Create Request', icon: Plus },
  { id: 'my-requests', label: 'My Requests', icon: ListFilter },
  { id: 'view', label: 'View Requests', icon: Eye },
];

export default function Request() {
  const [activeTab, setActiveTab] = useState('my-requests');
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold">
          <span className="bg-gradient-to-r from-[#29B5E8] via-[#7DD3FC] to-white bg-clip-text text-transparent">
            Requests
          </span>
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Manage and track capacity requests</p>
      </div>

      {/* Pill Tabs */}
      <div className="flex items-center gap-1 p-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl w-fit">
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
      {activeTab === 'create' && <CreateRequestTab />}
      {activeTab === 'my-requests' && <MyRequestsTab filter={filter} setFilter={setFilter} />}
      {activeTab === 'view' && <ViewRequestsTab />}
    </div>
  );
}
