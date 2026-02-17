/* ─── Filter Options ─── */

export const CLOUD_PROVIDERS = ['All', 'Azure', 'AWS', 'GCP'] as const;

export const REGIONS: Record<string, string[]> = {
  All: ['All Regions', 'West US 2', 'East US', 'Central US', 'West Europe', 'us-east-1', 'us-west-2', 'eu-west-1', 'us-central1', 'europe-west1'],
  Azure: ['All Regions', 'West US 2', 'East US', 'Central US', 'West Europe', 'North Europe', 'Southeast Asia'],
  AWS: ['All Regions', 'us-east-1', 'us-west-2', 'us-east-2', 'eu-west-1', 'eu-central-1', 'ap-southeast-1'],
  GCP: ['All Regions', 'us-central1', 'us-east1', 'europe-west1', 'europe-west3', 'asia-east1'],
};

export const TENANT_IDS = [
  { id: 'all', label: 'All Tenants' },
  { id: 'tenant-sf-prod', label: 'SF-PROD-001' },
  { id: 'tenant-sf-dev', label: 'SF-DEV-002' },
  { id: 'tenant-sf-stg', label: 'SF-STG-003' },
];

export const SUBSCRIPTIONS = [
  { id: 'all', label: 'All Subscriptions' },
  { id: 'sub-prod-data', label: 'Prod - Data Platform' },
  { id: 'sub-dev-eng', label: 'Dev - Engineering' },
  { id: 'sub-stg-analytics', label: 'Staging - Analytics' },
  { id: 'sub-prod-ml', label: 'Prod - ML Workloads' },
];

export const INSTANCE_TYPES = [
  'All Types',
  'Standard_DSv3',
  'Standard_ESv3',
  'Standard_NCSv3',
  'Standard_NDSv2',
  'Standard_FSv2',
  'Public IP',
  'Load Balancer',
  'Storage Account',
  'Network Security Group',
  'Managed Disk',
  'Virtual Network',
];

/* ─── Types ─── */

export type QuotaUsageItem = {
  id: string;
  instanceType: string;
  quotaName: string;
  usage: number;
  limit: number;
  lastUpdated: string;
  region: string;
  subscriptionName: string;
  subscriptionId: string;
  cloud: string;
  tenantId: string;
};

export type QuotaAdjustment = {
  id: string;
  region: string;
  subscriptionName: string;
  subscriptionId: string;
  quotaName: string;
  instanceType: string;
  usage: number;
  limit: number;
  currentLimit: number;
  requested: number;
  usagePct: number;
  status: 'approved' | 'pending' | 'in-review' | 'denied';
  created: string;
  lastUpdated: string;
  cloud: string;
};

export type SupportCase = {
  id: string;
  region: string;
  supportId: string;
  subscriptionName: string;
  subscriptionId: string;
  quotaName: string;
  created: string;
  currentLimit: number;
  requested: number;
  usagePct: number;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  requestor: string;
  lastUpdated: string;
  cloud: string;
};

/* ─── Mock Data: Current Usage ─── */

