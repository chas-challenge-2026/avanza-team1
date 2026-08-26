# API Contract — Avanza Portfolio Health v2

**Version:** 1.0  
**Date:** 2026-08-26  
**Status:** Draft for team approval  
**Consumers:** JavaScript frontend, Java backend  
**Based on:** `02-prd.md`, `03-architecture.md`  
**Breaking-change rule:** bump this version and tell both lanes the same day

---

## 1. Purpose

This file is the only agreement the JS and Java groups need in order to work in parallel.

- Frontend may mock these endpoints.
- Backend must match field names, types, status codes, and error shapes.
- C/C++ does **not** implement these endpoints. See `05-native-contract.md`.

---

## 2. General rules

| Rule | Value |
|---|---|
| Base URL (local) | `http://localhost:8082` (confirm against `infra/docker-compose.override.yml`) |
| API prefix | `/api` |
| Format | JSON, UTF-8 |
| Headers in | `Content-Type: application/json` on requests with a body |
| Headers out | `Content-Type: application/json` |
| Auth default | Session cookie after `POST /api/auth/login` (AD-4a) |
| Credentials | Browser `fetch` / axios must use `credentials: 'include'` |
| Date-time | ISO-8601 UTC, example `2026-08-26T08:00:00Z` |
| Decimals | JSON numbers, not strings. Percents are 0–100, not 0–1 |
| Money | JSON numbers. Display rounding is a UI concern. API sends 2–4 decimal honesty; 2 is enough for MVP |
| Field names | `camelCase` |
| Null | Use `null` for missing optional objects. Do not omit `target` — send `null` |
| HTML | `/api/*` never returns Thymeleaf |

If the team switches to JWT: send `Authorization: Bearer <token>` and ignore cookie text below. Log that in `10-decision-log.md`.

---

## 3. Error shape

Every non-success `/api/*` response uses:

```json
{
  "error": "VALIDATION",
  "message": "Human readable, safe to show",
  "details": {}
}
```

| HTTP | `error` code | When |
|---|---|---|
| 400 | `VALIDATION` | Bad body, sum ≠ 100, empty email |
| 401 | `UNAUTHORIZED` | No session / bad login |
| 403 | `FORBIDDEN` | Authenticated but not owner |
| 404 | `NOT_FOUND` | Unknown resource |
| 409 | `CONFLICT` | Reserved (e.g. duplicate) |
| 422 | `UNVALUED_MARKET_DATA` | Optional; prefer 200 + `unvaluedHoldings` on overview |
| 500 | `INTERNAL` | Unexpected |

`message` must never contain SQL, Java stack frames, or file paths.

Login failure: **401** + `UNAUTHORIZED` + generic message  
`"Invalid email or password"`.

---

## 4. Enums

`accountType`: `"ISK"` \| `"KF"` \| `"DEPA"`

`assetClass`: `"EQUITY"` \| `"FUND"` \| `"OTHER"`

`driftStatus`: `"NO_TARGET"` \| `"NO_BASIS"` \| `"ON_TRACK"` \| `"DRIFTED"`

`indicator`: `"hidden"` \| `"ok"` \| `"warn"`  
(UI helper mirroring status: hidden = no target or no basis, ok = on track, warn = drifted)

---

## 5. Endpoints

### 5.1 `POST /api/auth/login`

Unauthenticated.

**Request**

```json
{
  "email": "anna@example.com",
  "password": "password123"
}
```

**Response 200**

Sets session cookie (name is backend-defined; document the actual name in README when known, e.g. `JSESSIONID`).

```json
{
  "user": {
    "id": 1,
    "name": "Anna Lindqvist",
    "email": "anna@example.com"
  }
}
```

**Response 401** — invalid credentials  
**Response 400** — missing fields

---

### 5.2 `POST /api/auth/logout`

Authenticated (idempotent if already logged out: **204** or **200** with empty body is acceptable; pick **204**).

**Response 204** No Content. Session invalidated.

---

### 5.3 `GET /api/auth/me`

Authenticated.

**Response 200** — same `user` object as login  
**Response 401** — no session

Use this on SPA boot to restore the session.

---

### 5.4 `GET /api/portfolio`

Authenticated. **Primary overview payload.**

**Response 200**

