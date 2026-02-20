'use client';

import { useState } from 'react';
import type {
  RequestForm,
  CapacityPlanEntry,
  BackupPlan,
  ReservationPayload,
  QuotaPayload,
  CapacityBlockPayload,
} from '../constants';
import {
  INITIAL_FORM,
  createReservationPayload,
  createQuotaPayload,
  createCapacityBlockPayload,
} from '../constants';
import ProgressBar from './ProgressBar';
import StepWhatWho from './StepWhatWho';
import StepWhere from './StepWhere';
import StepCapacityPlans from './StepCapacityPlans';
import StepReservationDetails from './StepReservationDetails';
import StepQuotaDetails from './StepQuotaDetails';
import StepCapacityBlockDetails from './StepCapacityBlockDetails';
import StepReview from './StepReview';
import WizardNavigation from './WizardNavigation';

export default function CreateRequestTab({ initialType = '' }: { initialType?: string }) {
  const [step, setStep] = useState(1);
  const [knowsSubscription, setKnowsSubscription] = useState(true);
  const [subSearch, setSubSearch] = useState('');

  // Shared envelope form
  const [form, setForm] = useState<RequestForm>({
    ...INITIAL_FORM,
    ...(initialType ? { requestType: initialType } : {}),
  });

  // On-demand capacity plans
  const [capacityPlans, setCapacityPlans] = useState<CapacityPlanEntry[]>([]);
  const [backupPlans, setBackupPlans] = useState<BackupPlan[]>([]);

  // Type-specific payloads
  const [reservationPayload, setReservationPayload] = useState<ReservationPayload>(createReservationPayload());
  const [quotaPayload, setQuotaPayload] = useState<QuotaPayload>(createQuotaPayload());
  const [capacityBlockPayload, setCapacityBlockPayload] = useState<CapacityBlockPayload>(createCapacityBlockPayload());

  // ── Validation ──
  const isOnDemand = form.requestType === 'ONDEMAND_CREATE';
  const isReservation = form.requestType === 'RESERVATION_CREATE';
  const isQuota = form.requestType === 'QUOTA_CREATE';

  const canProceedStep1 = form.requestType !== '' && form.cloudProvider !== '' && (isOnDemand ? form.team !== '' : true);

  const canProceedStep2 = form.region !== '' && (
    isOnDemand
      ? (knowsSubscription ? form.subscriptionId !== '' : (form.environment !== '' && form.deployment !== ''))
      : isReservation
      ? form.subscriptionId !== '' && form.availabilityZone !== ''
      : form.subscriptionId !== ''
  );

  // Step 3 is always skippable for on-demand (capacity plans are optional)
  // but required fields exist for other types
  const step3Skippable = isOnDemand;

  return (
    <div className="space-y-6">
      <ProgressBar currentStep={step} requestType={form.requestType} />

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

        {step === 3 && isOnDemand && (
          <StepCapacityPlans
            capacityPlans={capacityPlans}
            setCapacityPlans={setCapacityPlans}
            backupPlans={backupPlans}
            setBackupPlans={setBackupPlans}
          />
        )}

        {step === 3 && isReservation && (
          <StepReservationDetails
            payload={reservationPayload}
            setPayload={setReservationPayload}
          />
        )}

        {step === 3 && isQuota && (
          <StepQuotaDetails
            payload={quotaPayload}
            setPayload={setQuotaPayload}
          />
        )}

        {step === 3 && form.requestType === 'CAPACITY_BLOCK_CREATE' && (
          <StepCapacityBlockDetails
            payload={capacityBlockPayload}
            setPayload={setCapacityBlockPayload}
          />
        )}

        {step === 4 && (
          <StepReview
            form={form}
            setForm={setForm}
            knowsSubscription={knowsSubscription}
            capacityPlans={capacityPlans}
            backupPlans={backupPlans}
            reservationPayload={reservationPayload}
            quotaPayload={quotaPayload}
            capacityBlockPayload={capacityBlockPayload}
          />
        )}
      </div>

      <WizardNavigation
        step={step}
        setStep={setStep}
        canProceedStep1={canProceedStep1}
        canProceedStep2={canProceedStep2}
        step3Skippable={step3Skippable}
      />
    </div>
  );
}
