/* ─── Filter Options ─── */

export const CLOUD_PROVIDERS = ['Azure', 'AWS', 'GCP'] as const;
export const VIEW_TYPES = ['All', 'On-Demand', 'Reserved'] as const;
export const PRODUCTS = ['Snowpark', 'Snowpipe', 'Warehouse', 'Replication', 'Materialized Views', 'Search Optimization'] as const;
export const REGIONS = ['All Regions', 'East US 2', 'West US 2', 'Central US', 'Canada Central', 'West Europe', 'North Europe'] as const;
export const DEPLOYMENTS = ['All', 'Primary', 'Secondary', 'DR'] as const;
export const WAREHOUSE_TYPES = ['All', 'Standard', 'Snowpark-Optimized', 'Large', 'X-Large'] as const;
export const DEMAND_METRICS = ['Maximum', 'Average', 'P95', 'P99', 'Median'] as const;

/* ─── Types ─── */

export type DemandDataPoint = {
  date: string;
  totalDemand: number;
  productDemand: number;
  customerUse: number;
  internalUse: number;
  freePool: number;
  supply: number;
  type: 'historical' | 'forecast';
  predLb?: number;
  predUb?: number;
  productPredLb?: number;
  productPredUb?: number;
};

export type TabularRow = {
  date: string;
  product: string;
  region: string;
  deployment: string;
  warehouseType: string;
  demand: number;
  customerUse: number;
  internalUse: number;
  freePool: number;
  metric: string;
  unit: string;
};

/* ─── Mock Time-Series Data ─── */

function generateDemandData(): DemandDataPoint[] {
  const data: DemandDataPoint[] = [];

  const historicalMonths = [
    { date: '2025-09-01', total: 4200, product: 1800, customer: 2520, internal: 1260, free: 420, supply: 5500 },
    { date: '2025-09-15', total: 4350, product: 1870, customer: 2610, internal: 1305, free: 435, supply: 5500 },
    { date: '2025-10-01', total: 4500, product: 1950, customer: 2700, internal: 1350, free: 450, supply: 5800 },
    { date: '2025-10-15', total: 4420, product: 1910, customer: 2652, internal: 1326, free: 442, supply: 5800 },
    { date: '2025-11-01', total: 4750, product: 2100, customer: 2850, internal: 1425, free: 475, supply: 6000 },
    { date: '2025-11-15', total: 4900, product: 2200, customer: 2940, internal: 1470, free: 490, supply: 6000 },
    { date: '2025-12-01', total: 5200, product: 2350, customer: 3120, internal: 1560, free: 520, supply: 6500 },
    { date: '2025-12-15', total: 5500, product: 2500, customer: 3300, internal: 1650, free: 550, supply: 6500 },
    { date: '2026-01-01', total: 5350, product: 2420, customer: 3210, internal: 1605, free: 535, supply: 7000 },
    { date: '2026-01-15', total: 5600, product: 2550, customer: 3360, internal: 1680, free: 560, supply: 7000 },
    { date: '2026-02-01', total: 5800, product: 2650, customer: 3480, internal: 1740, free: 580, supply: 7200 },
    { date: '2026-02-16', total: 5950, product: 2720, customer: 3570, internal: 1785, free: 595, supply: 7200 },
  ];

  for (const m of historicalMonths) {
    data.push({
      date: m.date, totalDemand: m.total, productDemand: m.product,
      customerUse: m.customer, internalUse: m.internal, freePool: m.free,
      supply: m.supply, type: 'historical',
    });
  }

  const forecastMonths = [
    { date: '2026-03-01', total: 6100, product: 2800, customer: 3660, internal: 1830, free: 610, supply: 7500, lb: 5700, ub: 6500, plb: 2550, pub: 3050 },
    { date: '2026-03-15', total: 6250, product: 2870, customer: 3750, internal: 1875, free: 625, supply: 7500, lb: 5800, ub: 6700, plb: 2600, pub: 3140 },
    { date: '2026-04-01', total: 6500, product: 2980, customer: 3900, internal: 1950, free: 650, supply: 7800, lb: 5900, ub: 7100, plb: 2680, pub: 3280 },
    { date: '2026-04-15', total: 6700, product: 3050, customer: 4020, internal: 2010, free: 670, supply: 7800, lb: 6000, ub: 7400, plb: 2720, pub: 3380 },
    { date: '2026-05-01', total: 6900, product: 3150, customer: 4140, internal: 2070, free: 690, supply: 8200, lb: 6100, ub: 7700, plb: 2780, pub: 3520 },
    { date: '2026-05-15', total: 7100, product: 3250, customer: 4260, internal: 2130, free: 710, supply: 8200, lb: 6200, ub: 8000, plb: 2850, pub: 3650 },
    { date: '2026-06-01', total: 7350, product: 3380, customer: 4410, internal: 2205, free: 735, supply: 8500, lb: 6300, ub: 8400, plb: 2930, pub: 3830 },
    { date: '2026-06-15', total: 7500, product: 3450, customer: 4500, internal: 2250, free: 750, supply: 8500, lb: 6350, ub: 8650, plb: 2980, pub: 3920 },
    { date: '2026-07-01', total: 7700, product: 3550, customer: 4620, internal: 2310, free: 770, supply: 8800, lb: 6400, ub: 9000, plb: 3050, pub: 4050 },
    { date: '2026-07-15', total: 7850, product: 3620, customer: 4710, internal: 2355, free: 785, supply: 8800, lb: 6450, ub: 9250, plb: 3090, pub: 4150 },
    { date: '2026-08-01', total: 8100, product: 3750, customer: 4860, internal: 2430, free: 810, supply: 9200, lb: 6500, ub: 9700, plb: 3150, pub: 4350 },
    { date: '2026-08-15', total: 8300, product: 3850, customer: 4980, internal: 2490, free: 830, supply: 9200, lb: 6500, ub: 10100, plb: 3200, pub: 4500 },
  ];

  // Bridge point
  data.push({
    date: '2026-02-16', totalDemand: 5950, productDemand: 2720,
    customerUse: 3570, internalUse: 1785, freePool: 595, supply: 7200,
    type: 'forecast', predLb: 5950, predUb: 5950, productPredLb: 2720, productPredUb: 2720,
  });

  for (const m of forecastMonths) {
    data.push({
      date: m.date, totalDemand: m.total, productDemand: m.product,
      customerUse: m.customer, internalUse: m.internal, freePool: m.free,
      supply: m.supply, type: 'forecast',
      predLb: m.lb, predUb: m.ub, productPredLb: m.plb, productPredUb: m.pub,
    });
  }

  return data;
}

