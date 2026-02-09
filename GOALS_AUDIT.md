# Goals Coverage Audit

This document checks the requested portfolio-tracker goals against the current implementation in this repository.

## Overall Verdict

Current project is a **frontend MVP** that implements part of the goals (core BUY/SELL flow, average-cost engine, holdings, realized/unrealized P/L, allocation chart, and manual price refresh), but **does not yet satisfy all requested goals**.

## Goal-by-goal status

| Area | Status | Notes |
|---|---|---|
| Add/Delete transactions | ✅ Partial | Add and delete exist in UI. |
| Edit transactions | ❌ Missing | No edit action in transactions table/modal. |
| Open holdings tracking | ✅ Implemented | Computed from transaction engine and shown in Holdings page. |
| Closed positions tracking + realized P/L | ✅ Implemented | Closed positions and realized P/L shown on Dashboard. |
| Portfolio performance over time charts | ❌ Missing | Allocation chart exists, but no equity curve time-series chart. |
| Refresh market prices manually | ✅ Implemented | "Refresh Prices" button fetches Yahoo Finance prices. |
| Historical market prices | ❌ Missing | Only latest price fetch implemented. |
| Caching in DB `prices_cache` table | ❌ Missing | Uses browser localStorage, not DB table. |
| Provider failure fallback status message | ❌ Missing | Error logged to console, no explicit stale-price status UI. |
| Prevent sell > held shares | ✅ Implemented | Validation present in transaction modal. |
| Multiple partial buys/sells | ✅ Implemented | Engine supports cumulative BUY/SELL with partial exits. |
| Fees affecting cost basis and realized P/L | ✅ Implemented | Fees included in buy cost and sell proceeds. |
| Ticker-level KPIs (all requested) | ⚠️ Mostly | Missing explicit "Total P/L" column per ticker in UI. |
| Portfolio KPIs (all requested) | ⚠️ Partial | Several present; missing best/worst performer, range-based realized P/L, equity curve. |
| Monthly realized P/L breakdown | ❌ Missing | Not implemented. |
| Transactions filters (ticker/date/type) | ⚠️ Partial | Only text search by ticker/type; no date-range filters. |
| Preferred stack (Next.js + TS + Tailwind + Prisma + SQLite) | ❌ Different | Project uses React + Vite + localStorage, no backend ORM/DB. |
| Required DB models | ❌ Missing | No DB schema/models in project. |

## What is already solid

- Average cost accounting logic in `services/engine.ts` aligns with the requested formulas.
- Transaction form includes required fields except currency is fixed to USD (still stored).
- Core portfolio screens (Dashboard / Transactions / Holdings) are usable for MVP tracking.

## Highest-priority gaps to close

1. Add a real backend + SQLite schema for `transactions`, `prices_cache`, `portfolio_snapshots` (and optional `holdings_state`).
2. Add transaction edit + advanced filters (ticker/date/type).
3. Add equity curve snapshots and chart.
4. Add provider-failure UI with "last cached" timestamp/source.
5. Add portfolio analytics: best/worst performer and range-based realized P/L.
