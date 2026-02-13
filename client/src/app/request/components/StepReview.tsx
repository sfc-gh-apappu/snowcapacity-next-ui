'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, MessageSquare, AlertTriangle, Zap, ArrowRight } from 'lucide-react';
import {
  REQUEST_TYPES,
  CLOUD_PROVIDERS,
  SAMPLE_SUBSCRIPTIONS,
  getProviderAccountLabel,
} from '../constants';
import type { RequestForm, CapacityPlanEntry, RampUpPlan, BackupPlan } from '../constants';

interface StepReviewProps {
  form: RequestForm;
  setForm: (form: RequestForm) => void;
  knowsSubscription: boolean;
  capacityPlans: CapacityPlanEntry[];
  rampUpPlans: RampUpPlan[];
  backupPlans: BackupPlan[];
}

export default function StepReview({
  form,
  setForm,
  knowsSubscription,
  capacityPlans,
  rampUpPlans,
  backupPlans,
}: StepReviewProps) {
  const selectedRequestType = REQUEST_TYPES.find(r => r.id === form.requestType);
  const selectedCloud = CLOUD_PROVIDERS.find(c => c.id === form.cloudProvider);
  const subscriptions = form.cloudProvider ? SAMPLE_SUBSCRIPTIONS[form.cloudProvider] || [] : [];
  const selectedSub = subscriptions.find(s => s.id === form.subscriptionId);
  const providerAccountLabel = getProviderAccountLabel(form.cloudProvider);
  const hasPlans = capacityPlans.length > 0 || rampUpPlans.length > 0 || backupPlans.length > 0;

  return (
    <div className="relative z-10 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Review & Submit</h2>
        <p className="text-gray-400 mt-1">Double-check everything before sending your request</p>
      </div>

      {/* Summary Card */}
      <div className="bg-black/50 rounded-2xl border border-[#1a1a1a] p-6 space-y-5">

        {/* Section 1: What & Who */}
        <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider">
          <span className="w-5 h-5 rounded-full bg-[#29B5E8]/20 text-[#29B5E8] text-[10px] flex items-center justify-center font-bold">1</span>
          What & Who
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <ReviewField
            label="Request Type"
            value={
              <span className="flex items-center gap-2">
                {selectedRequestType && (
                  <span className={`inline-flex p-1.5 rounded-lg bg-gradient-to-br ${selectedRequestType.color}`}>
                    <selectedRequestType.icon className="w-3.5 h-3.5 text-white" />
                  </span>
                )}
                {selectedRequestType?.label}
              </span>
            }
          />
          <ReviewField label="Team" value={form.team} />
          <ReviewField
            label="Cloud Provider"
            value={
              <span className="flex items-center gap-2">
                {selectedCloud && <Image src={selectedCloud.logo} alt={selectedCloud.label} width={24} height={24} className="object-contain" />}
                {selectedCloud?.label}
              </span>
            }
          />
        </div>

        <div className="h-px bg-[#1a1a1a]" />

        {/* Section 2: Where */}
        <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider">
          <span className="w-5 h-5 rounded-full bg-[#29B5E8]/20 text-[#29B5E8] text-[10px] flex items-center justify-center font-bold">2</span>
          Where
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ReviewField label="Region" value={form.region} />
          {knowsSubscription ? (
            <ReviewField
              label={providerAccountLabel}
              value={
                <span>
                  <span className="block">{selectedSub?.name || '—'}</span>
                  <span className="text-xs text-gray-500 font-mono">{form.subscriptionId}</span>
                </span>
              }
            />
          ) : (
            <>
              <ReviewField label="Environment" value={form.environment} />
              <ReviewField label="Deployment" value={form.deployment} />
            </>
          )}
        </div>

        {/* Section 3: Capacity Plans */}
        {hasPlans && (
          <>
            <div className="h-px bg-[#1a1a1a]" />
            <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#29B5E8]/20 text-[#29B5E8] text-[10px] flex items-center justify-center font-bold">3</span>
              Plans
            </div>

            {/* Capacity Plans */}
            {capacityPlans.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Capacity Plans</p>
                {capacityPlans.map((plan, idx) => (
                  <div key={plan.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#29B5E8] to-[#1E88B5]"><Zap className="w-3 h-3 text-white" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{plan.instanceType || `Plan ${idx + 1}`}</p>
                      <p className="text-xs text-gray-500">{plan.availabilityZone || '—'} · Min {plan.minCount || '—'} / Max {plan.maxCount || '—'}{plan.date && ` · ${plan.date}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Ramp Up Plans */}
            {rampUpPlans.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Ramp Up Plans</p>
                {rampUpPlans.map((plan, idx) => (
                  <div key={plan.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600"><ArrowRight className="w-3 h-3 text-white" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">Ramp Up {idx + 1}</p>
                      <p className="text-xs text-gray-500">{plan.date || '—'} · Min {plan.minCount || '—'} / Max {plan.maxCount || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Backup Plans */}
            {backupPlans.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Backup Capacity Plans</p>
                {backupPlans.map((plan, idx) => (
                  <div key={plan.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-red-600"><ShieldCheck className="w-3 h-3 text-white" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{plan.instanceType ? `Backup — ${plan.instanceType}` : `Backup ${idx + 1}`}</p>
                      <p className="text-xs text-gray-500">
                        {plan.sameAsPrimary ? 'Same settings as primary plan' : `${plan.availabilityZone || '—'} · Min ${plan.minCount || '—'} / Max ${plan.maxCount || '—'}${plan.date ? ` · ${plan.date}` : ''}`}
                      </p>
                    </div>
                    {plan.sameAsPrimary && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20 flex-shrink-0">Mirrors primary</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Finance Approval */}
      <div className="bg-black/50 rounded-2xl border border-[#1a1a1a] p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Finance Approval</p>
              <p className="text-xs text-gray-500 mt-0.5">Confirm this request has finance team sign-off</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setForm({ ...form, financeApproval: !form.financeApproval })}
            className={`
              relative w-12 h-7 rounded-full transition-all duration-300
              ${form.financeApproval
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30'
                : 'bg-[#1a1a1a]'
              }
            `}
          >
            <div className={`
              absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm
              ${form.financeApproval ? 'left-6' : 'left-1'}
            `} />
          </button>
        </div>

        {/* Notes */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
            <MessageSquare className="w-4 h-4" /> Notes <span className="text-gray-600">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Add any additional context, justification, or special instructions..."
            className="w-full px-4 py-3 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#29B5E8] focus:border-transparent transition-all resize-none"
          />
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 bg-[#29B5E8]/5 border border-[#29B5E8]/20 rounded-xl p-4">
        <AlertTriangle className="w-5 h-5 text-[#29B5E8] mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-400">
          Once submitted, your request will be reviewed by the capacity team. Track progress in the <span className="text-white font-medium">My Requests</span> tab.
        </p>
      </div>
    </div>
  );
}

/* ─── Review field helper ─── */
function ReviewField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <div className="text-white font-medium">{value}</div>
    </div>
  );
}
