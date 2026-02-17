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
  type: 'historical' | 'forecast';
};

export type TabularRow = {
  date: string;
  product: string;
  region: string;
  deployment: string;
  warehouseType: string;
  demand: number;
  metric: string;
  unit: string;
};

/* ─── Mock Time-Series Data ─── */

function generateDemandData(): DemandDataPoint[] {
  const data: DemandDataPoint[] = [];

  // Historical: 2025-09 to 2026-02 (6 months)
  const historicalMonths = [
    { date: '2025-09-01', total: 4200, product: 1800 },
    { date: '2025-09-15', total: 4350, product: 1870 },
    { date: '2025-10-01', total: 4500, product: 1950 },
    { date: '2025-10-15', total: 4420, product: 1910 },
    { date: '2025-11-01', total: 4750, product: 2100 },
    { date: '2025-11-15', total: 4900, product: 2200 },
    { date: '2025-12-01', total: 5200, product: 2350 },
    { date: '2025-12-15', total: 5500, product: 2500 },
    { date: '2026-01-01', total: 5350, product: 2420 },
    { date: '2026-01-15', total: 5600, product: 2550 },
    { date: '2026-02-01', total: 5800, product: 2650 },
    { date: '2026-02-16', total: 5950, product: 2720 },
  ];

  for (const m of historicalMonths) {
    data.push({ date: m.date, totalDemand: m.total, productDemand: m.product, type: 'historical' });
  }

  // Forecast: 2026-03 to 2026-08 (6 months)
  const forecastMonths = [
    { date: '2026-03-01', total: 6100, product: 2800 },
    { date: '2026-03-15', total: 6250, product: 2870 },
    { date: '2026-04-01', total: 6500, product: 2980 },
    { date: '2026-04-15', total: 6700, product: 3050 },
    { date: '2026-05-01', total: 6900, product: 3150 },
    { date: '2026-05-15', total: 7100, product: 3250 },
    { date: '2026-06-01', total: 7350, product: 3380 },
    { date: '2026-06-15', total: 7500, product: 3450 },
    { date: '2026-07-01', total: 7700, product: 3550 },
    { date: '2026-07-15', total: 7850, product: 3620 },
    { date: '2026-08-01', total: 8100, product: 3750 },
    { date: '2026-08-15', total: 8300, product: 3850 },
  ];

  // Bridge point: last historical point is also first forecast point
  data.push({ date: '2026-02-16', totalDemand: 5950, productDemand: 2720, type: 'forecast' });

  for (const m of forecastMonths) {
    data.push({ date: m.date, totalDemand: m.total, productDemand: m.product, type: 'forecast' });
  }

  return data;
}

export const DEMAND_DATA = generateDemandData();

/* ─── Mock Tabular Data ─── */

export const HISTORICAL_TABLE_DATA: TabularRow[] = [
  { date: '2026-02-16', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2720, metric: 'Maximum', unit: 'credits' },
  { date: '2026-02-01', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2650, metric: 'Maximum', unit: 'credits' },
  { date: '2026-01-15', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2550, metric: 'Maximum', unit: 'credits' },
  { date: '2026-01-01', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2420, metric: 'Maximum', unit: 'credits' },
  { date: '2025-12-15', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2500, metric: 'Maximum', unit: 'credits' },
  { date: '2025-12-01', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2350, metric: 'Maximum', unit: 'credits' },
  { date: '2025-11-15', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2200, metric: 'Maximum', unit: 'credits' },
  { date: '2025-11-01', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2100, metric: 'Maximum', unit: 'credits' },
];

export const FORECAST_TABLE_DATA: TabularRow[] = [
  { date: '2026-03-01', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2800, metric: 'Maximum', unit: 'credits' },
  { date: '2026-03-15', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2870, metric: 'Maximum', unit: 'credits' },
  { date: '2026-04-01', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 2980, metric: 'Maximum', unit: 'credits' },
  { date: '2026-04-15', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 3050, metric: 'Maximum', unit: 'credits' },
  { date: '2026-05-01', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 3150, metric: 'Maximum', unit: 'credits' },
  { date: '2026-05-15', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 3250, metric: 'Maximum', unit: 'credits' },
  { date: '2026-06-01', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 3380, metric: 'Maximum', unit: 'credits' },
  { date: '2026-06-15', product: 'Snowpark', region: 'East US 2', deployment: 'Primary', warehouseType: 'Snowpark-Optimized', demand: 3450, metric: 'Maximum', unit: 'credits' },
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