export const QUOTA_USAGE_DATA: QuotaUsageItem[] = [
  { id: 'q-01', instanceType: 'Standard_DSv3', quotaName: 'Standard DSv3 Family vCPUs', usage: 85, limit: 100, lastUpdated: '2026-02-16 14:22:31', region: 'West US 2', subscriptionName: 'Prod - Data Platform', subscriptionId: '7271eb33-371d-4b48-9971-4fa884a9151a', cloud: 'Azure', tenantId: 'SF-PROD-001' },
  { id: 'q-02', instanceType: 'Standard_ESv3', quotaName: 'Standard ESv3 Family vCPUs', usage: 42, limit: 100, lastUpdated: '2026-02-16 09:15:44', region: 'East US', subscriptionName: 'Dev - Engineering', subscriptionId: '3c9a1f2e-8b7d-4e6a-af12-d34567890abc', cloud: 'Azure', tenantId: 'SF-DEV-002' },
  { id: 'q-03', instanceType: 'Public IP', quotaName: 'Public IP Addresses', usage: 18, limit: 20, lastUpdated: '2026-02-15 18:03:12', region: 'West US 2', subscriptionName: 'Prod - Data Platform', subscriptionId: '7271eb33-371d-4b48-9971-4fa884a9151a', cloud: 'Azure', tenantId: 'SF-PROD-001' },
  { id: 'q-04', instanceType: 'Storage Account', quotaName: 'Standard Storage Accounts', usage: 120, limit: 250, lastUpdated: '2026-02-16 11:47:08', region: 'East US', subscriptionName: 'Staging - Analytics', subscriptionId: 'a5b6c7d8-e9f0-1234-5678-9abcdef01234', cloud: 'Azure', tenantId: 'SF-STG-003' },
  { id: 'q-05', instanceType: 'Load Balancer', quotaName: 'Load Balancers', usage: 8, limit: 50, lastUpdated: '2026-02-14 07:33:55', region: 'West US 2', subscriptionName: 'Prod - Data Platform', subscriptionId: '7271eb33-371d-4b48-9971-4fa884a9151a', cloud: 'Azure', tenantId: 'SF-PROD-001' },
  { id: 'q-06', instanceType: 'Network Security Group', quotaName: 'Network Security Groups', usage: 90, limit: 100, lastUpdated: '2026-02-16 16:21:39', region: 'East US', subscriptionName: 'Dev - Engineering', subscriptionId: '3c9a1f2e-8b7d-4e6a-af12-d34567890abc', cloud: 'Azure', tenantId: 'SF-DEV-002' },
  { id: 'q-07', instanceType: 'Standard_NDSv2', quotaName: 'Standard NDSv2 Family vCPUs', usage: 62, limit: 80, lastUpdated: '2026-02-15 22:10:04', region: 'West US 2', subscriptionName: 'Prod - ML Workloads', subscriptionId: '8947eb99-e866-4196-9e24-bb37c457b532', cloud: 'Azure', tenantId: 'SF-PROD-001' },
  { id: 'q-08', instanceType: 'Virtual Network', quotaName: 'Virtual Networks', usage: 15, limit: 50, lastUpdated: '2026-02-13 05:58:27', region: 'Central US', subscriptionName: 'Dev - Engineering', subscriptionId: '3c9a1f2e-8b7d-4e6a-af12-d34567890abc', cloud: 'Azure', tenantId: 'SF-DEV-002' },
  { id: 'q-09', instanceType: 'Standard_NCSv3', quotaName: 'Standard NCSv3 Family vCPUs', usage: 95, limit: 100, lastUpdated: '2026-02-16 20:44:16', region: 'West US 2', subscriptionName: 'Prod - ML Workloads', subscriptionId: '8947eb99-e866-4196-9e24-bb37c457b532', cloud: 'Azure', tenantId: 'SF-PROD-001' },
  { id: 'q-10', instanceType: 'Managed Disk', quotaName: 'Managed Disks', usage: 180, limit: 200, lastUpdated: '2026-02-16 13:05:52', region: 'East US', subscriptionName: 'Staging - Analytics', subscriptionId: 'a5b6c7d8-e9f0-1234-5678-9abcdef01234', cloud: 'Azure', tenantId: 'SF-STG-003' },
  { id: 'q-11', instanceType: 'Standard_FSv2', quotaName: 'Standard FSv2 Family vCPUs', usage: 30, limit: 64, lastUpdated: '2026-02-12 19:32:41', region: 'West Europe', subscriptionName: 'Prod - Data Platform', subscriptionId: '7271eb33-371d-4b48-9971-4fa884a9151a', cloud: 'Azure', tenantId: 'SF-PROD-001' },
  { id: 'q-12', instanceType: 'Standard_DSv3', quotaName: 'Standard DSv3 Family vCPUs', usage: 55, limit: 80, lastUpdated: '2026-02-15 08:19:33', region: 'Central US', subscriptionName: 'Staging - Analytics', subscriptionId: 'a5b6c7d8-e9f0-1234-5678-9abcdef01234', cloud: 'Azure', tenantId: 'SF-STG-003' },
];

/* ─── Mock Data: Quota Adjustments ─── */

