/* ═══════════════════════════════════════════════
   Quota Summary
   ═══════════════════════════════════════════════ */

export type TopAdjustedQuota = {
  quotaName: string;
  adjustments: number;
};

export type TopQuotaUsage = {
  quotaName: string;
  region: string;
  usagePct: number;
};

export const TOTAL_ADJUSTMENTS_30D = 184;
export const ADJUSTED_SUBSCRIPTIONS_30D = 37;

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

/* ═══════════════════════════════════════════════
   Capacity Reservations Summary
   ═══════════════════════════════════════════════ */

export type UnusedReservationCost = {
  label: string;
  instanceType: string;
  unusedSpend: number;
};

export const TOTAL_UNUSED_COST_7D = 18420;

export const TOP_UNUSED_RESERVATION_COSTS: UnusedReservationCost[] = [
  { label: 'Staging', instanceType: 'm5.xlarge', unusedSpend: 4320 },
  { label: 'ML Platform', instanceType: 'c5.4xlarge', unusedSpend: 3480 },
  { label: 'Production - EU', instanceType: 'm5.2xlarge', unusedSpend: 2880 },
  { label: 'Production - US', instanceType: 'r5.2xlarge', unusedSpend: 2640 },
  { label: 'Development', instanceType: 'c5.xlarge', unusedSpend: 1980 },
  { label: 'Data Analytics', instanceType: 'r5.8xlarge', unusedSpend: 1640 },
  { label: 'Data Analytics', instanceType: 'm5.4xlarge', unusedSpend: 1480 },
];

/* ═══════════════════════════════════════════════
   Capacity Requests Summary
   ═══════════════════════════════════════════════ */

export type RequestBreakdown = {
  status: string;
  count: number;
  color: string;
};

export const TOTAL_REQUESTS = 156;
export const COMPLETED_REQUESTS = 98;

export const REQUEST_BREAKDOWN: RequestBreakdown[] = [
  { status: 'Completed', count: 98, color: '#10B981' },
  { status: 'In Progress', count: 23, color: '#29B5E8' },
  { status: 'Pending', count: 18, color: '#EAB308' },
  { status: 'Approved', count: 12, color: '#8B5CF6' },
  { status: 'Rejected', count: 3, color: '#EF4444' },
  { status: 'Cancelled', count: 2, color: '#6B7280' },
];

export type RecentActivity = {
  action: string;
  detail: string;
  time: string;
  type: 'quota' | 'reservation' | 'request';
};

export const RECENT_ACTIVITIES: RecentActivity[] = [
  { action: 'Quota auto-adjusted', detail: 'standardEDSv5Family in eastus2 — increased to 500', time: '12 min ago', type: 'quota' },
  { action: 'New reservation created', detail: 'r5.4xlarge × 5 in us-east-1', time: '45 min ago', type: 'reservation' },
  { action: 'Request completed', detail: 'REQ-20260215-010 — Capacity Change approved', time: '2 hours ago', type: 'request' },
  { action: 'Quota threshold breach', detail: 'standardNCASv3_T4Family at 97% in eastus2', time: '3 hours ago', type: 'quota' },
  { action: 'Reservation expired', detail: 'ri-5f6g7h…m3 — Staging m5.xlarge', time: '5 hours ago', type: 'reservation' },
  { action: 'Request submitted', detail: 'REQ-20260216-011 — New Reservation in eu-west-1', time: '6 hours ago', type: 'request' },
];
