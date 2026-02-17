/* ─── Filter Options ─── */

export const ACCOUNTS = [
  'Production - US', 'Production - EU', 'Staging', 'Development',
  'Data Analytics', 'ML Platform', 'Shared Services',
];

export const REGIONS_OPTIONS = [
  'us-east-1', 'us-east-2', 'us-west-2', 'eu-west-1',
  'eu-central-1', 'ap-southeast-1', 'ca-central-1',
];

export const AVAILABILITY_ZONES = [
  'us-east-1a', 'us-east-1b', 'us-east-1c',
  'us-west-2a', 'us-west-2b', 'us-west-2c',
  'eu-west-1a', 'eu-west-1b',
];

export const INSTANCE_TYPES = [
  'r5.xlarge', 'r5.2xlarge', 'r5.4xlarge', 'r5.8xlarge',
  'm5.xlarge', 'm5.2xlarge', 'm5.4xlarge',
  'c5.xlarge', 'c5.2xlarge', 'c5.4xlarge',
  'i3.xlarge', 'i3.2xlarge',
];

export const INSTANCE_PLATFORMS = [
  'Linux/UNIX', 'Red Hat Enterprise Linux', 'SUSE Linux',
  'Windows', 'Windows with SQL Server',
];

export const RESERVATION_TYPES = ['Standard', 'Convertible', 'ODCR'];

export const STATES = ['active', 'expired', 'retired', 'payment-pending', 'scheduled'];

export const OWNERSHIP_OPTIONS = ['Owned', 'Shared With'];

/* ─── Types ─── */

export type ReservationDetail = {
  id: string;
  reservationId: string;
  accountName: string;
  reservationType: string;
  instanceType: string;
  totalInstanceCount: number;
  usedInstanceCount: number;
  availableInstanceCount: number;
  createdDate: string;
  startDate: string;
  endDate: string | null;
  state: 'active' | 'expired' | 'retired' | 'payment-pending' | 'scheduled';
  region: string;
  availabilityZone: string;
  instancePlatform: string;
  instanceMatchCriteria: string;
  unlimitedUse: boolean;
  ownerAccountId: string;
  ownerAccountName: string;
  ownership: string;
  monthlyRate: number;
};

/* ─── Mock Data ─── */

