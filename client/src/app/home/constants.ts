/* ═══════════════════════════════════════════════
   Cloud Health (per-provider summary)
   ═══════════════════════════════════════════════ */

export type CloudHealth = {
  provider: 'aws' | 'azure' | 'gcp';
  label: string;
  logo: string;
  health: 'healthy' | 'warning' | 'critical';
  activeReservations: number;
  quotaUtilization: number;
  pendingRequests: number;
  color: string;
  gradient: string;
};

export const CLOUD_HEALTH: CloudHealth[] = [
  { provider: 'aws', label: 'AWS', logo: '/aws_logo.png', health: 'healthy', activeReservations: 42, quotaUtilization: 68, pendingRequests: 3, color: '#F59E0B', gradient: 'from-orange-500 to-amber-600' },
  { provider: 'azure', label: 'Azure', logo: '/azure_logo.png', health: 'warning', activeReservations: 67, quotaUtilization: 84, pendingRequests: 7, color: '#3B82F6', gradient: 'from-blue-500 to-blue-700' },
  { provider: 'gcp', label: 'GCP', logo: '/gcp_logo.png', health: 'healthy', activeReservations: 19, quotaUtilization: 52, pendingRequests: 2, color: '#EF4444', gradient: 'from-red-500 to-rose-600' },
];

/* ═══════════════════════════════════════════════
   Component Snapshot Tiles
   ═══════════════════════════════════════════════ */

export type ComponentSnapshot = {
  id: string;
  label: string;
  metric: number;
  metricLabel: string;
  subMetric: string;
  href: string;
  color: string;
};

export const COMPONENT_SNAPSHOTS: ComponentSnapshot[] = [
  { id: 'capacity', label: 'Capacity Overview', metric: 128, metricLabel: 'Total Deployments', subMetric: '74% avg utilization', href: '/capacity-overview', color: '#29B5E8' },
  { id: 'quotas', label: 'Quotas', metric: 312, metricLabel: 'Quotas Monitored', subMetric: '14 at risk (above 80%)', href: '/quota', color: '#8B5CF6' },
  { id: 'reservations', label: 'Reservations', metric: 128, metricLabel: 'Active Reservations', subMetric: '$18.4K unused this week', href: '/reservation', color: '#10B981' },
  { id: 'requests', label: 'Requests', metric: 12, metricLabel: 'Pending Review', subMetric: '98 completed this month', href: '/request', color: '#F59E0B' },
];

/* ═══════════════════════════════════════════════
   Personalized "My Activity" (mock)
   ═══════════════════════════════════════════════ */

export type MyReservation = {
  id: string;
  instanceType: string;
  region: string;
  count: number;
  cloud: 'aws' | 'azure' | 'gcp';
};

export type MyRequest = {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress';
  date: string;
};

export const MY_RESERVATIONS: MyReservation[] = [
  { id: 'ri-a1b2c3', instanceType: 'r5.4xlarge', region: 'us-east-1', count: 5, cloud: 'aws' },
  { id: 'ri-d4e5f6', instanceType: 'm5.2xlarge', region: 'eu-west-1', count: 3, cloud: 'aws' },
  { id: 'ri-g7h8i9', instanceType: 'Standard_E8s_v5', region: 'East US 2', count: 10, cloud: 'azure' },
];

export const MY_REQUESTS: MyRequest[] = [
  { id: 'REQ-001', title: 'GPU capacity for ML training', status: 'pending', date: '2026-02-14' },
  { id: 'REQ-002', title: 'Quota increase — East US', status: 'approved', date: '2026-02-12' },
  { id: 'REQ-003', title: 'Reservation for staging env', status: 'in_progress', date: '2026-02-10' },
];

/* ═══════════════════════════════════════════════
   Platform Activity Feed
   ═══════════════════════════════════════════════ */

export type RecentActivity = {
  action: string;
  detail: string;
  time: string;
  type: 'quota' | 'reservation' | 'request';
};

export const RECENT_ACTIVITIES: RecentActivity[] = [
  { action: 'Quota auto-adjusted', detail: 'East US 2 — Compute quota increased', time: '12 min ago', type: 'quota' },
  { action: 'New reservation created', detail: '5 instances in us-east-1', time: '45 min ago', type: 'reservation' },
  { action: 'Request completed', detail: 'REQ-010 — Capacity change approved', time: '2 hours ago', type: 'request' },
  { action: 'Quota threshold breach', detail: 'East US 2 at 97% utilization', time: '3 hours ago', type: 'quota' },
  { action: 'Reservation expired', detail: 'Staging — m5.xlarge expired', time: '5 hours ago', type: 'reservation' },
  { action: 'Request submitted', detail: 'REQ-011 — New reservation in EU', time: '6 hours ago', type: 'request' },
];