```json
{
  "user": {
    "id": 1,
    "name": "Anna Lindqvist",
    "email": "anna@example.com"
  },
  "baseCurrency": "SEK",
  "asOf": "2026-08-26T08:00:00Z",
  "totals": {
    "totalSek": 248500.00,
    "equitySek": 180000.00,
    "fundSek": 68500.00,
    "otherSek": 0.00,
    "unvaluedSek": 0.00
  },
  "allocationBasisSek": 248500.00,
  "liveAllocation": {
    "equityPercent": 72.43,
    "fundPercent": 27.57
  },
  "target": {
    "equityPercent": 60.00,
    "fundPercent": 40.00,
    "updatedAt": "2026-08-26T07:10:00Z"
  },
  "drift": {
    "status": "DRIFTED",
    "indicator": "warn",
    "driftPercent": 12.43,
    "thresholdPercent": 5.00,
    "exceeded": true,
    "computedBy": "NATIVE"
  },
  "byAccountType": [
    { "accountType": "ISK", "accountName": "Anna ISK", "valueSek": 200000.00 },
    { "accountType": "KF", "accountName": "Anna KF", "valueSek": 48500.00 },
    { "accountType": "DEPA", "accountName": "Anna Depå", "valueSek": 0.00 }
  ],
  "byAssetClass": [
    { "assetClass": "EQUITY", "valueSek": 180000.00, "percentOfBasis": 72.43 },
    { "assetClass": "FUND", "valueSek": 68500.00, "percentOfBasis": 27.57 },
    { "assetClass": "OTHER", "valueSek": 0.00, "percentOfBasis": null }
  ],
  "fx": [
    {
      "from": "USD",
      "to": "SEK",
      "rate": 10.52,
      "source": "ECB",
      "asOf": "2026-08-25T16:00:00Z"
    },
    {
      "from": "SEK",
      "to": "SEK",
      "rate": 1,
      "source": "identity",
      "asOf": "2026-08-26T08:00:00Z"
    }
  ],
  "pricesSource": {
    "source": "internal-table",
    "asOf": "2026-08-25T16:00:00Z"
  },
  "disclaimer": "Siffrorna är information, inte råd. Vi rekommenderar inte köp eller sälj.",
  "unvaluedHoldings": [],
  "accounts": [
    {
      "id": 1,
      "accountType": "ISK",
      "accountName": "Anna ISK",
      "currency": "SEK"
    }
  ]
}
```

**Rules**

| Field | Rule |
|---|---|
| `target` | `null` if the user has never saved a target |
| `liveAllocation` | `null` if `allocationBasisSek === 0` |
| `allocationBasisSek` | EQUITY + FUND only |
| `drift.status` | `NO_TARGET` if `target` is null; `NO_BASIS` if basis is 0; else `ON_TRACK` or `DRIFTED` |
| `drift.driftPercent` | `null` when status is `NO_TARGET` or `NO_BASIS`; otherwise `abs(liveEquity − targetEquity)` |
| `drift.thresholdPercent` | Always `5.00` in MVP |
| `drift.computedBy` | `"NATIVE"` or `"JAVA_FALLBACK"` |
| `byAssetClass[].percentOfBasis` | `null` for OTHER |
| `unvaluedHoldings` | Array of `{ "ticker", "accountId", "reason" }` where reason is `"MISSING_PRICE"` or `"MISSING_FX"` |
| `fx` | Include every currency that appears on valued holdings, plus identity SEK |

Numbers above are examples, not fixtures. Seed values will differ once a fund row exists.

**Response 401** if not logged in.

---

### 5.5 `GET /api/portfolio/target`

Authenticated.

**Response 200 when set**

```json
{
  "equityPercent": 60.00,
  "fundPercent": 40.00,
  "updatedAt": "2026-08-26T07:10:00Z"
}
```

**Response 200 when missing**

```json
{
  "equityPercent": null,
  "fundPercent": null,
  "updatedAt": null
}
```

(Alternatively `target: null` wrapped; **do not mix**. This contract picks the flat object with nulls.)

---

### 5.6 `PUT /api/portfolio/target`

Authenticated.

**Request**

```json
{
  "equityPercent": 60,
  "fundPercent": 40
}
```

**Validation**

- both fields required
- numbers
- each `>= 0` and `<= 100`
- `equityPercent + fundPercent === 100` (allow 0.01 tolerance at most; prefer exact 100 from the UI)

**Response 200** — same shape as GET when set  
**Response 400** — sum/range errors  
**Response 401** — no session

There is no PATCH in MVP. Always send both percents.

---

### 5.7 `GET /api/holdings`

Authenticated. Transparency + demo. Not required to render the overview (overview is self-contained).

**Query (optional)**  
`accountId` — filter to one of the current user’s accounts.

**Response 200**

