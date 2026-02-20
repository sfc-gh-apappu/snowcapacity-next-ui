/* ═══════════════════════════════════════════════
   Backend Response Types (GET /api/home/overview)
   ═══════════════════════════════════════════════ */

export interface HomeOverviewResponse {
  byCloud: CloudSummary[];
  capacityOverview: CapacityOverviewData;
  quotaSummary: QuotaSummaryData;
  reservationsSummary: ReservationsSummaryData;
  requestsSummary: RequestsSummaryData;
  recentActivity: ActivityItem[];
}

export interface CloudSummary {
  cloud: string;
  regions: number;
  deployments: number;
  avgDemandProxy: number;
  activeRequests: number;
  completedThisMonth: number;
}

export interface CapacityOverviewData {
  totalDeployments: number;
  avgUtilizationPct: number;
}

export interface QuotaSummaryData {
  totalQuotasMonitored: number;
  atRisk: number;
  atRiskPct: number;
}

export interface ReservationsSummaryData {
  activeReservations: number;
  unusedSpendUsdThisWeek: number;
}

export interface RequestsSummaryData {
  pendingReview: number;
  completedThisMonth: number;
}

export interface ActivityItem {
  kind: string;
  timestamp: string;
  summary: string;
  details?: Record<string, string>;
}

/* ═══════════════════════════════════════════════
   Cloud display config (static — logos, colors)
   ═══════════════════════════════════════════════ */

export type CloudDisplayConfig = {
  provider: string;
  label: string;
  logo: string;
  color: string;
};

export const CLOUD_DISPLAY: Record<string, CloudDisplayConfig> = {
  AWS:   { provider: 'aws',   label: 'AWS',   logo: '/aws_logo.png',   color: '#F59E0B' },
  AZURE: { provider: 'azure', label: 'Azure', logo: '/azure_logo.png', color: '#3B82F6' },
  GCP:   { provider: 'gcp',   label: 'GCP',   logo: '/gcp_logo.png',   color: '#EF4444' },
};

/* ═══════════════════════════════════════════════
   Personalized "My Activity" (mock — requires RBAC)
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
