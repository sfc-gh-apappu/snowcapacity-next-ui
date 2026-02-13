'use client';

import Image from 'next/image';
import { Search, Check, MapPin, Building2 } from 'lucide-react';
import {
  CLOUD_PROVIDERS,
  REGIONS_BY_PROVIDER,
  SAMPLE_SUBSCRIPTIONS,
  ENVIRONMENTS,
  DEPLOYMENTS,
  getProviderAccountLabel,
} from '../constants';
import type { RequestForm } from '../constants';

interface StepWhereProps {
  form: RequestForm;
  setForm: (form: RequestForm) => void;
  knowsSubscription: boolean;
  setKnowsSubscription: (v: boolean) => void;
  subSearch: string;
  setSubSearch: (v: string) => void;
}

export default function StepWhere({
  form,
  setForm,
  knowsSubscription,
  setKnowsSubscription,
  subSearch,
  setSubSearch,
}: StepWhereProps) {
  const selectedCloud = CLOUD_PROVIDERS.find(c => c.id === form.cloudProvider);
  const regions = form.cloudProvider ? REGIONS_BY_PROVIDER[form.cloudProvider] || [] : [];
  const subscriptions = form.cloudProvider ? SAMPLE_SUBSCRIPTIONS[form.cloudProvider] || [] : [];
  const filteredSubs = subscriptions.filter(s =>
    s.name.toLowerCase().includes(subSearch.toLowerCase()) || s.id.toLowerCase().includes(subSearch.toLowerCase())
  );
  const providerAccountLabel = getProviderAccountLabel(form.cloudProvider);

  return (
    <div className="relative z-10 space-y-7">
      <div className="flex items-center gap-3">
        {selectedCloud && (
          <Image src={selectedCloud.logo} alt={selectedCloud.label} width={32} height={32} className="object-contain" />
        )}
        <div>
          <h2 className="text-2xl font-semibold text-white">{selectedCloud?.label} Infrastructure Target</h2>
          <p className="text-gray-400 mt-0.5">Specify region and account for your request</p>
        </div>
      </div>

      {/* Region */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
          <MapPin className="w-4 h-4" /> Region
        </label>
        <div className="flex flex-wrap gap-2">
          {regions.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setForm({ ...form, region: r })}
              className={`
                px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                ${form.region === r
                  ? `bg-gradient-to-r ${selectedCloud?.color || 'from-[#29B5E8] to-[#1E88B5]'} text-white shadow-lg ${selectedCloud?.glow || 'shadow-[#29B5E8]/30'}`
                  : 'bg-[#1a1a1a] text-gray-500 hover:bg-[#1a1a1a]/80 hover:text-gray-300'
                }
              `}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Subscription / Account — Smart Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
            <Building2 className="w-4 h-4" /> {providerAccountLabel}
          </label>
        </div>

        {/* Toggle between search vs env+deployment */}
        <div className="flex items-center gap-3 mb-1">
          <button
            type="button"
            onClick={() => { setKnowsSubscription(true); setForm({ ...form, environment: '', deployment: '' }); }}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
              knowsSubscription
                ? 'bg-[#29B5E8]/20 text-[#29B5E8] border border-[#29B5E8]/30'
                : 'bg-[#1a1a1a] text-gray-500 border border-transparent hover:text-gray-300'
            }`}
          >
            Search by ID / Name
          </button>
          <button
            type="button"
            onClick={() => { setKnowsSubscription(false); setForm({ ...form, subscriptionId: '' }); setSubSearch(''); }}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
              !knowsSubscription
                ? 'bg-[#29B5E8]/20 text-[#29B5E8] border border-[#29B5E8]/30'
                : 'bg-[#1a1a1a] text-gray-500 border border-transparent hover:text-gray-300'
            }`}
          >
            Find by Environment & Deployment
          </button>
        </div>

        {knowsSubscription ? (
          <div className="space-y-3">
            {/* Search box */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
                placeholder={`Search ${providerAccountLabel.toLowerCase()}...`}
                className="w-full pl-10 pr-4 py-3 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#29B5E8] focus:border-transparent transition-all"
              />
            </div>
            {/* Subscription list */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {filteredSubs.map((sub) => {
                const isSelected = form.subscriptionId === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setForm({ ...form, subscriptionId: sub.id })}
                    className={`
                      w-full text-left flex items-center justify-between p-4 rounded-xl border transition-all duration-300
                      ${isSelected
                        ? `border-[#29B5E8] bg-[#29B5E8]/5 shadow-lg shadow-[#29B5E8]/10`
                        : 'border-[#1a1a1a] bg-black/50 hover:border-[#2a2a2a]'
                      }
                    `}
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{sub.name}</p>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">{sub.id}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
              {filteredSubs.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No matching accounts found</p>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Environment */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Environment</label>
              <div className="space-y-2">
                {ENVIRONMENTS.map((env) => (
                  <button
                    key={env}
                    type="button"
                    onClick={() => setForm({ ...form, environment: env })}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                      ${form.environment === env
                        ? 'bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white shadow-lg shadow-[#29B5E8]/30'
                        : 'bg-[#1a1a1a] text-gray-500 hover:bg-[#1a1a1a]/80 hover:text-gray-300'
                      }
                    `}
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>
            {/* Deployment */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Deployment</label>
              <div className="space-y-2">
                {DEPLOYMENTS.map((dep) => (
                  <button
                    key={dep}
                    type="button"
                    onClick={() => setForm({ ...form, deployment: dep })}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                      ${form.deployment === dep
                        ? 'bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white shadow-lg shadow-[#29B5E8]/30'
                        : 'bg-[#1a1a1a] text-gray-500 hover:bg-[#1a1a1a]/80 hover:text-gray-300'
                      }
                    `}
                  >
                    {dep}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
