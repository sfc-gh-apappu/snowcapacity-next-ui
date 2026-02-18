'use client';

import { Check } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import {
  INSTANCE_TYPES,
  INSTANCE_PLATFORMS,
  INSTANCE_MATCH_CRITERIA,
  DELIVERY_PREFERENCES,
} from '../constants';
import type { ReservationPayload } from '../constants';

interface StepReservationDetailsProps {
  payload: ReservationPayload;
  setPayload: (p: ReservationPayload) => void;
}

export default function StepReservationDetails({ payload, setPayload }: StepReservationDetailsProps) {
  const set = (patch: Partial<ReservationPayload>) => setPayload({ ...payload, ...patch });

  return (
    <div className="relative z-10 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white">Instance & Commitment</h2>
        <p className="text-gray-400 mt-1">Configure instance details, usage flags, and commitment</p>
      </div>

      {/* ── Instance Configuration ── */}
      <div className="space-y-5">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Instance Configuration</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Instance Type</label>
            <select
              value={payload.instanceType}
              onChange={(e) => set({ instanceType: e.target.value })}
              className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none text-sm"
            >
              <option value="">Select instance type</option>
              {INSTANCE_TYPES.map(it => <option key={it} value={it}>{it}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Instance Count</label>
            <input
              type="number"
              min="1"
              value={payload.instanceCount}
              onChange={(e) => set({ instanceCount: e.target.value })}
              placeholder="e.g. 10"
              className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Instance Platform</label>
          <select
            value={payload.instancePlatform}
            onChange={(e) => set({ instancePlatform: e.target.value })}
            className="w-full md:w-1/2 px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all appearance-none text-sm"
          >
            <option value="">Select platform</option>
            {INSTANCE_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Instance Match Criteria — card select */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Instance Match Criteria</label>
          <div className="grid grid-cols-2 gap-3">
            {INSTANCE_MATCH_CRITERIA.map((mc) => {
              const isSelected = payload.instanceMatchCriteria === mc.id;
              return (
                <button
                  key={mc.id}
                  type="button"
                  onClick={() => set({ instanceMatchCriteria: mc.id })}
                  className={`
                    relative text-left p-4 rounded-xl border-2 transition-all duration-300
                    ${isSelected
                      ? 'border-violet-500 bg-violet-500/5 shadow-lg shadow-violet-500/10'
                      : 'border-[#1a1a1a] bg-black/50 hover:border-[#2a2a2a]'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                  <p className="text-sm font-semibold text-white">{mc.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{mc.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Usage Flags ── */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Usage Flags</h3>

        <ToggleRow
          label="Immediate Use"
          description="Launch instances as soon as capacity is available"
          value={payload.immediateUse}
          onChange={(v) => set({ immediateUse: v })}
        />
        <ToggleRow
          label="Unlimited Use"
          description="No end date — reservation runs indefinitely"
          value={payload.unlimitedUse}
          onChange={(v) => set({ unlimitedUse: v })}
        />
      </div>

      {/* ── Delivery Preference ── */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Delivery Preference</h3>
        <div className="grid grid-cols-2 gap-3">
          {DELIVERY_PREFERENCES.map((dp) => {
            const isSelected = payload.deliveryPreference === dp.id;
            return (
              <button
                key={dp.id}
                type="button"
                onClick={() => set({ deliveryPreference: dp.id })}
                className={`
                  relative text-left p-4 rounded-xl border-2 transition-all duration-300
                  ${isSelected
                    ? 'border-violet-500 bg-violet-500/5 shadow-lg shadow-violet-500/10'
                    : 'border-[#1a1a1a] bg-black/50 hover:border-[#2a2a2a]'
                  }
                `}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
                <p className="text-sm font-semibold text-white">{dp.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{dp.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Commitment & Dates ── */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Commitment & Dates</h3>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Commitment Duration (hours)</label>
          <input
            type="number"
            min="0"
            value={payload.commitmentDuration}
            onChange={(e) => set({ commitmentDuration: e.target.value })}
            placeholder="e.g. 720 (0 for no commitment)"
            className="w-full md:w-1/2 px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Start Date <span className="text-gray-600">(optional)</span>
            </label>
            <DatePicker
              value={payload.startDate}
              onChange={(val) => set({ startDate: val })}
              accentColor="#8b5cf6"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              End Date <span className="text-gray-600">(optional)</span>
            </label>
            <DatePicker
              value={payload.endDate}
              onChange={(val) => set({ endDate: val })}
              accentColor="#8b5cf6"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Toggle helper ─── */

function ToggleRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-12 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${
          value ? 'bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30' : 'bg-[#2a2a2a]'
        }`}
      >
        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm ${value ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}