export const DEMAND_DATA = generateDemandData();

/* ─── Mock Tabular Data ─── */

export const HISTORICAL_TABLE_DATA: TabularRow[] = [
  { date: '2026-02-16', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2720, customerUse: 1632, internalUse: 816, freePool: 272, metric: 'Maximum', unit: 'credits' },
  { date: '2026-02-01', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2650, customerUse: 1590, internalUse: 795, freePool: 265, metric: 'Maximum', unit: 'credits' },
  { date: '2026-01-15', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2550, customerUse: 1530, internalUse: 765, freePool: 255, metric: 'Maximum', unit: 'credits' },
  { date: '2026-01-01', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2420, customerUse: 1452, internalUse: 726, freePool: 242, metric: 'Maximum', unit: 'credits' },
  { date: '2025-12-15', product: 'Snowpark', region: 'East US 2', deployment: 'Secondary', warehouseType: 'Standard', demand: 2500, customerUse: 1500, internalUse: 750, freePool: 250, metric: 'Maximum', unit: 'credits' },
  { date: '2025-12-01', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2350, customerUse: 1410, internalUse: 705, freePool: 235, metric: 'Maximum', unit: 'credits' },
  { date: '2025-11-15', product: 'Snowpark', region: 'East US 2', deployment: 'Secondary', warehouseType: 'Standard', demand: 2200, customerUse: 1320, internalUse: 660, freePool: 220, metric: 'Maximum', unit: 'credits' },
  { date: '2025-11-01', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2100, customerUse: 1260, internalUse: 630, freePool: 210, metric: 'Maximum', unit: 'credits' },
];