export const QUOTA_ADJUSTMENTS_DATA: QuotaAdjustment[] = [
  { id: 'QA-001', region: 'West US 2', subscriptionName: 'Prod - Data Platform', subscriptionId: '7271eb33-371d-4b48-9971-4fa884a9151a', quotaName: 'Standard DSv3 Family vCPUs', instanceType: 'Standard_DSv3', usage: 85, limit: 100, currentLimit: 100, requested: 200, usagePct: 85, status: 'approved', created: '2026-02-01', lastUpdated: '2026-02-03 10:22:14', cloud: 'Azure' },
  { id: 'QA-002', region: 'West US 2', subscriptionName: 'Prod - Data Platform', subscriptionId: '7271eb33-371d-4b48-9971-4fa884a9151a', quotaName: 'Public IP Addresses', instanceType: 'Public IP', usage: 18, limit: 20, currentLimit: 20, requested: 50, usagePct: 90, status: 'pending', created: '2026-02-10', lastUpdated: '2026-02-10 16:45:03', cloud: 'Azure' },
  { id: 'QA-003', region: 'West US 2', subscriptionName: 'Prod - ML Workloads', subscriptionId: '8947eb99-e866-4196-9e24-bb37c457b532', quotaName: 'Standard NDSv2 Family vCPUs', instanceType: 'Standard_NDSv2', usage: 62, limit: 80, currentLimit: 80, requested: 160, usagePct: 78, status: 'in-review', created: '2026-02-12', lastUpdated: '2026-02-14 09:11:47', cloud: 'Azure' },
  { id: 'QA-004', region: 'East US', subscriptionName: 'Dev - Engineering', subscriptionId: '3c9a1f2e-8b7d-4e6a-af12-d34567890abc', quotaName: 'Network Security Groups', instanceType: 'Network Security Group', usage: 90, limit: 100, currentLimit: 100, requested: 200, usagePct: 90, status: 'approved', created: '2026-01-15', lastUpdated: '2026-01-18 14:33:22', cloud: 'Azure' },
  { id: 'QA-005', region: 'East US', subscriptionName: 'Staging - Analytics', subscriptionId: 'a5b6c7d8-e9f0-1234-5678-9abcdef01234', quotaName: 'Standard Storage Accounts', instanceType: 'Storage Account', usage: 120, limit: 250, currentLimit: 250, requested: 500, usagePct: 48, status: 'denied', created: '2026-01-20', lastUpdated: '2026-01-25 11:08:56', cloud: 'Azure' },
  { id: 'QA-006', region: 'West US 2', subscriptionName: 'Prod - ML Workloads', subscriptionId: '8947eb99-e866-4196-9e24-bb37c457b532', quotaName: 'Standard NCSv3 Family vCPUs', instanceType: 'Standard_NCSv3', usage: 95, limit: 100, currentLimit: 100, requested: 250, usagePct: 95, status: 'pending', created: '2026-02-14', lastUpdated: '2026-02-16 22:36:09', cloud: 'Azure' },
];

/* ─── Mock Data: Support Cases ─── */

export const SUPPORT_CASES_DATA: SupportCase[] = [
  { id: 'sc-01', region: 'West US 2', supportId: 'SC-1234', subscriptionName: 'Prod - Data Platform', subscriptionId: '7271eb33-371d-4b48-9971-4fa884a9151a', quotaName: 'Standard DSv3 Family vCPUs', created: '2026-02-14 08:22:10', currentLimit: 100, requested: 200, usagePct: 85, status: 'open', requestor: 'Automated Adjustment', lastUpdated: '2026-02-15 14:30:22', cloud: 'Azure' },
  { id: 'sc-02', region: 'West US 2', supportId: 'SC-1235', subscriptionName: 'Prod - ML Workloads', subscriptionId: '8947eb99-e866-4196-9e24-bb37c457b532', quotaName: 'Standard NCSv3 Family vCPUs', created: '2026-02-13 10:15:45', currentLimit: 100, requested: 250, usagePct: 95, status: 'in-progress', requestor: 'Automated Adjustment', lastUpdated: '2026-02-16 22:39:58', cloud: 'Azure' },
  { id: 'sc-03', region: 'West US 2', supportId: 'SC-1236', subscriptionName: 'Prod - Data Platform', subscriptionId: '7271eb33-371d-4b48-9971-4fa884a9151a', quotaName: 'Public IP Addresses', created: '2026-02-10 15:44:31', currentLimit: 20, requested: 50, usagePct: 90, status: 'open', requestor: 'John Doe', lastUpdated: '2026-02-10 15:44:31', cloud: 'Azure' },
  { id: 'sc-04', region: 'East US', supportId: 'SC-1237', subscriptionName: 'Staging - Analytics', subscriptionId: 'a5b6c7d8-e9f0-1234-5678-9abcdef01234', quotaName: 'Standard Storage Accounts', created: '2026-02-01 09:12:08', currentLimit: 250, requested: 500, usagePct: 48, status: 'resolved', requestor: 'Jane Smith', lastUpdated: '2026-02-05 17:55:43', cloud: 'Azure' },
  { id: 'sc-05', region: 'East US', supportId: 'SC-1238', subscriptionName: 'Dev - Engineering', subscriptionId: '3c9a1f2e-8b7d-4e6a-af12-d34567890abc', quotaName: 'Network Security Groups', created: '2026-01-20 11:30:00', currentLimit: 100, requested: 200, usagePct: 90, status: 'closed', requestor: 'Automated Adjustment', lastUpdated: '2026-01-25 08:22:15', cloud: 'Azure' },
];

/* ─── Status Styles ─── */

export const ADJUSTMENT_STATUS_STYLES: Record<string, string> = {
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  'in-review': 'bg-[#29B5E8]/10 text-[#29B5E8] border-[#29B5E8]/30',
  denied: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export const CASE_STATUS_STYLES: Record<string, string> = {
  open: 'bg-[#29B5E8]/10 text-[#29B5E8] border-[#29B5E8]/30',
  'in-progress': 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  closed: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  active: 'bg-[#29B5E8]/10 text-[#29B5E8] border-[#29B5E8]/30',
};
