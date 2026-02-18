import { Server, ShieldCheck, Gauge, Cpu } from 'lucide-react';

/* ─── Wizard Steps ─── */

export const WIZARD_STEPS = [
  { id: 1, label: 'What & Who', description: 'Type, team & provider' },
  { id: 2, label: 'Where', description: 'Region & infrastructure' },
  { id: 3, label: 'Details', description: 'Request-specific details' },
  { id: 4, label: 'Review & Submit', description: 'Confirm & send' },
];

const STEP3_BY_TYPE: Record<string, { label: string; description: string }> = {
  ONDEMAND_CREATE: { label: 'Capacity Plans', description: 'Configure capacity plans' },
  RESERVATION_CREATE: { label: 'Instance & Commitment', description: 'Instance config & usage' },
  QUOTA_CREATE: { label: 'Quota Details', description: 'Quota adjustment details' },
  CAPACITY_BLOCK_CREATE: { label: 'Block Config', description: 'Capacity block setup' },
};

export function getWizardSteps(requestType: string) {
  const step3 = STEP3_BY_TYPE[requestType] || WIZARD_STEPS[2];
  return [
    WIZARD_STEPS[0],
    WIZARD_STEPS[1],
    { id: 3, label: step3.label, description: step3.description },
    WIZARD_STEPS[3],
  ];
}

/* ─── Request Types (matching backend WorkerJobType) ─── */

export const REQUEST_TYPES = [
  { id: 'ONDEMAND_CREATE', label: 'On-Demand Capacity', description: 'Request on-demand compute capacity', icon: Server, color: 'from-[#29B5E8] to-[#1E88B5]', border: 'border-[#29B5E8]', glow: 'shadow-[#29B5E8]/30' },
  { id: 'RESERVATION_CREATE', label: 'Capacity Reservation', description: 'Reserve dedicated capacity long-term', icon: ShieldCheck, color: 'from-violet-500 to-purple-600', border: 'border-violet-500', glow: 'shadow-violet-500/30' },
  { id: 'QUOTA_CREATE', label: 'Quota Adjustment', description: 'Request a cloud quota increase', icon: Gauge, color: 'from-emerald-500 to-teal-600', border: 'border-emerald-500', glow: 'shadow-emerald-500/30' },
  { id: 'CAPACITY_BLOCK_CREATE', label: 'Capacity Block', description: 'Purchase reserved capacity blocks', icon: Cpu, color: 'from-orange-500 to-amber-600', border: 'border-orange-500', glow: 'shadow-orange-500/30' },
];

/* ─── Cloud Providers ─── */

export const CLOUD_PROVIDERS = [
  { id: 'azure', label: 'Azure', logo: '/azure_logo.png', color: 'from-blue-500 to-blue-700', border: 'border-blue-500', glow: 'shadow-blue-500/30' },
  { id: 'aws', label: 'AWS', logo: '/aws_logo.png', color: 'from-orange-500 to-orange-700', border: 'border-orange-500', glow: 'shadow-orange-500/30' },
  { id: 'gcp', label: 'GCP', logo: '/gcp_logo.png', color: 'from-red-500 to-yellow-500', border: 'border-red-500', glow: 'shadow-red-500/30' },
];

/* ─── Teams (on-demand → requestor_team) ─── */

export const TEAMS = ['Engineering', 'Data Science', 'Marketing', 'Product', 'Operations', 'Finance', 'Infrastructure'];

/* ─── Regions by Provider ─── */

export const REGIONS_BY_PROVIDER: Record<string, string[]> = {
  azure: ['East US', 'East US 2', 'West US', 'West US 2', 'Central US', 'West Europe', 'North Europe', 'Southeast Asia', 'Japan East', 'Australia East'],
  aws: ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-southeast-1', 'ap-northeast-1'],
  gcp: ['us-central1', 'us-east1', 'us-west1', 'europe-west1', 'europe-west3', 'asia-east1', 'asia-northeast1', 'australia-southeast1'],
};

/* ─── Sample Subscriptions / Accounts (placeholder) ─── */

export const SAMPLE_SUBSCRIPTIONS: Record<string, { id: string; name: string }[]> = {
  azure: [
    { id: 'sub-001-abcd', name: 'Prod - Data Platform' },
    { id: 'sub-002-efgh', name: 'Dev - Engineering' },
    { id: 'sub-003-ijkl', name: 'Staging - Analytics' },
    { id: 'sub-004-mnop', name: 'Prod - ML Workloads' },
  ],
  aws: [
    { id: '123456789012', name: 'Production Account' },
    { id: '234567890123', name: 'Development Account' },
    { id: '345678901234', name: 'Staging Account' },
  ],
  gcp: [
    { id: 'proj-prod-001', name: 'snowcap-production' },
    { id: 'proj-dev-002', name: 'snowcap-development' },
    { id: 'proj-stg-003', name: 'snowcap-staging' },
  ],
};

/* ─── Environments & Deployments (on-demand) ─── */

export const ENVIRONMENTS = ['Production', 'Pre-production', 'Development', 'Sandbox'];
export const DEPLOYMENTS = ['Primary', 'Secondary', 'DR (Disaster Recovery)', 'Edge'];

/* ─── Instance Types & Availability Zones ─── */

export const INSTANCE_TYPES = [
  'p4d.24xlarge', 'p3.16xlarge', 'p3.8xlarge', 'p3.2xlarge',
  'g5.48xlarge', 'g5.24xlarge', 'g5.12xlarge',
  'c5.18xlarge', 'c5.9xlarge', 'c5.4xlarge',
  'm5.24xlarge', 'm5.12xlarge', 'm5.8xlarge',
];

