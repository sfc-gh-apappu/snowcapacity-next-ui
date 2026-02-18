'use client';

import { Check } from 'lucide-react';
import { WIZARD_STEPS, getWizardSteps } from '../constants';

interface ProgressBarProps {
  currentStep: number;
  requestType?: string;
}

export default function ProgressBar({ currentStep, requestType }: ProgressBarProps) {
  const steps = requestType ? getWizardSteps(requestType) : WIZARD_STEPS;

  return (
    <div className="relative bg-[#0a0a0a] rounded-2xl p-6 border border-[#1a1a1a]">
      <div className="flex items-center justify-between">
        {steps.map((s, index) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex items-center gap-3">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
                ${currentStep > s.id
                  ? 'bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white shadow-lg shadow-[#29B5E8]/30'
                  : currentStep === s.id
                  ? 'bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white shadow-lg shadow-[#29B5E8]/30 ring-4 ring-[#29B5E8]/20'
                  : 'bg-[#1a1a1a] text-gray-500'
                }
              `}>
                {currentStep > s.id ? <Check className="w-5 h-5" /> : s.id}
              </div>
              <div className="hidden sm:block">
                <p className={`text-sm font-medium ${currentStep >= s.id ? 'text-white' : 'text-gray-500'}`}>{s.label}</p>
                <p className="text-xs text-gray-600">{s.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div className="h-[2px] bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] transition-all duration-500"
                    style={{ width: currentStep > s.id ? '100%' : '0%' }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
