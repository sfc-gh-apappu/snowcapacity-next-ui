'use client';

import { useState } from 'react';
import type { RequestForm, CapacityPlanEntry, RampUpPlan, BackupPlan } from '../constants';
import ProgressBar from './ProgressBar';
import StepWhatWho from './StepWhatWho';
import StepWhere from './StepWhere';
import StepCapacityPlans from './StepCapacityPlans';
import StepReview from './StepReview';
import WizardNavigation from './WizardNavigation';

export default function CreateRequestTab() {
  const [step, setStep] = useState(1);
  const [knowsSubscription, setKnowsSubscription] = useState(true);
  const [subSearch, setSubSearch] = useState('');
  const [capacityPlans, setCapacityPlans] = useState<CapacityPlanEntry[]>([]);
  const [rampUpPlans, setRampUpPlans] = useState<RampUpPlan[]>([]);
  const [backupPlans, setBackupPlans] = useState<BackupPlan[]>([]);
  const [form, setForm] = useState<RequestForm>({
    requestType: '',
    team: '',
    cloudProvider: '',
    region: '',
    subscriptionId: '',
    environment: '',
    deployment: '',
    financeApproval: false,
    notes: '',
  });

  // Validation
  const canProceedStep1 = form.requestType !== '' && form.team !== '' && form.cloudProvider !== '';
  const canProceedStep2 = form.region !== '' && (
    knowsSubscription ? form.subscriptionId !== '' : (form.environment !== '' && form.deployment !== '')
  );

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <ProgressBar currentStep={step} />

      {/* Step Content */}
      <div className="relative bg-[#0a0a0a] rounded-2xl p-8 border border-[#1a1a1a] overflow-hidden min-h-[460px]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#29B5E8] opacity-5 blur-3xl rounded-full pointer-events-none" />

        {step === 1 && <StepWhatWho form={form} setForm={setForm} />}

        {step === 2 && (
          <StepWhere
            form={form}
            setForm={setForm}
            knowsSubscription={knowsSubscription}
            setKnowsSubscription={setKnowsSubscription}
            subSearch={subSearch}
            setSubSearch={setSubSearch}
          />
        )}

        {step === 3 && (
          <StepCapacityPlans
            capacityPlans={capacityPlans}
            setCapacityPlans={setCapacityPlans}
            rampUpPlans={rampUpPlans}
            setRampUpPlans={setRampUpPlans}
            backupPlans={backupPlans}
            setBackupPlans={setBackupPlans}
          />
        )}

        {step === 4 && (
          <StepReview
            form={form}
            setForm={setForm}
            knowsSubscription={knowsSubscription}
            capacityPlans={capacityPlans}
            rampUpPlans={rampUpPlans}
            backupPlans={backupPlans}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <WizardNavigation
        step={step}
        setStep={setStep}
        canProceedStep1={canProceedStep1}
        canProceedStep2={canProceedStep2}
      />
    </div>
  );
}
