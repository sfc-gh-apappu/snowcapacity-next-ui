'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, Check, MapPin, Building2, Navigation, ChevronDown, Snowflake } from 'lucide-react';
import {
  CLOUD_PROVIDERS,
  REGIONS_BY_PROVIDER,
  SAMPLE_SUBSCRIPTIONS,
  ENVIRONMENTS,
  DEPLOYMENTS,
  AVAILABILITY_ZONES,
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

  const isOnDemand = form.requestType === 'ONDEMAND_CREATE';
  const isReservation = form.requestType === 'RESERVATION_CREATE';

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
              onClick={() => setForm({ ...form, region: r, availabilityZone: '' })}
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

      {/* Availability Zone — only for Reservation */}
      {isReservation && form.region && (
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
            <Navigation className="w-4 h-4" /> Availability Zone
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABILITY_ZONES.filter(az => az.startsWith(form.region.toLowerCase().replace(/\s+/g, '-'))).length > 0
              ? AVAILABILITY_ZONES.filter(az => az.startsWith(form.region.toLowerCase().replace(/\s+/g, '-'))).map((az) => (
                <button
                  key={az}
                  type="button"
                  onClick={() => setForm({ ...form, availabilityZone: az })}
                  className={`
                    px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                    ${form.availabilityZone === az
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                      : 'bg-[#1a1a1a] text-gray-500 hover:bg-[#1a1a1a]/80 hover:text-gray-300'
                    }
                  `}
                >
                  {az}
                </button>
              ))
              : AVAILABILITY_ZONES.map((az) => (
                <button
                  key={az}
                  type="button"
                  onClick={() => setForm({ ...form, availabilityZone: az })}
                  className={`
                    px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                    ${form.availabilityZone === az
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                      : 'bg-[#1a1a1a] text-gray-500 hover:bg-[#1a1a1a]/80 hover:text-gray-300'
                    }
                  `}
                >
                  {az}
                </button>
              ))
            }
          </div>
        </div>
      )}

      {/* Subscription / Account */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-400">
            <Building2 className="w-4 h-4" /> {providerAccountLabel}
          </label>
        </div>

        {/* On-Demand gets the toggle between search and env+deployment */}
        {isOnDemand && (
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
              onClick={() => { setKnowsSubscription(false); setForm({ ...form, subscriptionId: '', accountName: '' }); setSubSearch(''); }}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                !knowsSubscription
                  ? 'bg-[#29B5E8]/20 text-[#29B5E8] border border-[#29B5E8]/30'
                  : 'bg-[#1a1a1a] text-gray-500 border border-transparent hover:text-gray-300'
              }`}
            >
              Find by Environment & Deployment
            </button>
          </div>
        )}

        {/* Subscription search (shown for all types when knowsSubscription is true, or for non-on-demand types) */}
        {(knowsSubscription || !isOnDemand) ? (
          <div className="space-y-3">
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
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {filteredSubs.map((sub) => {
                const isSelected = form.subscriptionId === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setForm({ ...form, subscriptionId: sub.id, accountName: sub.name })}
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
          /* Environment + Deployment (on-demand only, when knowsSubscription is false) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

      {/* Snowflake Target — on-demand only */}
      {isOnDemand && <SnowflakeTarget form={form} setForm={setForm} />}
    </div>
  );
}


function SnowflakeTarget({ form, setForm }: { form: RequestForm; setForm: (f: RequestForm) => void }) {
  const [open, setOpen] = useState(form.snowflakeDeployment !== '' || form.snowflakeCluster !== '');

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors group"
      >
        <Snowflake className="w-4 h-4 text-[#29B5E8]" />
        Snowflake Target
        <span className="text-[10px] text-gray-600 ml-1">optional</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-[#29B5E8]/20">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Snowflake Deployment</label>
            <input
              type="text"
              value={form.snowflakeDeployment}
              onChange={(e) => setForm({ ...form, snowflakeDeployment: e.target.value })}
              placeholder="e.g. us-west-2.aws"
              className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#29B5E8] focus:border-transparent transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Snowflake Cluster</label>
            <input
              type="text"
              value={form.snowflakeCluster}
              onChange={(e) => setForm({ ...form, snowflakeCluster: e.target.value })}
              placeholder="e.g. my-wh-cluster-01"
              className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#29B5E8] focus:border-transparent transition-all text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
