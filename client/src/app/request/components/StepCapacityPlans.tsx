'use client';

import { Plus, Trash2, ChevronDown, ChevronUp, Layers, HelpCircle, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import {
  INSTANCE_TYPES,
  AVAILABILITY_ZONES,
  createCapacityPlan,
  createRampUpPlan,
  createBackupPlan,
} from '../constants';
import type { CapacityPlanEntry, RampUpPlan, BackupPlan } from '../constants';

interface StepCapacityPlansProps {
  capacityPlans: CapacityPlanEntry[];
  setCapacityPlans: (plans: CapacityPlanEntry[]) => void;
  rampUpPlans: RampUpPlan[];
  setRampUpPlans: (plans: RampUpPlan[]) => void;
  backupPlans: BackupPlan[];
  setBackupPlans: (plans: BackupPlan[]) => void;
}

export default function StepCapacityPlans({
  capacityPlans,
  setCapacityPlans,
  rampUpPlans,
  setRampUpPlans,
  backupPlans,
  setBackupPlans,
}: StepCapacityPlansProps) {
  const hasAnyPlans = capacityPlans.length > 0 || rampUpPlans.length > 0 || backupPlans.length > 0;

  return (
    <div className="relative z-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Capacity Plans</h2>
          <p className="text-gray-400 mt-1">Configure capacity, ramp-up, and backup plans — or skip this step</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a]">
          Optional
        </span>
      </div>

      {/* Empty state */}
      {!hasAnyPlans && (
        <div className="flex flex-col items-center justify-center py-14 border-2 border-dashed border-[#1a1a1a] rounded-2xl">
          <div className="p-4 rounded-2xl bg-[#1a1a1a] mb-4">
            <Layers className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400 font-medium mb-1">No plans added yet</p>
          <p className="text-gray-600 text-sm mb-5">Start by adding a capacity plan, or skip and add later</p>
          <button
            type="button"
            onClick={() => setCapacityPlans([createCapacityPlan()])}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white hover:shadow-lg hover:shadow-[#29B5E8]/50 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Add Capacity Plan
          </button>
        </div>
      )}

      {/* Plan sections */}
      {hasAnyPlans && (
        <div className="space-y-8">
          {/* ── Capacity Plans ── */}
          <CapacityPlanSection plans={capacityPlans} setPlans={setCapacityPlans} />

          {/* ── Ramp Up Plans ── */}
          <RampUpPlanSection plans={rampUpPlans} setPlans={setRampUpPlans} />

          {/* ── Backup Capacity Plans ── */}
          <BackupPlanSection plans={backupPlans} setPlans={setBackupPlans} />
        </div>
      )}

      {/* Hint */}
      <div className="flex items-start gap-3 bg-[#1a1a1a]/50 border border-[#1a1a1a] rounded-xl p-4">
        <HelpCircle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-500">
          All plan types are optional at this stage. You can skip this step and configure plans after your request is approved.
        </p>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   Capacity Plans Section
   ═══════════════════════════════════════════════════════ */

function CapacityPlanSection({ plans, setPlans }: { plans: CapacityPlanEntry[]; setPlans: (p: CapacityPlanEntry[]) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#29B5E8] to-[#1E88B5]"><Zap className="w-3.5 h-3.5 text-white" /></div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Capacity Plans</h3>
          {plans.length > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#29B5E8]/20 text-[#29B5E8]">{plans.length}</span>}
        </div>
        <button
          type="button"
          onClick={() => setPlans([...plans, createCapacityPlan()])}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#29B5E8] hover:bg-[#29B5E8]/10 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {plans.length === 0 && (
        <p className="text-sm text-gray-600 italic">No capacity plans added yet.</p>
      )}

      <div className="space-y-3">
        {plans.map((plan, idx) => (
          <div key={plan.id} className="bg-black/50 rounded-2xl border border-[#1a1a1a] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#0a0a0a]/50">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#29B5E8]/20 text-[#29B5E8] text-xs flex items-center justify-center font-bold">{idx + 1}</span>
                <div>
                  <p className="text-sm font-medium text-white">
                    {plan.instanceType ? plan.instanceType : `Capacity Plan ${idx + 1}`}
                  </p>
                  {plan.isCollapsed && plan.instanceType && (
                    <p className="text-xs text-gray-500">{plan.availabilityZone || '—'} · Min {plan.minCount || '—'} / Max {plan.maxCount || '—'}{plan.date && ` · ${plan.date}`}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setPlans(plans.filter(p => p.id !== plan.id))} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => setPlans(plans.map(p => p.id === plan.id ? { ...p, isCollapsed: !p.isCollapsed } : p))} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-[#1a1a1a] transition-all">
                  {plan.isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            {/* Body */}
            {!plan.isCollapsed && (
              <div className="px-5 pb-5 pt-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Instance Type</label>
                    <select
                      value={plan.instanceType}
                      onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, instanceType: e.target.value } : p))}
                      className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#29B5E8] focus:border-transparent transition-all appearance-none text-sm"
                    >
                      <option value="">Select instance type</option>
                      {INSTANCE_TYPES.map(it => <option key={it} value={it}>{it}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Date</label>
                    <DatePicker
                      value={plan.date}
                      onChange={(val) => setPlans(plans.map(p => p.id === plan.id ? { ...p, date: val } : p))}
                      accentColor="#29B5E8"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Availability Zone</label>
                    <select
                      value={plan.availabilityZone}
                      onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, availabilityZone: e.target.value } : p))}
                      className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#29B5E8] focus:border-transparent transition-all appearance-none text-sm"
                    >
                      <option value="">Select AZ</option>
                      {AVAILABILITY_ZONES.map(az => <option key={az} value={az}>{az}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Minimum Count</label>
                    <input type="number" value={plan.minCount} onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, minCount: e.target.value } : p))} placeholder="e.g. 1" className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#29B5E8] focus:border-transparent transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Maximum Count</label>
                    <input type="number" value={plan.maxCount} onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, maxCount: e.target.value } : p))} placeholder="e.g. 10" className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#29B5E8] focus:border-transparent transition-all text-sm" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   Ramp Up Plans Section
   ═══════════════════════════════════════════════════════ */