export const RESERVATION_DATA: ReservationDetail[] = [
  { id: 'rd-01', reservationId: 'ri-0a1b2c3d4e5f6g7h8', accountName: 'Production - US', reservationType: 'Standard', instanceType: 'r5.2xlarge', totalInstanceCount: 10, usedInstanceCount: 8, availableInstanceCount: 2, createdDate: '2025-08-15 09:22:14', startDate: '2025-08-15 16:00:00', endDate: '2026-08-15 16:00:00', state: 'active', region: 'us-east-1', availabilityZone: 'us-east-1a', instancePlatform: 'Linux/UNIX', instanceMatchCriteria: 'open', unlimitedUse: false, ownerAccountId: '186770355682', ownerAccountName: 'sfc-prod-us', ownership: 'Owned', monthlyRate: 2840 },
  { id: 'rd-02', reservationId: 'ri-1b2c3d4e5f6g7h8i9', accountName: 'Production - US', reservationType: 'Convertible', instanceType: 'r5.4xlarge', totalInstanceCount: 5, usedInstanceCount: 5, availableInstanceCount: 0, createdDate: '2025-09-01 14:05:33', startDate: '2025-09-01 16:00:00', endDate: '2026-09-01 16:00:00', state: 'active', region: 'us-east-1', availabilityZone: 'us-east-1b', instancePlatform: 'Linux/UNIX', instanceMatchCriteria: 'open', unlimitedUse: false, ownerAccountId: '186770355682', ownerAccountName: 'sfc-prod-us', ownership: 'Owned', monthlyRate: 2840 },
  { id: 'rd-03', reservationId: 'ri-2c3d4e5f6g7h8i9j0', accountName: 'Production - EU', reservationType: 'Standard', instanceType: 'm5.2xlarge', totalInstanceCount: 8, usedInstanceCount: 5, availableInstanceCount: 3, createdDate: '2025-07-20 11:18:42', startDate: '2025-07-20 16:00:00', endDate: '2026-07-20 16:00:00', state: 'active', region: 'eu-west-1', availabilityZone: 'eu-west-1a', instancePlatform: 'Linux/UNIX', instanceMatchCriteria: 'open', unlimitedUse: false, ownerAccountId: '293881466793', ownerAccountName: 'sfc-prod-eu', ownership: 'Owned', monthlyRate: 1920 },
  { id: 'rd-04', reservationId: 'ri-3d4e5f6g7h8i9j0k1', accountName: 'Data Analytics', reservationType: 'Standard', instanceType: 'r5.8xlarge', totalInstanceCount: 3, usedInstanceCount: 2, availableInstanceCount: 1, createdDate: '2025-10-10 08:44:19', startDate: '2025-10-10 16:00:00', endDate: '2026-10-10 16:00:00', state: 'active', region: 'us-west-2', availabilityZone: 'us-west-2a', instancePlatform: 'Linux/UNIX', instanceMatchCriteria: 'targeted', unlimitedUse: false, ownerAccountId: '412993577804', ownerAccountName: 'sfc-analytics', ownership: 'Owned', monthlyRate: 4560 },
  { id: 'rd-05', reservationId: 'ri-4e5f6g7h8i9j0k1l2', accountName: 'ML Platform', reservationType: 'Convertible', instanceType: 'c5.4xlarge', totalInstanceCount: 12, usedInstanceCount: 8, availableInstanceCount: 4, createdDate: '2025-11-05 16:33:07', startDate: '2025-11-05 16:00:00', endDate: '2026-11-05 16:00:00', state: 'active', region: 'us-east-1', availabilityZone: 'us-east-1c', instancePlatform: 'Linux/UNIX', instanceMatchCriteria: 'open', unlimitedUse: true, ownerAccountId: '524104688915', ownerAccountName: 'sfc-ml-platform', ownership: 'Owned', monthlyRate: 3120 },
  { id: 'rd-06', reservationId: 'ri-5f6g7h8i9j0k1l2m3', accountName: 'Staging', reservationType: 'Standard', instanceType: 'm5.xlarge', totalInstanceCount: 6, usedInstanceCount: 0, availableInstanceCount: 6, createdDate: '2025-06-01 10:12:55', startDate: '2025-06-01 16:00:00', endDate: '2026-06-01 16:00:00', state: 'expired', region: 'us-east-1', availabilityZone: 'us-east-1a', instancePlatform: 'Linux/UNIX', instanceMatchCriteria: 'open', unlimitedUse: false, ownerAccountId: '635215799026', ownerAccountName: 'sfc-staging', ownership: 'Owned', monthlyRate: 480 },
  { id: 'rd-07', reservationId: 'ri-6g7h8i9j0k1l2m3n4', accountName: 'Development', reservationType: 'Standard', instanceType: 'c5.xlarge', totalInstanceCount: 4, usedInstanceCount: 2, availableInstanceCount: 2, createdDate: '2026-01-15 19:27:38', startDate: '2026-01-15 16:00:00', endDate: '2027-01-15 16:00:00', state: 'active', region: 'us-east-2', availabilityZone: 'us-east-1a', instancePlatform: 'Linux/UNIX', instanceMatchCriteria: 'open', unlimitedUse: false, ownerAccountId: '746326800137', ownerAccountName: 'sfc-dev', ownership: 'Shared With', monthlyRate: 520 },
  { id: 'rd-08', reservationId: 'ri-7h8i9j0k1l2m3n4o5', accountName: 'Shared Services', reservationType: 'Convertible', instanceType: 'i3.2xlarge', totalInstanceCount: 2, usedInstanceCount: 2, availableInstanceCount: 0, createdDate: '2025-12-20 07:50:22', startDate: '2025-12-20 16:00:00', endDate: '2026-12-20 16:00:00', state: 'active', region: 'us-east-1', availabilityZone: 'us-east-1b', instancePlatform: 'Linux/UNIX', instanceMatchCriteria: 'open', unlimitedUse: false, ownerAccountId: '857437911248', ownerAccountName: 'sfc-shared', ownership: 'Owned', monthlyRate: 1680 },
  { id: 'rd-09', reservationId: 'ri-8i9j0k1l2m3n4o5p6', accountName: 'Production - US', reservationType: 'Standard', instanceType: 'r5.xlarge', totalInstanceCount: 20, usedInstanceCount: 15, availableInstanceCount: 5, createdDate: '2025-05-10 13:15:44', startDate: '2025-05-10 16:00:00', endDate: '2026-05-10 16:00:00', state: 'retired', region: 'us-east-1', availabilityZone: 'us-east-1a', instancePlatform: 'Linux/UNIX', instanceMatchCriteria: 'open', unlimitedUse: false, ownerAccountId: '186770355682', ownerAccountName: 'sfc-prod-us', ownership: 'Owned', monthlyRate: 2840 },
  { id: 'rd-10', reservationId: 'ri-9j0k1l2m3n4o5p6q7', accountName: 'Data Analytics', reservationType: 'ODCR', instanceType: 'm5.4xlarge', totalInstanceCount: 4, usedInstanceCount: 3, availableInstanceCount: 1, createdDate: '2026-01-01 22:08:16', startDate: '2026-01-01 16:00:00', endDate: null, state: 'active', region: 'ca-central-1', availabilityZone: 'us-east-1a', instancePlatform: 'Linux/UNIX', instanceMatchCriteria: 'open', unlimitedUse: true, ownerAccountId: '412993577804', ownerAccountName: 'sfc-analytics', ownership: 'Shared With', monthlyRate: 1920 },
];

/* ─── Status Styles ─── */

export const STATE_STYLES: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  expired: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  retired: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  'payment-pending': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  scheduled: 'bg-[#29B5E8]/10 text-[#29B5E8] border-[#29B5E8]/30',
};
