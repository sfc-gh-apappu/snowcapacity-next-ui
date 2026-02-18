'use client';

import { AlertCircle } from 'lucide-react';
import { RESOURCE_TYPES } from '../constants';
import type { QuotaPayload } from '../constants';

interface StepQuotaDetailsProps {
  payload: QuotaPayload;
  setPayload: (p: QuotaPayload) => void;
}

export default function StepQuotaDetails({ payload, setPayload }: StepQuotaDetailsProps) {
  const set = (patch: Partial<QuotaPayload>) => setPayload({ ...payload, ...patch });

  return (
    <div className="relative z-10 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-white">Quota Details</h2>
        <p className="text-gray-400 mt-1">Specify the quota increase you need</p>
      </div>

      {/* ── Required Fields ── */}
      <div className="space-y-5">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Required Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Resource / Instance Type</label>
            <select
              value={payload.resourceType}
              onChange={(e) => set({ resourceType: e.target.value })}
              className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none text-sm"
            >
              <option value="">Select resource type</option>
              {RESOURCE_TYPES.map(rt => <option key={rt} value={rt}>{rt}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Requested Limit</label>
            <input
              type="number"
              min="1"
              value={payload.requestedLimit}
              onChange={(e) => set({ requestedLimit: e.target.value })}
              placeholder="e.g. 500"
              className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Justification</label>
          <textarea
            rows={3}
            value={payload.justification}
            onChange={(e) => set({ justification: e.target.value })}
            placeholder="Explain why this quota increase is needed..."
            className="w-full px-4 py-3 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-sm"
          />
        </div>
      </div>

      {/* ── Optional Fields ── */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Optional Details</h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#1a1a1a] text-gray-500 border border-[#2a2a2a]">Optional</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Quota Name <span className="text-gray-600">(override)</span>
            </label>
            <input
              type="text"
              value={payload.quotaName}
              onChange={(e) => set({ quotaName: e.target.value })}
              placeholder="Leave blank to auto-derive"
              className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Tenant ID <span className="text-gray-600">(optional)</span>
            </label>
            <input
              type="text"
              value={payload.tenantId}
              onChange={(e) => set({ tenantId: e.target.value })}
              placeholder="e.g. d479c7c9-2632-..."
              className="w-full px-4 py-2.5 bg-black border border-[#1a1a1a] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm font-mono"
            />
          </div>
        </div>

        {/* Create support case toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
          <div>
            <p className="text-sm font-medium text-white">Create Support Case</p>
            <p className="text-xs text-gray-500 mt-0.5">Open a support case with the cloud provider alongside this request</p>
          </div>
          <button
            type="button"
            onClick={() => set({ createSupportCase: !payload.createSupportCase })}
            className={`relative w-12 h-7 rounded-full transition-all duration-300 flex-shrink-0 ${
              payload.createSupportCase ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30' : 'bg-[#2a2a2a]'
            }`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm ${payload.createSupportCase ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      </div>

      {/* Info hint */}
      <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
        <AlertCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-400">
          Quota adjustments are currently supported for <span className="text-white font-medium">Azure</span>. The service namespace will be automatically set to <code className="text-emerald-400 text-xs">Microsoft.Compute</code>.
        </p>
      </div>
    </div>
  );
}
