'use client';

import { Check, AlertTriangle } from 'lucide-react';
import { INSTANCE_TYPES, INSTANCE_PLATFORMS } from '../constants';
import type { CapacityBlockPayload } from '../constants';

interface StepCapacityBlockDetailsProps {
  payload: CapacityBlockPayload;
  setPayload: (p: CapacityBlockPayload) => void;
}

export default function StepCapacityBlockDetails({ payload, setPayload }: StepCapacityBlockDetailsProps) {
  const set = (patch: Partial<CapacityBlockPayload>) => setPayload({ ...payload, ...patch });

  return (
    <div className="relative z-10 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white">Capacity Block Configuration</h2>
        <p className="text-gray-400 mt-1">Configure the capacity block purchase details</p>
      </div>

      {/* ── Offering ── */}
      <div className="space-y-5">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Block Offering</h3>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Capacity Block Offering ID</label>
          <input
            type="text"
            value={payload.capacityBlockOfferingId}
            onChange={(e) => set({ capacityBlockOfferingId: e.target.value })}
            placeholder="e.g. cbo-0123456789abcdef0"
            className="w-full md:w-2/3 px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm font-mono"
          />
        </div>
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
              className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none text-sm"
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
              placeholder="e.g. 4"
              className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Instance Platform</label>
          <select
            value={payload.instancePlatform}
            onChange={(e) => set({ instancePlatform: e.target.value })}
            className="w-full md:w-1/2 px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all appearance-none text-sm"
          >
            <option value="">Select platform</option>
            {INSTANCE_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* ── Flags & Finance ── */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Execution & Finance</h3>

        {/* Dry Run toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
          <div>
            <p className="text-sm font-medium text-white">Dry Run</p>
            <p className="text-xs text-gray-500 mt-0.5">Validate the request without actually purchasing</p>
          </div>
          <button
            type="button"
            onClick={() => set({ dryRun: !payload.dryRun })}
            className={`relative w-12 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${
              payload.dryRun ? 'bg-gradient-to-r from-orange-500 to-amber-600 shadow-lg shadow-orange-500/30' : 'bg-[#2a2a2a]'
            }`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm ${payload.dryRun ? 'left-6' : 'left-1'}`} />
          </button>
        </div>

        {/* Finance fields (required for non-dry-run) */}
        {!payload.dryRun && (
          <div className="space-y-4 p-5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-4 h-4 text-orange-400" />
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Finance Approval Required</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Approved By</label>
                <input
                  type="text"
                  value={payload.approvedBy}
                  onChange={(e) => set({ approvedBy: e.target.value })}
                  placeholder="Approver's email"
                  className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Estimated Cost</label>
                <input
                  type="text"
                  value={payload.estimatedCost}
                  onChange={(e) => set({ estimatedCost: e.target.value })}
                  placeholder="e.g. $12,500"
                  className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Warning banner */}
      {!payload.dryRun && (
        <div className="flex items-start gap-3 bg-orange-500/5 border border-orange-500/20 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-400">
            This is a <span className="text-orange-400 font-medium">live purchase</span>. Finance approval and estimated cost are required. Enable <span className="text-white font-medium">Dry Run</span> to validate without purchasing.
          </p>
        </div>
      )}
    </div>
  );
}
