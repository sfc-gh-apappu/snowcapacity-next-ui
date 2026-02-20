# SnowCapacity API Reference

All endpoints return a standard response envelope:

```json
{
  "data": <payload>,
  "error": { "code": "...", "message": "...", "details": ... },
  "meta": {
    "requestId": "uuid",
    "timestamp": "2026-02-17T18:00:00Z",
    "durationMs": 123
  }
}
```

- `data` is the payload (or `null` on error).
- `error` is present only on failure.
- `meta` is always present with request ID, timestamp, and server-side duration.

Paginated endpoints wrap `data` in:

```json
{
  "items": [...],
  "totalCount": 100,
  "nextPageToken": "..."
}
```

---

## Miscellaneous

### `GET /api/health`

Simple health check.

**Query params:** _none_

**Response:**

```json
{
  "data": {
    "status": "ok"
  }
}
```

---

## Capacity Overview

### `GET /api/capacity/filters`

Returns all filter options in a single call. Static options are always present.
Dynamic options (regions, deployments, warehouse types) are fetched across all
cloud/product combinations in parallel.

**Query params:** _none_

**Response:**

```json
{
  "data": {
    "clouds": ["AWS", "AZURE", "GCP"],
    "viewTypes": ["demand", "supply"],
    "products": ["XP", "GS", "FDB", "SPCS"],
    "metrics": ["Average", "Maximum"],
    "dateRange": {
      "defaultFrom": "2025-11-18",
      "defaultTo": "2026-05-17",
      "minDate": "2023-02-17",
      "maxDate": "2027-02-17"
    },
    "regions": {
      "aws|XP": ["us-east-1", "us-west-2"],
      "azure|FDB": ["eastus2", "westus2"]
    },
    "deployments": {
      "aws|us-east-1|XP": ["prod1", "prod2"],
      "azure|eastus2|FDB": ["dep1"]
    },
    "warehouseTypes": {
      "AWS": [
        { "warehouseType": "Standard", "instanceType": "m5.xlarge" }
      ],
      "AZURE": []
    }
  }
}
```

**Frontend lookup pattern:**

```
regions[cloud + "|" + product]                  → region options
deployments[cloud + "|" + region + "|" + product] → deployment options
warehouseTypes[cloud]                           → warehouse type options (XP only)
```

---

### `GET /api/capacity/demand`

Returns demand (historical actuals + forecast predictions) from the product's
forecast table (e.g. `xp_demand_wh_daily_forecasts`). A single query returns all
columns so the frontend can render both historical and forecast views.

**Query params** (required marked with `*`):

| Param           | Type   | Example        | Required |
| --------------- | ------ | -------------- | -------- |
| `cloud`         | string | `aws`          | *        |
| `product`       | string | `XP`           | *        |
| `region`        | string | `us-east-1`    | *        |
| `fromDate`      | string | `2025-11-19`   | *        |
| `toDate`        | string | `2026-05-18`   | *        |
| `aggrType`      | string | `max`          | *        |
| `deployment`    | string | `prod1`        |          |
| `warehouseType` | string | `Standard`     |          |

**Response:**

The server pre-splits rows into `historical` (ds <= today) and `forecast` (ds > today):

```json
{
  "data": {
    "historical": [
      {
        "ds": "2025-11-19",
        "deployment": "prod1",
        "whType": "Standard",
        "aggrType": "max",
        "totalDemand": 1234.0,
        "freePool": 200.0,
        "internalUse": 400.0,
        "customerUse": 634.0,
        "totalDemandPred": 0, "totalDemandPredLb": 0, "totalDemandPredUb": 0,
        "freePoolPred": 0, "freePoolPredLb": 0, "freePoolPredUb": 0,
        "internalUsePred": 0, "internalUsePredLb": 0, "internalUsePredUb": 0,
        "customerUsePred": 0, "customerUsePredLb": 0, "customerUsePredUb": 0
      }
    ],
    "forecast": [
      {
        "ds": "2026-03-15",
        "deployment": "prod1",
        "whType": "Standard",
        "aggrType": "max",
        "totalDemand": 0, "freePool": 0, "internalUse": 0, "customerUse": 0,
        "totalDemandPred": 1300.0,
        "totalDemandPredLb": 1100.0,
        "totalDemandPredUb": 1500.0,
        "freePoolPred": 210.0,
        "freePoolPredLb": 180.0,
        "freePoolPredUb": 240.0,
        "internalUsePred": 420.0,
        "internalUsePredLb": 380.0,
        "internalUsePredUb": 460.0,
        "customerUsePred": 670.0,
        "customerUsePredLb": 600.0,
        "customerUsePredUb": 740.0
      }
    ]
  }
}
```

