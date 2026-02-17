/* ═══════════════════════════════════════════════
   Request Admin
   ═══════════════════════════════════════════════ */

export const REQUEST_STATUSES = ['All', 'Pending', 'Approved', 'Rejected', 'In Progress', 'Completed', 'Cancelled'];

export type AdminRequest = {
  id: string;
  requestId: string;
  type: string;
  requestor: string;
  team: string;
  cloud: string;
  region: string;
  status: string;
  created: string;
};

export const ADMIN_REQUESTS: AdminRequest[] = [
  { id: 'ar-01', requestId: 'REQ-20260201-001', type: 'Quota Increase', requestor: 'alice.chen@snowflake.com', team: 'Infrastructure', cloud: 'Azure', region: 'eastus2', status: 'Pending', created: '2026-02-01' },
  { id: 'ar-02', requestId: 'REQ-20260203-002', type: 'New Reservation', requestor: 'bob.smith@snowflake.com', team: 'Data Platform', cloud: 'AWS', region: 'us-east-1', status: 'Approved', created: '2026-02-03' },
  { id: 'ar-03', requestId: 'REQ-20260205-003', type: 'Quota Increase', requestor: 'carol.jones@snowflake.com', team: 'ML Engineering', cloud: 'AWS', region: 'us-west-2', status: 'In Progress', created: '2026-02-05' },
  { id: 'ar-04', requestId: 'REQ-20260207-004', type: 'Capacity Change', requestor: 'dave.park@snowflake.com', team: 'Infrastructure', cloud: 'Azure', region: 'westeurope', status: 'Completed', created: '2026-02-07' },
  { id: 'ar-05', requestId: 'REQ-20260208-005', type: 'New Reservation', requestor: 'eva.garcia@snowflake.com', team: 'Security', cloud: 'GCP', region: 'us-central1', status: 'Rejected', created: '2026-02-08' },
  { id: 'ar-06', requestId: 'REQ-20260210-006', type: 'Quota Increase', requestor: 'frank.li@snowflake.com', team: 'Data Platform', cloud: 'AWS', region: 'eu-west-1', status: 'Pending', created: '2026-02-10' },
  { id: 'ar-07', requestId: 'REQ-20260211-007', type: 'Capacity Change', requestor: 'grace.wu@snowflake.com', team: 'Infrastructure', cloud: 'Azure', region: 'canadacentral', status: 'Cancelled', created: '2026-02-11' },
  { id: 'ar-08', requestId: 'REQ-20260213-008', type: 'New Reservation', requestor: 'henry.kim@snowflake.com', team: 'ML Engineering', cloud: 'AWS', region: 'ap-southeast-1', status: 'Pending', created: '2026-02-13' },
  { id: 'ar-09', requestId: 'REQ-20260214-009', type: 'Quota Increase', requestor: 'iris.patel@snowflake.com', team: 'Data Platform', cloud: 'Azure', region: 'eastus', status: 'In Progress', created: '2026-02-14' },
  { id: 'ar-10', requestId: 'REQ-20260215-010', type: 'Capacity Change', requestor: 'jack.doe@snowflake.com', team: 'Security', cloud: 'AWS', region: 'us-east-2', status: 'Approved', created: '2026-02-15' },
];

export const REQUEST_STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  Approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Rejected: 'bg-red-500/10 text-red-400 border-red-500/30',
  'In Progress': 'bg-[#29B5E8]/10 text-[#29B5E8] border-[#29B5E8]/30',
  Completed: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  Cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
};

export const UPDATE_STATUS_OPTIONS = ['Pending', 'Approved', 'Rejected', 'In Progress', 'Completed', 'Cancelled'];

/* ═══════════════════════════════════════════════
   Quota Configuration
   ═══════════════════════════════════════════════ */

export type QuotaConfig = {
  id: string;
  cloud: string;
  instanceType: string;
  quotaName: string;
  team: string;
  requestor: string;
  threshold: number;
  enabled: boolean;
  description: string;
};