```json
{
  "items": [
    {
      "id": 1,
      "accountId": 1,
      "accountType": "ISK",
      "ticker": "ERIC-B",
      "instrumentName": "Ericsson B",
      "assetClass": "EQUITY",
      "quantity": 500,
      "avgBuyPrice": 68.50,
      "currency": "SEK",
      "price": 72.00,
      "priceCurrency": "SEK",
      "valueNative": 36000.00,
      "valueSek": 36000.00,
      "fxRate": 1,
      "valued": true
    },
    {
      "id": 3,
      "accountId": 1,
      "accountType": "ISK",
      "ticker": "AAPL",
      "instrumentName": "Apple Inc",
      "assetClass": "EQUITY",
      "quantity": 50,
      "avgBuyPrice": 165.00,
      "currency": "USD",
      "price": 190.00,
      "priceCurrency": "USD",
      "valueNative": 9500.00,
      "valueSek": 99940.00,
      "fxRate": 10.52,
      "valued": true
    }
  ]
}
```

No pagination in MVP. Do not add `page` until P2.

**Response 403** if `accountId` is not owned.

---

### 5.8 Not in MVP contract

Do not invent these until a story exists:

- `POST /api/accounts/{id}/holdings`
- `DELETE /api/holdings/{id}`
- `GET /api/alerts`
- `GET /api/market/price/{ticker}`
- `GET /api/market/fx/{from}/{to}`

If delete is exposed anyway, it **must** return 403 for another user’s holding and 204 on success. Add it to this file before JS calls it.

---

## 6. Frontend usage notes

### 6.1 Session

```ts
await fetch("/api/auth/login", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
});
```

All later calls: `credentials: "include"`.

### 6.2 Indicator mapping

Use `drift.status` / `drift.indicator` from the server. Do not recompute 5% in the UI except as a debug assert.

### 6.3 Copy

Show `disclaimer` as returned. Do not append “Sälj övervikten”.

### 6.4 No-target state

If `target === null` (overview) or percents are null (GET target): show CTA to set a target. A 60/40 *hint* in the form is allowed. Do not POST 60/40 without a click.

### 6.5 Mock before backend exists

A mock server (MSW, json-server, or a stub Express) should implement 5.1–5.7. Commit mock fixtures next to the frontend if useful. When the real API lands, delete the mock or put it behind a flag.

---

## 7. Backend implementation notes

- Overview is **one** round trip. Do not force the SPA to assemble totals from `/holdings`.
- `computedBy` must be truthful.
- Filter every query by `userId` from the session.
- Cookie session requires the SPA and API to be **same origin** in deploy (SPA served by Spring). In local dev, if Vite runs on :5173 and API on :8082, configure CORS + `Allow-Credentials` + explicit origin, or proxy Vite → 8082. **Preferred:** Vite proxy so the browser only talks to one origin.
- Document the chosen local-dev proxy in README when frontend exists.

---

## 8. Contract tests (minimum)

Java:

1. Login wrong password → 401, no session.
2. Login Anna → 200 + cookie; `GET /api/auth/me` → 200.
3. Erik cannot see Anna’s totals (create two sessions; compare `totals` / holdings ids).
4. PUT target `{60,30}` → 400.
5. PUT `{60,40}` → 200; GET portfolio `target.equityPercent === 60`.
6. Portfolio `drift.thresholdPercent === 5`.

JS:

1. Login form calls the path and stores no password in localStorage.
2. Overview renders `NO_TARGET`, `ON_TRACK`, `DRIFTED` from fixtures.
3. Target form refuses submit unless sum is 100.

---

## 9. Example state matrix for UI fixtures

| Fixture | `target` | basis | live equity % | `status` | `indicator` |
|---|---|---|---|---|---|
| A new user | `null` | > 0 | any | `NO_TARGET` | `hidden` |
| Empty portfolio | set or null | 0 | — | `NO_BASIS` | `hidden` |
| 60 vs 62 | 60/40 | > 0 | 62 | `ON_TRACK` | `ok` |
| 60 vs 65 | 60/40 | > 0 | 65 | `DRIFTED` | `warn` |
| 60 vs 55 | 60/40 | > 0 | 55 | `DRIFTED` | `warn` |

Edge: drift **exactly** 5.00 → `DRIFTED` (`>=` threshold).

---

## 10. Next document

`05-native-contract.md` — numeric API for the C/C++ module and the Java fallback fixtures (same numbers as section 9).

---

## 11. AI disclosure

Drafted with BMAD Fullstack Team assistance (Grok / BMad Orchestrator) on 2026-08-26. JS and Java should sign off field names before either side hard-codes them.