**Notes:**
- The split is done server-side using today's UTC date.
- Product → table mapping: `XP` → `xp_demand_wh_daily_forecasts`,
  `FDB` → `fdb_demand_wh_daily_forecasts`, etc.

---

## Quota

### `GET /api/quota/filters`

Returns distinct filter values from `AZURE_QUOTA_USAGE`.

**Query params:** _none_

**Response:**

```json
{
  "data": {
    "regions": ["eastus2", "westus2", "centralus"],
    "tenantIds": ["d479c7c9-..."],
    "subscriptionIds": ["7271eb33-...", "8947eb99-..."],
    "subscriptionNames": ["azpreprod4 - Compute 2", "K8s - Canada Central"],
    "instanceTypes": ["standardEDSv5Family", "standardFSv2Family"]
  }
}
```

---

### `GET /api/quota/current-usage`

Returns filtered current usage rows from `AZURE_QUOTA_USAGE`, ordered by `usage_percent DESC`.

**Query params** (all optional):

| Param          | Type   | Example                                |
| -------------- | ------ | -------------------------------------- |
| `region`       | string | `eastus2`                              |
| `tenantId`     | string | `d479c7c9-2632-445a-b22d-7c19e68774f6`|
| `subscriptionId` | string | `7271eb33-371d-4b48-9971-4fa884a9151a` |
| `instanceType` | string | `standardEDSv5Family`                  |

**Response** (paginated):

```json
{
  "data": {
    "items": [
      {
        "region": "eastus2",
        "tenantId": "d479c7c9-...",
        "subscriptionId": "7271eb33-...",
        "subscriptionName": "azpreprod4 - snowservices",
        "providerNamespace": "Microsoft.Compute",
        "instanceType": "standardEASv5Family",
        "quotaName": "standardEASv5Family",
        "currentUsage": 200,
        "quotaLimit": 350,
        "usagePercent": 57.14,
        "unit": "Count",
        "lastUpdated": "2026-02-17T17:39:27Z"
      }
    ],
    "totalCount": 42
  }
}
```

---

### `GET /api/quota/adjustments`

Returns filtered quota adjustment records joined with usage data from
`AZURE_QUOTA_ADJUSTMENTS` + `AZURE_QUOTA_USAGE`, ordered by `created_at DESC`.

**Query params** (all optional):

| Param          | Type   | Example                                |
| -------------- | ------ | -------------------------------------- |
| `region`       | string | `eastus2`                              |
| `tenantId`     | string | `d479c7c9-2632-445a-b22d-7c19e68774f6`|
| `subscriptionId` | string | `7271eb33-371d-4b48-9971-4fa884a9151a` |
| `instanceType` | string | `standardEDSv5Family`                  |

**Response** (paginated):

```json
{
  "data": {
    "items": [
      {
        "id": "abc-123",
        "quotaId": "def-456",
        "region": "eastus2",
        "tenantId": "d479c7c9-...",
        "subscriptionId": "7271eb33-...",
        "subscriptionName": "azpreprod4 - Compute 2",
        "instanceType": "standardEDSv5Family",
        "quotaName": "standardEDSv5Family",
        "limitBeforeAdjustment": 300,
        "requestedNewLimit": 500,
        "usagePercent": 57.14,
        "unit": "Count",
        "requestStatus": "Completed",
        "cspSupportRequestId": "2602130040001941",
        "cspSupportRequestTimestamp": "2026-02-13T10:15:45Z",
        "lastAdjustmentStatusCheck": "2026-02-16T22:39:58Z",
        "statusCheckCount": 3,
        "justification": "Scaling for Q1 demand",
        "message": "",
        "createdAt": "2026-02-13T10:15:45Z",
        "lastUpdated": "2026-02-16T22:39:58Z",
        "requestor": "Automated Adjustment"
      }
    ],
    "totalCount": 15
  }
}
```

---

### `GET /api/quota/overview`

Returns the full quota overview dataset in a single call. Pre-computed
aggregations (`kpis`, `charts`, `atRiskQuotas`) power the initial render.
Raw arrays (`quotas`, `adjustments`) are always unfiltered so the frontend
can recompute aggregations client-side on filter change without additional
backend requests.

**Query params:** _none_ (called once on page load, all filtering is client-side)

**Response:**

