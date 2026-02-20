/* ─── Backend Response Types (GET /api/reservations/overview) ─── */

export interface ReservationOverviewResponse {
  reservations: ReservationOverviewRow[];
  filterOptions: ReservationFilterOptions;
}

export interface ReservationOverviewRow {
  awsReservationId: string;
  accountName: string;
  accountId: string;
  ownerAccountId: string;
  region: string;
  availabilityZone: string;
  instanceType: string;
  instancePlatform: string;
  reservationType: string;
  state: string;
  totalInstanceCount: number;
  availableInstanceCount: number;
  usedInstances: number;
  usagePct: number;
  hourlyPrice: number;
  currencyCode: string;
  startDate: string;
  endDate: string;
  createdDate: string;
  owned: boolean;
  unusedSpendMonthly: number;
}

export interface ReservationFilterOptions {
  accounts: { accountId: string; accountName: string }[];
  regions: string[];
  availabilityZones: string[];
  instanceTypes: string[];
  instancePlatforms: string[];
  reservationTypes: string[];
  states: string[];
  ownedOrSharedWith: string[];
}

/* ─── Status Styles ─── */

export const STATE_STYLES: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  PENDING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  QUEUED: 'bg-[#29B5E8]/10 text-[#29B5E8] border-[#29B5E8]/30',
  CANCELLED: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  EXPIRED: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
};

export function getStateStyle(state: string): string {
  return STATE_STYLES[state.toUpperCase()] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/30';
}
