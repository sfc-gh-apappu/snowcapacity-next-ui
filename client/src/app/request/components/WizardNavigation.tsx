'use client';

import { ChevronLeft, ArrowRight, Send } from 'lucide-react';

interface WizardNavigationProps {
  step: number;
  setStep: (step: number) => void;
  canProceedStep1: boolean;
  canProceedStep2: boolean;
  totalSteps?: number;
  step3Skippable?: boolean;
}

export default function WizardNavigation({
  step,
  setStep,
  canProceedStep1,
  canProceedStep2,
  totalSteps = 4,
  step3Skippable = false,
}: WizardNavigationProps) {
  const isDisabled =
    (step === 1 && !canProceedStep1) ||
    (step === 2 && !canProceedStep2);

  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={() => setStep(step - 1)}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
          step === 1
            ? 'opacity-0 pointer-events-none'
            : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#1a1a1a]/80'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex items-center gap-3">
        {step === 3 && step3Skippable && (
          <button
            type="button"
            onClick={() => setStep(4)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1a]/80 bg-[#1a1a1a] transition-all duration-300"
          >
            Skip
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
        {step < totalSteps ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={isDisabled}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              isDisabled
                ? 'bg-[#1a1a1a] text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white hover:shadow-lg hover:shadow-[#29B5E8]/50'
            }`}
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-[#29B5E8] to-[#1E88B5] text-white hover:shadow-lg hover:shadow-[#29B5E8]/50 transition-all duration-300"
          >
            <Send className="w-4 h-4" />
            Submit Request
          </button>
        )}
      </div>
    </div>
  );
}
