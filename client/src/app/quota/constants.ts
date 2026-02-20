/* ─── Backend Response Types (GET /api/quota/overview) ─── */

export interface QuotaOverviewResponse {
  kpis: OverviewKPIs;
  charts: OverviewCharts;
  atRiskQuotas: AtRiskQuotaRow[];
  quotas: OverviewQuotaRow[];
  adjustments: OverviewAdjustmentRow[];
}

export interface OverviewKPIs {
  totalQuotas: number;
  critical: number;
  openTickets: number;
  failedIncreases: number;
  recentAdjustments30d: number;
  criticalQuotas: { quotaName: string; usagePct: number }[];
}

export interface OverviewCharts {
  usageTrend: UsageTrendPoint[];
  topQuotasByUsage: TopQuotaBar[];
}

export interface UsageTrendPoint {
  usageDate: string;
  maxUsagePct: number;
  avgUsagePct: number;
}

export interface TopQuotaBar {
  quotaName: string;
  usagePct: number;
  currentUsage: number;
  quotaLimit: number;
}

export interface OverviewQuotaRow {
  region: string;
  tenantId: string;
  subscriptionId: string;
  subscriptionName: string;
  instanceType: string;
  quotaName: string;
  currentUsage: number;
  quotaLimit: number;
  usagePct: number;
  lastUpdated: string;
}

export interface OverviewAdjustmentRow {
  quotaName: string;
  region: string;
  tenantId: string;
  subscriptionId: string;
  instanceType: string;
  requestStatus: string;
  cspSupportRequestId: string;
  createdAt: string;
}

export interface AtRiskQuotaRow {
  quotaName: string;
  region: string;
  currentUsage: number;
  quotaLimit: number;
  usagePct: number;
  hasOpenTicket: boolean;
  hasPendingAdjustment: boolean;
  lastUpdated: string;
}

/* ─── Legacy Types (used by other tabs still on mock data) ─── */

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

export interface QuotaAdjustmentRow {
  id: string;
  quotaId: string;
  region: string;
  tenantId: string;
  subscriptionId: string;
  subscriptionName: string;
  instanceType: string;
  quotaName: string;
  limitBeforeAdjustment: number;
  requestedNewLimit: number;
  usagePercent: number;
  unit: string;
  requestStatus: string;
  cspSupportRequestId: string;
  cspSupportRequestTimestamp: string;
  lastAdjustmentStatusCheck: string;
  statusCheckCount: number;
  justification: string;
  message: string;
  createdAt: string;
  lastUpdated: string;
  requestor: string;
}

/** @deprecated kept for SupportCasesTab mock data */
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

/** @deprecated Support cases are now derived from QuotaAdjustmentRow with non-empty cspSupportRequestId */
export type SupportCase = QuotaAdjustmentRow;

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


/* ─── Mock Data: Historical Usage (time-series for charts) ─── */

export type HistoricalUsagePoint = {
  date: string;
  quotaName: string;
  usagePct: number;
};

function generateHistory(quotaName: string, basePct: number, variance: number): HistoricalUsagePoint[] {
  const points: HistoricalUsagePoint[] = [];
  const now = new Date('2026-02-16');
  for (let i = 90; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const drift = (90 - i) * (variance / 90);
    const noise = (Math.sin(i * 0.7) * variance * 0.4);
    const pct = Math.max(0, Math.min(100, basePct - variance + drift + noise));
    points.push({
      date: d.toISOString().slice(0, 10),
      quotaName,
      usagePct: Math.round(pct * 10) / 10,
    });
  }
  return points;
}

export const HISTORICAL_USAGE_DATA: HistoricalUsagePoint[] = [
  ...generateHistory('Standard NCSv3 Family vCPUs', 95, 15),
  ...generateHistory('Network Security Groups', 90, 12),
  ...generateHistory('Public IP Addresses', 90, 10),
  ...generateHistory('Standard DSv3 Family vCPUs', 85, 18),
  ...generateHistory('Managed Disks', 80, 14),
];

export const TICKET_URL_PATTERN = 'https://portal.azure.com/#view/Microsoft_Azure_Support/SupportRequestDetailBlade/srId/';

/* ─── Status Styles ─── */

export const ADJUSTMENT_STATUS_STYLES: Record<string, string> = {
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  submitted: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  active: 'bg-[#29B5E8]/10 text-[#29B5E8] border-[#29B5E8]/30',
  inprogress: 'bg-[#29B5E8]/10 text-[#29B5E8] border-[#29B5E8]/30',
  partiallycompleted: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  failed: 'bg-red-500/10 text-red-400 border-red-500/30',
  timedout: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export function getAdjustmentStatusStyle(status: string): string {
  return ADJUSTMENT_STATUS_STYLES[status.toLowerCase()] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/30';
}

export type AdjustmentStatusGroup = 'all' | 'completed' | 'in-progress' | 'failed';

export function getStatusGroup(status: string): AdjustmentStatusGroup {
  const s = status.toLowerCase();
  if (s === 'completed') return 'completed';
  if (['submitted', 'active', 'inprogress', 'partiallycompleted'].includes(s)) return 'in-progress';
  if (['failed', 'timedout'].includes(s)) return 'failed';
  return 'all';
}