export const QUOTA_CONFIGS: QuotaConfig[] = [
  { id: 'qc-01', cloud: 'Azure', instanceType: 'Standard_E32ds_v5', quotaName: 'standardEDSv5Family', team: 'Infrastructure', requestor: 'alice.chen@snowflake.com', threshold: 80, enabled: true, description: 'Auto-adjust for E32ds v5 quota in production' },
  { id: 'qc-02', cloud: 'AWS', instanceType: 'r5.2xlarge', quotaName: 'Running On-Demand Standard', team: 'Data Platform', requestor: 'bob.smith@snowflake.com', threshold: 75, enabled: true, description: 'Monitor R5 on-demand instance quota' },
  { id: 'qc-03', cloud: 'Azure', instanceType: 'Standard_FSv2', quotaName: 'standardFSv2Family', team: 'ML Engineering', requestor: 'carol.jones@snowflake.com', threshold: 85, enabled: false, description: 'FSv2 family quota monitoring — disabled for maintenance' },
  { id: 'qc-04', cloud: 'GCP', instanceType: 'n2-standard-16', quotaName: 'CPUS_ALL_REGIONS', team: 'Infrastructure', requestor: 'dave.park@snowflake.com', threshold: 90, enabled: true, description: 'GCP CPU quota across all regions' },
  { id: 'qc-05', cloud: 'AWS', instanceType: 'c5.4xlarge', quotaName: 'Running On-Demand Standard', team: 'Security', requestor: 'eva.garcia@snowflake.com', threshold: 70, enabled: true, description: 'C5 compute quota for security workloads' },
  { id: 'qc-06', cloud: 'Azure', instanceType: 'Standard_D16s_v5', quotaName: 'standardDSv5Family', team: 'Data Platform', requestor: 'frank.li@snowflake.com', threshold: 80, enabled: true, description: 'D16s v5 quota threshold for analytics' },
  { id: 'qc-07', cloud: 'AWS', instanceType: 'm5.xlarge', quotaName: 'Running On-Demand Standard', team: 'ML Engineering', requestor: 'grace.wu@snowflake.com', threshold: 65, enabled: false, description: 'M5 monitoring — currently paused' },
];

export const CLOUD_OPTIONS = ['AWS', 'Azure', 'GCP'];
export const TEAM_OPTIONS = ['Infrastructure', 'Data Platform', 'ML Engineering', 'Security', 'DevOps'];

/* ═══════════════════════════════════════════════
   Constrained Quotas
   ═══════════════════════════════════════════════ */

export type ConstrainedQuota = {
  id: string;
  quotaName: string;
  region: string;
  incrementPct: number;
  created: string;
  lastUpdated: string;
};

export const CONSTRAINED_QUOTAS: ConstrainedQuota[] = [
  { id: 'cq-01', quotaName: 'standardEDSv5Family', region: 'eastus2', incrementPct: 10, created: '2025-12-01', lastUpdated: '2026-02-10' },
  { id: 'cq-02', quotaName: 'standardFSv2Family', region: 'canadacentral', incrementPct: 15, created: '2025-11-15', lastUpdated: '2026-02-08' },
  { id: 'cq-03', quotaName: 'standardDSv5Family', region: 'westeurope', incrementPct: 12, created: '2026-01-05', lastUpdated: '2026-02-14' },
  { id: 'cq-04', quotaName: 'standardNCASv3_T4Family', region: 'eastus', incrementPct: 8, created: '2026-01-20', lastUpdated: '2026-02-12' },
  { id: 'cq-05', quotaName: 'Running On-Demand Standard', region: 'us-east-1', incrementPct: 20, created: '2025-10-10', lastUpdated: '2026-02-15' },
  { id: 'cq-06', quotaName: 'CPUS_ALL_REGIONS', region: 'us-central1', incrementPct: 5, created: '2026-02-01', lastUpdated: '2026-02-16' },
];

export const CONSTRAINED_REGION_OPTIONS = [
  'eastus', 'eastus2', 'westus2', 'centralus',
  'canadacentral', 'westeurope', 'northeurope',
  'us-east-1', 'us-west-2', 'eu-west-1',
  'us-central1', 'europe-west1',
];