export const FORECAST_TABLE_DATA: TabularRow[] = [
  { date: '2026-03-01', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2800, customerUse: 1680, internalUse: 840, freePool: 280, metric: 'Maximum', unit: 'credits' },
  { date: '2026-03-15', product: 'Snowpark', region: 'East US 2', deployment: 'Secondary', warehouseType: 'Standard', demand: 2870, customerUse: 1722, internalUse: 861, freePool: 287, metric: 'Maximum', unit: 'credits' },
  { date: '2026-04-01', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2980, customerUse: 1788, internalUse: 894, freePool: 298, metric: 'Maximum', unit: 'credits' },
  { date: '2026-04-15', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 3050, customerUse: 1830, internalUse: 915, freePool: 305, metric: 'Maximum', unit: 'credits' },
  { date: '2026-05-01', product: 'Snowpark', region: 'East US 2', deployment: 'Secondary', warehouseType: 'Large', demand: 3150, customerUse: 1890, internalUse: 945, freePool: 315, metric: 'Maximum', unit: 'credits' },
  { date: '2026-05-15', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 3250, customerUse: 1950, internalUse: 975, freePool: 325, metric: 'Maximum', unit: 'credits' },
  { date: '2026-06-01', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 3380, customerUse: 2028, internalUse: 1014, freePool: 338, metric: 'Maximum', unit: 'credits' },
  { date: '2026-06-15', product: 'Snowpark', region: 'East US 2', deployment: 'DR', warehouseType: 'Standard', demand: 3450, customerUse: 2070, internalUse: 1035, freePool: 345, metric: 'Maximum', unit: 'credits' },
];

/* ─── Query Templates ─── */

export function buildHistoricalQuery(filters: {
  cloud: string; product: string; region: string; deployment: string;
  warehouseType: string; metric: string; fromDate: string; toDate: string;
}) {
  return {
    sql: `SELECT
  DATE_TRUNC('day', usage_date) AS date,
  product,
  region,
  deployment,
  warehouse_type,
  ${filters.metric === 'Maximum' ? 'MAX' : filters.metric === 'Average' ? 'AVG' : filters.metric === 'P95' ? 'PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY' : filters.metric === 'P99' ? 'PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY' : 'MEDIAN'}(demand_credits)${filters.metric.startsWith('P') ? ')' : ''} AS demand
FROM SNOWCAP_CAPACITY_ENGINE.DEMAND_HISTORICAL
WHERE cloud_provider = :cloud_provider
  AND product = :product
  AND region = :region
  AND deployment = :deployment
  AND warehouse_type = :warehouse_type
  AND usage_date BETWEEN :from_date AND :to_date
GROUP BY 1, 2, 3, 4, 5
ORDER BY date DESC;`,
    params: {
      cloud_provider: filters.cloud,
      product: filters.product,
      region: filters.region,
      deployment: filters.deployment,
      warehouse_type: filters.warehouseType,
      from_date: filters.fromDate,
      to_date: filters.toDate,
    },
  };
}

export function buildForecastQuery(filters: {
  cloud: string; product: string; region: string; deployment: string;
  warehouseType: string; metric: string; fromDate: string; toDate: string;
}) {
  return {
    sql: `SELECT
  DATE_TRUNC('day', forecast_date) AS date,
  product,
  region,
  deployment,
  warehouse_type,
  ${filters.metric === 'Maximum' ? 'MAX' : filters.metric === 'Average' ? 'AVG' : filters.metric === 'P95' ? 'PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY' : filters.metric === 'P99' ? 'PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY' : 'MEDIAN'}(forecasted_credits)${filters.metric.startsWith('P') ? ')' : ''} AS demand,
  confidence_lower,
  confidence_upper
FROM SNOWCAP_CAPACITY_ENGINE.DEMAND_FORECAST
WHERE cloud_provider = :cloud_provider
  AND product = :product
  AND region = :region
  AND deployment = :deployment
  AND warehouse_type = :warehouse_type
  AND forecast_date BETWEEN :from_date AND :to_date
GROUP BY 1, 2, 3, 4, 5, 7, 8
ORDER BY date ASC;`,
    params: {
      cloud_provider: filters.cloud,
      product: filters.product,
      region: filters.region,
      deployment: filters.deployment,
      warehouse_type: filters.warehouseType,
      from_date: filters.fromDate,
      to_date: filters.toDate,
    },
  };
}