export const AVAILABILITY_ZONES = [
  'us-east-1a', 'us-east-1b', 'us-east-1c',
  'us-west-2a', 'us-west-2b', 'us-west-2c',
  'eu-west-1a', 'eu-west-1b',
  'eu-central-1a', 'eu-central-1b',
];

/* ─── Reservation-specific constants ─── */

export const INSTANCE_PLATFORMS = [
  'Linux/UNIX',
  'Red Hat Enterprise Linux',
  'SUSE Linux',
  'Windows',
  'Windows with SQL Server Standard',
  'Windows with SQL Server Web',
  'Windows with SQL Server Enterprise',
];

export const INSTANCE_MATCH_CRITERIA = [
  { id: 'open', label: 'Open', description: 'Instances can run in any available capacity' },
  { id: 'targeted', label: 'Targeted', description: 'Instances launch into reserved capacity' },
];

export const DELIVERY_PREFERENCES = [
  { id: 'incremental', label: 'Incremental', description: 'Deliver capacity as it becomes available' },
  { id: 'fixed', label: 'Fixed', description: 'All capacity delivered at once' },
];

/* ─── Quota-specific constants ─── */

export const QUOTA_PROVIDERS = ['Azure'] as const;

export const RESOURCE_TYPES = [
  'standardDpldsv5Family', 'standardDpldsv6Family', 'standardEdsv5Family',
  'standardEASv5Family', 'standardFSv2Family', 'standardFFamily',
  'Standard NCASv3_T4 Family vCPUs', 'StandardNCADSA100v4Family',
  'StandardNCCads2023Family', 'StandardNVADSA10v5Family',
];

/* ─── Types ─── */

export type RequestForm = {
  requestType: string;
  team: string;
  cloudProvider: string;
  region: string;
  subscriptionId: string;
  accountName: string;
  environment: string;
  deployment: string;
  availabilityZone: string;
  financeApproval: boolean;
  notes: string;
};

export type ReservationPayload = {
  instanceType: string;
  instanceCount: string;
  instancePlatform: string;
  instanceMatchCriteria: string;
  immediateUse: boolean;
  unlimitedUse: boolean;
  deliveryPreference: string;
  commitmentDuration: string;
  startDate: string;
  endDate: string;
};

export type QuotaPayload = {
  resourceType: string;
  requestedLimit: string;
  justification: string;
  quotaName: string;
  tenantId: string;
  createSupportCase: boolean;
};

export type CapacityBlockPayload = {
  capacityBlockOfferingId: string;
  instanceType: string;
  instanceCount: string;
  instancePlatform: string;
  dryRun: boolean;
  approvedBy: string;
  estimatedCost: string;
};

export type CapacityPlanEntry = {
  id: string;
  instanceType: string;
  date: string;
  availabilityZone: string;
  minCount: string;
  maxCount: string;
  isCollapsed: boolean;
};

export type RampUpPlan = {
  id: string;
  date: string;
  minCount: string;
  maxCount: string;
  isCollapsed: boolean;
};

export type BackupPlan = {
  id: string;
  instanceType: string;
  sameAsPrimary: boolean;
  date: string;
  availabilityZone: string;
  minCount: string;
  maxCount: string;
  isCollapsed: boolean;
};

/* ─── Factory Helpers ─── */

export const createCapacityPlan = (): CapacityPlanEntry => ({
  id: crypto.randomUUID(), instanceType: '', date: '', availabilityZone: '', minCount: '', maxCount: '', isCollapsed: false,
});

export const createRampUpPlan = (): RampUpPlan => ({
  id: crypto.randomUUID(), date: '', minCount: '', maxCount: '', isCollapsed: false,
});

export const createBackupPlan = (): BackupPlan => ({
  id: crypto.randomUUID(), instanceType: '', sameAsPrimary: true, date: '', availabilityZone: '', minCount: '', maxCount: '', isCollapsed: false,
});

export const createReservationPayload = (): ReservationPayload => ({
  instanceType: '', instanceCount: '', instancePlatform: '', instanceMatchCriteria: '',
  immediateUse: false, unlimitedUse: false, deliveryPreference: '', commitmentDuration: '',
  startDate: '', endDate: '',
});

export const createQuotaPayload = (): QuotaPayload => ({
  resourceType: '', requestedLimit: '', justification: '', quotaName: '', tenantId: '',
  createSupportCase: false,
});

export const createCapacityBlockPayload = (): CapacityBlockPayload => ({
  capacityBlockOfferingId: '', instanceType: '', instanceCount: '', instancePlatform: '',
  dryRun: false, approvedBy: '', estimatedCost: '',
});

export const INITIAL_FORM: RequestForm = {
  requestType: '', team: '', cloudProvider: '', region: '', subscriptionId: '', accountName: '',
  environment: '', deployment: '', availabilityZone: '', financeApproval: false, notes: '',
};

/* ─── Status helpers (shared by My Requests & View Requests) ─── */

export const STATUS_BADGE_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  approved: 'bg-[#29B5E8]/10 text-[#29B5E8] border-[#29B5E8]/30',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/30',
};

/* ─── Utility: provider account label ─── */

export function getProviderAccountLabel(cloudProvider: string): string {
  if (cloudProvider === 'azure') return 'Azure Subscription';
  if (cloudProvider === 'aws') return 'AWS Account';
  return 'GCP Project';
}