```json
{
  "data": {
    "kpis": {
      "totalQuotas": 142,
      "critical": 0,
      "openTickets": 0,
      "failedIncreases": 0,
      "recentAdjustments30d": 10,
      "criticalQuotas": [
        { "quotaName": "standardEASv5Family", "usagePct": 95.2 }
      ]
    },
    "charts": {
      "usageTrend": [
        { "usageDate": "2026-02-20", "maxUsagePct": 57.14, "avgUsagePct": 5.64 }
      ],
      "topQuotasByUsage": [
        {
          "quotaName": "standardEASv5Family",
          "usagePct": 57.14,
          "currentUsage": 200,
          "quotaLimit": 350
        }
      ]
    },
    "atRiskQuotas": [
      {
        "quotaName": "standardEASv5Family",
        "region": "eastus2",
        "currentUsage": 200,
        "quotaLimit": 350,
        "usagePct": 85.0,
        "hasOpenTicket": false,
        "hasPendingAdjustment": true,
        "lastUpdated": "2026-02-20 17:24:17.700"
      }
    ],
    "quotas": [
      {
        "region": "eastus2",
        "tenantId": "d479c7c9-...",
        "subscriptionId": "176bfaa5-...",
        "subscriptionName": "azpreprod4 - snowservices",
        "instanceType": "standardEASv5Family",
        "quotaName": "standardEASv5Family",
        "currentUsage": 200,
        "quotaLimit": 350,
        "usagePct": 57.14,
        "lastUpdated": "2026-02-20 17:24:17.700"
      }
    ],
    "adjustments": [
      {
        "quotaName": "standardDLSv5Family",
        "region": "eastus2",
        "tenantId": "d479c7c9-...",
        "subscriptionId": "d6197f31-...",
        "instanceType": "standardDLSv5Family",
        "requestStatus": "Completed",
        "cspSupportRequestId": "",
        "createdAt": "2026-02-20 06:41:41.206"
      }
    ]
  }
}
```

**Pre-computed fields (server-side, unfiltered):**

| Field | Source | Description |
|---|---|---|
| `kpis.totalQuotas` | `AZURE_QUOTA_USAGE` (last 24h) | Total distinct quota entries |
| `kpis.critical` | `AZURE_QUOTA_USAGE` (last 24h) | Count of quotas at >= 90% usage |
| `kpis.openTickets` | `AZURE_QUOTA_ADJUSTMENTS` (last 30d) | Adjustments with a CSP ticket still in-progress |
| `kpis.failedIncreases` | `AZURE_QUOTA_ADJUSTMENTS` (last 30d) | Adjustments that ended in failed/timedout |
| `kpis.recentAdjustments30d` | `AZURE_QUOTA_ADJUSTMENTS` (last 30d) | Total adjustments in last 30 days |
| `kpis.criticalQuotas` | `AZURE_QUOTA_USAGE` (last 24h) | List of quotas at >= 90% (chip strip) |
| `charts.usageTrend` | `AZURE_QUOTA_USAGE` (last 90d) | Daily max/avg usage % for the line chart |
| `charts.topQuotasByUsage` | `AZURE_QUOTA_USAGE` (last 24h) | Top 10 quotas by usage % for the bar chart |
| `atRiskQuotas` | `AZURE_QUOTA_USAGE` + `AZURE_QUOTA_ADJUSTMENTS` | Quotas at >= 80% with open ticket / pending adjustment flags |

**Raw arrays (always unfiltered, for client-side re-aggregation):**

| Field | Source | Description |
|---|---|---|
| `quotas` | `AZURE_QUOTA_USAGE` (last 24h) | All quota rows with dimension columns |
| `adjustments` | `AZURE_QUOTA_ADJUSTMENTS` (last 30d) | All adjustment rows with dimension columns |

**Frontend usage pattern:**
1. Call this endpoint once on page load (no filters). Cache with TanStack Query.
2. Use the pre-computed `kpis`, `charts`, `atRiskQuotas` for the initial render.
3. On filter change, use the cached `quotas` and `adjustments` arrays with
   `useMemo` to recompute KPI counts, top 10, at-risk rows, etc. client-side.
   No additional backend requests needed.

---

## Home

_No endpoints yet._

---

## Requests

_No endpoints yet._

---

## Reservations

### `GET /api/reservations/filters`

Returns all filter options for the Reservations page. All values are derived
from `ODCR_RESERVATION` via parallel DISTINCT queries. Regions are computed
server-side by stripping the trailing AZ letter from `AVAILABILITY_ZONE`.

**Query params:** _none_

**Response:**

```json
{
  "data": {
    "accounts": [
      { "accountId": "123456789012", "accountName": "123456789012" }
    ],
    "regions": ["us-east-1", "us-west-2", "eu-west-1"],
    "availabilityZones": ["us-east-1a", "us-east-1b", "us-west-2a"],
    "instanceTypes": ["m5.xlarge", "r5.2xlarge", "c5.4xlarge"],
    "instancePlatforms": ["Linux/UNIX", "Windows"],
    "reservationTypes": ["ODCR", "CAPACITY_BLOCK"],
    "states": ["ACTIVE", "CANCELLED", "EXPIRED"],
    "ownedOrSharedWith": ["Owned", "Shared With"]
  }
}
```