function RampUpPlanSection({ plans, setPlans }: { plans: RampUpPlan[]; setPlans: (p: RampUpPlan[]) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600"><ArrowRight className="w-3.5 h-3.5 text-white" /></div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Ramp Up Plans</h3>
          {plans.length > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">{plans.length}</span>}
        </div>
        <button
          type="button"
          onClick={() => setPlans([...plans, createRampUpPlan()])}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {plans.length === 0 && (
        <p className="text-sm text-gray-600 italic">No ramp up plans added yet.</p>
      )}

      <div className="space-y-3">
        {plans.map((plan, idx) => (
          <div key={plan.id} className="bg-black/50 rounded-2xl border border-[#1a1a1a] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#0a0a0a]/50">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">{idx + 1}</span>
                <div>
                  <p className="text-sm font-medium text-white">Ramp Up {idx + 1}</p>
                  {plan.isCollapsed && plan.date && (
                    <p className="text-xs text-gray-500">{plan.date} · Min {plan.minCount || '—'} / Max {plan.maxCount || '—'}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setPlans(plans.filter(p => p.id !== plan.id))} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => setPlans(plans.map(p => p.id === plan.id ? { ...p, isCollapsed: !p.isCollapsed } : p))} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-[#1a1a1a] transition-all">
                  {plan.isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            {!plan.isCollapsed && (
              <div className="px-5 pb-5 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Date</label>
                    <DatePicker
                      value={plan.date}
                      onChange={(val) => setPlans(plans.map(p => p.id === plan.id ? { ...p, date: val } : p))}
                      accentColor="#10b981"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Minimum Count</label>
                    <input type="number" value={plan.minCount} onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, minCount: e.target.value } : p))} placeholder="e.g. 2" className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Maximum Count</label>
                    <input type="number" value={plan.maxCount} onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, maxCount: e.target.value } : p))} placeholder="e.g. 20" className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   Backup Capacity Plans Section
   ═══════════════════════════════════════════════════════ */

function BackupPlanSection({ plans, setPlans }: { plans: BackupPlan[]; setPlans: (p: BackupPlan[]) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-red-600"><ShieldCheck className="w-3.5 h-3.5 text-white" /></div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Backup Capacity Plans</h3>
          {plans.length > 0 && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/20 text-orange-400">{plans.length}</span>}
        </div>
        <button
          type="button"
          onClick={() => setPlans([...plans, createBackupPlan()])}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-orange-400 hover:bg-orange-500/10 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {plans.length === 0 && (
        <p className="text-sm text-gray-600 italic">No backup plans added yet.</p>
      )}

      <div className="space-y-3">
        {plans.map((plan, idx) => (
          <div key={plan.id} className="bg-black/50 rounded-2xl border border-[#1a1a1a] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#0a0a0a]/50">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 text-xs flex items-center justify-center font-bold">{idx + 1}</span>
                <div>
                  <p className="text-sm font-medium text-white">
                    {plan.instanceType ? `Backup — ${plan.instanceType}` : `Backup Plan ${idx + 1}`}
                  </p>
                  {plan.isCollapsed && (
                    <p className="text-xs text-gray-500">
                      {plan.sameAsPrimary ? 'Same settings as primary' : `${plan.availabilityZone || '—'} · Min ${plan.minCount || '—'} / Max ${plan.maxCount || '—'}`}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setPlans(plans.filter(p => p.id !== plan.id))} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => setPlans(plans.map(p => p.id === plan.id ? { ...p, isCollapsed: !p.isCollapsed } : p))} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-[#1a1a1a] transition-all">
                  {plan.isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            {!plan.isCollapsed && (
              <div className="px-5 pb-5 pt-2 space-y-4">
                {/* Instance Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Instance Type</label>
                  <select
                    value={plan.instanceType}
                    onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, instanceType: e.target.value } : p))}
                    className="w-full md:w-1/2 px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none text-sm"
                  >
                    <option value="">Select instance type</option>
                    {INSTANCE_TYPES.map(it => <option key={it} value={it}>{it}</option>)}
                  </select>
                </div>

                {/* Same as primary toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
                  <div>
                    <p className="text-sm font-medium text-white">Same settings as primary plan?</p>
                    <p className="text-xs text-gray-500 mt-0.5">Use the same date, AZ, and min/max from your primary capacity plan</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPlans(plans.map(p => p.id === plan.id ? { ...p, sameAsPrimary: !p.sameAsPrimary } : p))}
                    className={`relative w-12 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${
                      plan.sameAsPrimary ? 'bg-gradient-to-r from-orange-500 to-red-600 shadow-lg shadow-orange-500/30' : 'bg-[#2a2a2a]'
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm ${plan.sameAsPrimary ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                {/* Conditional fields if NOT same as primary */}
                {!plan.sameAsPrimary && (
                  <div className="space-y-4 pl-0 border-l-2 border-orange-500/20 ml-0 md:pl-4 md:ml-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Date</label>
                        <DatePicker
                          value={plan.date}
                          onChange={(val) => setPlans(plans.map(p => p.id === plan.id ? { ...p, date: val } : p))}
                          accentColor="#f97316"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Availability Zone</label>
                        <select
                          value={plan.availabilityZone}
                          onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, availabilityZone: e.target.value } : p))}
                          className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none text-sm"
                        >
                          <option value="">Select AZ</option>
                          {AVAILABILITY_ZONES.map(az => <option key={az} value={az}>{az}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Minimum Count</label>
                        <input type="number" value={plan.minCount} onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, minCount: e.target.value } : p))} placeholder="e.g. 1" className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Maximum Count</label>
                        <input type="number" value={plan.maxCount} onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? { ...p, maxCount: e.target.value } : p))} placeholder="e.g. 5" className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