/* ═══════════════════════════════════════════════
   Legacy data (kept for existing components)
   ═══════════════════════════════════════════════ */

export type TopAdjustedQuota = { quotaName: string; adjustments: number };
export type TopQuotaUsage = { quotaName: string; region: string; usagePct: number };
export type UnusedReservationCost = { label: string; instanceType: string; unusedSpend: number };
export type RequestBreakdown = { status: string; count: number; color: string };

export const TOTAL_ADJUSTMENTS_30D = 184;
export const ADJUSTED_SUBSCRIPTIONS_30D = 37;
export const TOTAL_UNUSED_COST_7D = 18420;
export const TOTAL_REQUESTS = 156;
export const COMPLETED_REQUESTS = 98;

export const KPI_SPARKLINES = {
  adjustments: [3, 5, 4, 7, 8, 6, 9, 12, 10, 8, 14, 11, 9],
  subscriptions: [2, 3, 2, 4, 3, 5, 4, 6, 5, 4, 6, 5, 7],
  unusedCost: [22, 20, 19, 21, 18, 17, 19, 16, 18, 15, 17, 16, 18],
  requests: [8, 10, 12, 9, 14, 11, 16, 13, 15, 12, 18, 14, 16],
};

export const TOP_ADJUSTED_QUOTAS: TopAdjustedQuota[] = [
  { quotaName: 'standardEDSv5Family', adjustments: 42 },
  { quotaName: 'standardFSv2Family', adjustments: 31 },
  { quotaName: 'standardDSv5Family', adjustments: 28 },
  { quotaName: 'standardNCASv3_T4Family', adjustments: 22 },
  { quotaName: 'Running On-Demand Standard', adjustments: 19 },
  { quotaName: 'standardDpldsv6Family', adjustments: 16 },
  { quotaName: 'CPUS_ALL_REGIONS', adjustments: 14 },
  { quotaName: 'standardBSFamily', adjustments: 12 },
];

export const TOP_QUOTA_USAGE: TopQuotaUsage[] = [
  { quotaName: 'standardNCASv3_T4Family', region: 'eastus2', usagePct: 97 },
  { quotaName: 'standardEDSv5Family', region: 'westeurope', usagePct: 94 },
  { quotaName: 'Running On-Demand Standard', region: 'us-east-1', usagePct: 91 },
  { quotaName: 'standardFSv2Family', region: 'canadacentral', usagePct: 88 },
  { quotaName: 'standardDpldsv6Family', region: 'centralus', usagePct: 85 },
  { quotaName: 'standardDSv5Family', region: 'eastus', usagePct: 82 },
  { quotaName: 'CPUS_ALL_REGIONS', region: 'us-central1', usagePct: 79 },
  { quotaName: 'standardBSFamily', region: 'northeurope', usagePct: 72 },
];

export const TOP_UNUSED_RESERVATION_COSTS: UnusedReservationCost[] = [
  { label: 'Staging', instanceType: 'm5.xlarge', unusedSpend: 4320 },
  { label: 'ML Platform', instanceType: 'c5.4xlarge', unusedSpend: 3480 },
  { label: 'Production - EU', instanceType: 'm5.2xlarge', unusedSpend: 2880 },
  { label: 'Production - US', instanceType: 'r5.2xlarge', unusedSpend: 2640 },
  { label: 'Development', instanceType: 'c5.xlarge', unusedSpend: 1980 },
  { label: 'Data Analytics', instanceType: 'r5.8xlarge', unusedSpend: 1640 },
  { label: 'Data Analytics', instanceType: 'm5.4xlarge', unusedSpend: 1480 },
];

export const REQUEST_BREAKDOWN: RequestBreakdown[] = [
  { status: 'Completed', count: 98, color: '#10B981' },
  { status: 'In Progress', count: 23, color: '#29B5E8' },
  { status: 'Pending', count: 18, color: '#EAB308' },
  { status: 'Approved', count: 12, color: '#8B5CF6' },
  { status: 'Rejected', count: 3, color: '#EF4444' },
  { status: 'Cancelled', count: 2, color: '#6B7280' },
];