**Notes:**
- `accounts[].accountName` is a placeholder (currently set to the account ID).
  Will be enriched with actual names once the account name mapping table is wired.
- `regions` are derived from `availabilityZones` by stripping the last character
  (e.g. `us-east-1a` → `us-east-1`).
- `ownedOrSharedWith` is always `["Owned", "Shared With"]` — the frontend applies
  this by comparing `OWNER_ACCOUNT_ID` vs `ACCOUNT_ID` on the reservation data.

---

### `GET /api/reservations/detail`

Returns all reservations from `ODCR_RESERVATION`. The full dataset is returned
so the frontend can cache it and filter client-side (matching the existing
load-once pattern). Usage % and used instance count are computed server-side.

**Query params:** _none_

**Response:**

```json
{
  "data": [
    {
      "awsReservationId": "ri-0abc1234def56789",
      "accountId": "123456789012",
      "accountName": "Production Account",
      "ownerAccountId": "123456789012",
      "reservationType": "ODCR",
      "instanceType": "m5.xlarge",
      "instancePlatform": "Linux/UNIX",
      "availabilityZone": "us-east-1a",
      "totalInstanceCount": 10,
      "availableInstanceCount": 3,
      "usedInstanceCount": 7,
      "usage": 70.0,
      "createdDate": "2026-01-15 10:30:00",
      "startDate": "2026-01-15 10:30:00",
      "endDate": "2026-07-15 10:30:00",
      "state": "ACTIVE",
      "instanceMatchCriteria": "targeted"
    }
  ]
}
```

**Derived fields (computed server-side):**
- `usedInstanceCount` = `totalInstanceCount` - `availableInstanceCount`
- `usage` = (`usedInstanceCount` / `totalInstanceCount`) * 100

**Frontend filtering:** The frontend applies Account, Region (matching AZ prefix),
AZ, Instance Type, Instance Platform, Reservation Type, State, and Owned/Shared
filters client-side on the cached data.

---

## Admin

### `GET /api/admin/requests`

Returns all capacity requests from the `REQUESTS` table, ordered by
`created_at DESC`. The frontend filters by status client-side.

**Query params:** _none_

**Response:**

```json
{
  "data": [
    {
      "id": "req-RESERVATION_CREATE-f45fff93-...",
      "requestor": "gelin.gao@snowflake.com",
      "cloud": "AWS",
      "snowcapDeployment": "Local",
      "snowcapCluster": "US_EAST_1",
      "createdAt": "2025-10-30T23:27:52.586087Z",
      "type": "RESERVATION_CREATE",
      "spec": "{ \"jira\": { ... }, \"spec\": { \"instance_type\": \"t2.small\", ... } }",
      "status": "COMPLETED"
    }
  ]
}
```

**Notes:**
- Returns all requests regardless of status. The frontend filters by status pills.
- `spec` is a JSON string containing request-specific payload details (region,
  instance type, account info, etc.). The frontend can parse this to show
  request-specific fields.
- `type` values include: `RESERVATION_CREATE`, `QUOTA_CREATE`, `CAPACITY_BLOCK_CREATE`, etc.
- `status` values include: `COMPLETED`, `FAILED`, `PENDING`, etc.

---

### `GET /api/admin/quota-configs`

Returns all quota configurations from `CLOUD_QUOTA_CONFIGS`, ordered by
`instance_type, quota_name`. The frontend toggles "enabled only" client-side.

**Query params:** _none_

**Response:**

```json
{
  "data": [
    {
      "id": "2ea455d0-0875-4c49-8c21-fe3fddd95ac7",
      "cloud": "azure",
      "providerNamespace": "Microsoft.Compute",
      "enabled": true,
      "requestor": "neha.bansal@snowflake.com",
      "thresholdPercent": 60,
      "description": "Onboarding",
      "createdAt": "2025-11-05T20:08:20.215Z",
      "lastUpdatedAt": "2026-01-06T05:46:15.532Z"
    }
  ]
}
```

---

### `GET /api/admin/constrained-quotas`

Returns all constrained quotas from `CONSTRAINED_QUOTAS`, ordered by
`quota_name, region`.

**Query params:** _none_

**Response:**

```json
{
  "data": [
    {
      "quotaName": "standardEDSv5Family",
      "region": "eastus2",
      "incrementPercent": 10,
      "createdAt": "2025-12-01T10:00:00Z",
      "lastUpdated": "2026-02-10T15:30:00Z"
    }
  ]
}
```
