'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, MessageSquare, AlertTriangle, Zap, ArrowRight, Gauge, Cpu } from 'lucide-react';
import {
  REQUEST_TYPES,
  CLOUD_PROVIDERS,
  SAMPLE_SUBSCRIPTIONS,
  INSTANCE_MATCH_CRITERIA,
  DELIVERY_PREFERENCES,
  getProviderAccountLabel,
} from '../constants';
import type {
  RequestForm,
  CapacityPlanEntry,
  BackupPlan,
  ReservationPayload,
  QuotaPayload,
  CapacityBlockPayload,
} from '../constants';

interface StepReviewProps {
  form: RequestForm;
  setForm: (form: RequestForm) => void;
  knowsSubscription: boolean;
  capacityPlans: CapacityPlanEntry[];
  backupPlans: BackupPlan[];
  reservationPayload: ReservationPayload;
  quotaPayload: QuotaPayload;
  capacityBlockPayload: CapacityBlockPayload;
}

export default function StepReview({
  form,
  setForm,
  knowsSubscription,
  capacityPlans,
  backupPlans,
  reservationPayload,
  quotaPayload,
  capacityBlockPayload,
}: StepReviewProps) {
  const selectedRequestType = REQUEST_TYPES.find(r => r.id === form.requestType);
  const selectedCloud = CLOUD_PROVIDERS.find(c => c.id === form.cloudProvider);
  const subscriptions = form.cloudProvider ? SAMPLE_SUBSCRIPTIONS[form.cloudProvider] || [] : [];
  const selectedSub = subscriptions.find(s => s.id === form.subscriptionId);
  const providerAccountLabel = getProviderAccountLabel(form.cloudProvider);

  const isOnDemand = form.requestType === 'ONDEMAND_CREATE';
  const isReservation = form.requestType === 'RESERVATION_CREATE';
  const isQuota = form.requestType === 'QUOTA_CREATE';
  const isCapacityBlock = form.requestType === 'CAPACITY_BLOCK_CREATE';
  const hasPlans = capacityPlans.length > 0 || backupPlans.length > 0;

  return (
    <div className="relative z-10 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Review & Submit</h2>
        <p className="text-gray-400 mt-1">Double-check everything before sending your request</p>
      </div>

      {/* Summary Card */}
      <div className="bg-black/50 rounded-2xl border border-[#1a1a1a] p-6 space-y-5">

        {/* Section 1: What & Who */}
        <SectionHeader num={1} title="What & Who" />
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
          {isOnDemand && <ReviewField label="Team" value={form.team} />}
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
        <SectionHeader num={2} title="Where" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ReviewField label="Region" value={form.region} />
          {isReservation && form.availabilityZone && (
            <ReviewField label="Availability Zone" value={form.availabilityZone} />
          )}
          {(knowsSubscription || !isOnDemand) ? (
            <ReviewField
              label={providerAccountLabel}
              value={
                <span>
                  <span className="block">{selectedSub?.name || form.accountName || '—'}</span>
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
          {form.snowflakeDeployment && (
            <ReviewField label="Snowflake Deployment" value={form.snowflakeDeployment} />
          )}
          {form.snowflakeCluster && (
            <ReviewField label="Snowflake Cluster" value={form.snowflakeCluster} />
          )}
        </div>

        {/* Section 3: Type-specific details */}
        <div className="h-px bg-[#1a1a1a]" />
        <SectionHeader num={3} title={isOnDemand ? 'Capacity Plans' : isReservation ? 'Instance & Commitment' : isQuota ? 'Quota Details' : 'Block Configuration'} />

        {/* On-Demand: Capacity Plans */}
        {isOnDemand && hasPlans && (
          <div className="space-y-4">
            {capacityPlans.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Capacity Plans</p>
                {capacityPlans.map((p, i) => (
                  <div key={p.id} className="space-y-1">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#29B5E8] to-[#1E88B5]"><Zap className="w-3 h-3 text-white" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{p.instanceType || `Plan ${i + 1}`}</p>
                        <p className="text-xs text-gray-500">{p.availabilityZone || '—'} · Min {p.minCount || '—'} / Max {p.maxCount || '—'}{p.date ? ` · ${p.date}` : ''}</p>
                      </div>
                    </div>
                    {p.rampUpStages.length > 0 && (
                      <div className="ml-8 space-y-1">
                        {p.rampUpStages.map((s, sIdx) => (
                          <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0a0a0a]/60 border border-emerald-500/10">
                            <div className="p-1 rounded-md bg-emerald-500/20"><ArrowRight className="w-2.5 h-2.5 text-emerald-400" /></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-emerald-400">Stage {sIdx + 1}</p>
                              <p className="text-[11px] text-gray-500">{s.date || '—'} · Min {s.minCount || '—'} / Max {s.maxCount || '—'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {backupPlans.length > 0 && (
              <PlanList
                title="Backup Capacity Plans"
                icon={<ShieldCheck className="w-3 h-3 text-white" />}
                iconBg="from-orange-500 to-red-600"
                items={backupPlans.map((p, i) => ({
                  label: p.instanceType ? `Backup — ${p.instanceType}` : `Backup ${i + 1}`,
                  detail: p.sameAsPrimary ? 'Same settings as primary plan' : `${p.availabilityZone || '—'} · Min ${p.minCount || '—'} / Max ${p.maxCount || '—'}`,
                  badge: p.sameAsPrimary ? 'Mirrors primary' : undefined,
                }))}
              />
            )}
          </div>
        )}
        {isOnDemand && !hasPlans && (
          <p className="text-sm text-gray-500 italic">No capacity plans added (skipped)</p>
        )}

        {/* Reservation review */}
        {isReservation && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ReviewField label="Instance Type" value={reservationPayload.instanceType || '—'} />
            <ReviewField label="Instance Count" value={reservationPayload.instanceCount || '—'} />
            <ReviewField label="Instance Platform" value={reservationPayload.instancePlatform || '—'} />
            <ReviewField label="Match Criteria" value={INSTANCE_MATCH_CRITERIA.find(m => m.id === reservationPayload.instanceMatchCriteria)?.label || '—'} />
            <ReviewField label="Immediate Use" value={reservationPayload.immediateUse ? 'Yes' : 'No'} />
            <ReviewField label="Unlimited Use" value={reservationPayload.unlimitedUse ? 'Yes' : 'No'} />
            <ReviewField label="Delivery Preference" value={DELIVERY_PREFERENCES.find(d => d.id === reservationPayload.deliveryPreference)?.label || '—'} />
            <ReviewField label="Commitment Duration" value={reservationPayload.commitmentDuration ? `${reservationPayload.commitmentDuration} hours` : '—'} />
            {reservationPayload.startDate && <ReviewField label="Start Date" value={reservationPayload.startDate} />}
            {reservationPayload.endDate && <ReviewField label="End Date" value={reservationPayload.endDate} />}
          </div>
        )}

        {/* Quota review */}
        {isQuota && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ReviewField label="Resource Type" value={quotaPayload.resourceType || '—'} />
            <ReviewField label="Requested Limit" value={quotaPayload.requestedLimit || '—'} />
            <div className="md:col-span-2">
              <ReviewField label="Justification" value={quotaPayload.justification || '—'} />
            </div>
            {quotaPayload.quotaName && <ReviewField label="Quota Name" value={quotaPayload.quotaName} />}
            {quotaPayload.tenantId && <ReviewField label="Tenant ID" value={<span className="font-mono text-sm">{quotaPayload.tenantId}</span>} />}
            <ReviewField label="Create Support Case" value={quotaPayload.createSupportCase ? 'Yes' : 'No'} />
          </div>
        )}

        {/* Capacity Block review */}
        {isCapacityBlock && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <ReviewField label="Offering ID" value={<span className="font-mono text-sm">{capacityBlockPayload.capacityBlockOfferingId || '—'}</span>} />
            </div>
            <ReviewField label="Instance Type" value={capacityBlockPayload.instanceType || '—'} />
            <ReviewField label="Instance Count" value={capacityBlockPayload.instanceCount || '—'} />
            <ReviewField label="Instance Platform" value={capacityBlockPayload.instancePlatform || '—'} />
            <ReviewField label="Dry Run" value={capacityBlockPayload.dryRun ? 'Yes' : 'No'} />
            {!capacityBlockPayload.dryRun && (
              <>
                <ReviewField label="Approved By" value={capacityBlockPayload.approvedBy || '—'} />
                <ReviewField label="Estimated Cost" value={capacityBlockPayload.estimatedCost || '—'} />
              </>
            )}
          </div>
        )}
      </div>

      {/* Finance Approval (shared — relevant for on-demand, capacity block non-dry-run) */}
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

/* ─── Helpers ─── */

function SectionHeader({ num, title }: { num: number; title: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wider">
      <span className="w-5 h-5 rounded-full bg-[#29B5E8]/20 text-[#29B5E8] text-[10px] flex items-center justify-center font-bold">{num}</span>
      {title}
    </div>
  );
}

function ReviewField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <div className="text-white font-medium">{value}</div>
    </div>
  );
}

function PlanList({
  title,
  icon,
  iconBg,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  items: { label: string; detail: string; badge?: string }[];
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">{title}</p>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${iconBg}`}>{icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{item.label}</p>
            <p className="text-xs text-gray-500">{item.detail}</p>
          </div>
          {item.badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20 flex-shrink-0">{item.badge}</span>
          )}
        </div>
      ))}
    </div>
  );
}
