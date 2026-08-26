# Architecture — Avanza Portfolio Health v2

**Version:** 1.0  
**Date:** 2026-08-26  
**Status:** Draft for team approval  
**Author:** BMAD Architect, on behalf of Chas Academy Avanza Team 1  
**Based on:** `02-prd.md` v1.0, v1 repo, `DRIFT.md`, `docs/architecture.md`  
**Related files:** `04-api-contract.md`, `05-native-contract.md`

---

## 1. Purpose

This document describes the **target architecture for the MVP**, and how it differs from v1. It is written so that:

- Java can build the API without knowing React
- JavaScript can build the UI against a contract without reading Java
- C/C++ can build a library against a numeric API without knowing Spring
- The deploy platform rules in `DRIFT.md` stay intact

Detailed JSON shapes live in `04-api-contract.md`. Native function signatures live in `05-native-contract.md`.

---

## 2. Current state (v1)

```
Browser
  └─ HTTP form posts / page loads
       └─ Spring Boot 2.7 (Java 11), port 8082
            ├─ AuthController      JdbcTemplate + MD5 + string-concat SQL
            ├─ DashboardController hardcoded FX 10.45, hardcoded prices, drift 5%
            ├─ HoldingController   delete without ownership check
            └─ AlertController     drift 7%, same hardcoded prices
                 └─ PostgreSQL 12
```

Views are Thymeleaf + Bootstrap 3 served by the same process. There is no public REST API, no service layer, no Flyway, no automated tests, no frontend package, and no native code.

Seed target allocations are **per account type**. MVP targets are **per user, per asset class**. Architecture must replace that model, not decorate it.

---

## 3. Target state (MVP)

```
Browser
  └─ React + TypeScript SPA (static files)
       └─ JSON / HTTP
            └─ Spring Boot API  (service name `app` in Compose)
                 ├─ Auth
                 ├─ Portfolio aggregation
                 ├─ Target allocation
                 ├─ FX + instrument price lookup
                 ├─ Drift calculation
                 │     ├─ Native C/C++ library (preferred when loaded)
                 │     └─ Java fallback (same rule)
                 ├─ Persistence (SQL via repository layer)
                 └─ PostgreSQL (Compose service)
```

Thymeleaf pages are **not** the v2 UI. They may remain in the repo during migration but are not the demo path.

Frontend is built in the **same Docker image** as the backend and served as static files (see `DRIFT.md`). There is no separate public frontend container.

---

## 4. Decisions

| ID    | Topic                  | Choice                                                         | Why                                                                                                            |
| ----- | ---------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| AD-1  | Style                  | Modular monolith, one deployable                               | Matches platform contract and team size                                                                        |
| AD-2  | UI                     | React + TypeScript SPA                                         | School direction + JS team lane                                                                                |
| AD-3  | API                    | REST JSON under `/api`                                         | Language-agnostic contract                                                                                     |
| AD-4  | Auth                   | Session cookie **or** JWT — pick one in AD-4a below            | Both can satisfy PRD if applied consistently                                                                   |
| AD-4a | Auth default           | **HTTP-only session cookie** after login                       | Simpler CSRF story if same-origin; less moving parts for a first SPA. Revisit JWT only if stage/prod forces it |
| AD-5  | Persistence            | Repository layer; JPA **or** JdbcTemplate behind interfaces    | Interface matters more than JPA vs JDBC for G. JPA + Flyway recommended if Java pair is comfortable            |
| AD-6  | Schema changes         | Versioned SQL migrations (Flyway recommended)                  | Seed.sql-only changes will fight deploy volumes                                                                |
| AD-7  | FX                     | One `FxService`                                                | Stops literal `10.45` from spreading again                                                                     |
| AD-8  | Prices                 | One `InstrumentPriceService` (dated table allowed)             | Stops three hardcoded maps                                                                                     |
| AD-9  | Drift                  | One `DriftCalculator` used by API; native first, Java fallback | One 5% rule                                                                                                    |
| AD-10 | Native                 | One shared library + JNA or equivalent                         | Course requires explainable C/C++; integration is best-effort                                                  |
| AD-11 | Java / Spring versions | Upgrade allowed (21 / 3.2) but **not** a gate for UI work      | Do not block React on a platform bump                                                                          |
| AD-12 | UI language            | Swedish customer copy                                          | Case is Swedish; this pack stays English                                                                       |

If AD-4a is rejected in favour of JWT, log it and update `04-api-contract.md` (Authorization header instead of cookie).

---

## 5. Repository layout (target)

```
avanza-team1/
├── backend/AvanzaPortal/     Java API + static/ for built SPA
├── frontend/                 React + TypeScript (new)
├── native/                   C/C++ library + tests + README
│   └── drift/                the one MVP module
├── infra/                    docker-compose.yml + override + migrations/seed
├── docs/                     v1 school docs (unchanged)
└── docs/v2/                  this pack
```

`frontend/` is new. Backend Dockerfile gains a multi-stage build: Node builds the SPA, files are copied into the Java image (for example `classpath:/static/` or an explicit static directory already used by Spring).

Do not add a second published port for the SPA in production compose.

---

## 6. Logical modules

### 6.1 Frontend (JS team)

Responsibilities:

- Login and logout screens
- Portfolio overview
- Target allocation form
- Drift indicator states: `no-target`, `on-track`, `drifted`
- Display of FX source/as-of and disclaimer
- Talking **only** to `/api/*` as defined in the contract

Not responsible for:

- SQL, hashing, JNA, Docker platform contract (beyond consuming the running app)
- Inventing percentages the API did not send

Suggested structure (not mandatory):

```
frontend/src/
  api/          typed client generated-by-hand from the contract
  features/
    auth/
    portfolio/
    target/
  components/
```

### 6.2 API / application (Java team)

Package by feature or by layer; pick one and stay consistent. Recommended feature slices:

| Slice        | Responsibility                              |
| ------------ | ------------------------------------------- |
| `auth`       | Login, logout, current user, password check |
| `portfolio`  | Aggregate holdings to overview DTO          |
| `allocation` | Read/write user target; validate 100%       |
| `market`     | Prices + FX                                 |
| `drift`      | Call native or fallback; apply 5% threshold |
| `shared`     | Errors, security helpers, config constants  |

Layering inside each slice:

```
Controller  →  Service  →  Repository / Gateway
                 └─ DriftCalculator
```

Controllers must not contain SQL or drift maths.

### 6.3 Native (C/C++ team)

One library, working name `libportfoliodrift`.

Input: live equity %, target equity %, threshold.  
Output: drift in percentage points, boolean `exceeded`, maybe a status code.

The library does **not** read the database, parse JSON, or call HTTP. That keeps it testable on a laptop with CMake/CTest only.

Java loads it with JNA (or JNI if the pair prefers; JNA is enough). If load fails, `DriftCalculator` uses the Java fallback and logs a clear line for the README.

---

## 7. Request flows

### 7.1 Login

```
SPA POST /api/auth/login { email, password }
  → AuthService verifies hash (BCrypt)
  → session created
  → 200 { user: { id, name, email } }
```

v1 form-post + Thymeleaf redirect is retired for the demo path.

### 7.2 Overview

```
SPA GET /api/portfolio
  → load user’s accounts + holdings
  → price each holding (InstrumentPriceService)
  → convert to SEK (FxService)
  → classify EQUITY / FUND / OTHER
  → sum by account type and by class
  → load target if any
  → drift = DriftCalculator(liveEquityPct, targetEquityPct, 5)
  → 200 overview JSON
```

Ownership: every query is filtered by the authenticated user id. No “give me holding 17” without an ownership check.

### 7.3 Save target

```
SPA PUT /api/portfolio/target { equityPercent, fundPercent }
  → validate 0–100 and sum == 100
  → upsert row for user
  → 200 current target
```

Next GET `/api/portfolio` uses the new target.

### 7.4 Native call (optional on the path)

```
DriftCalculator
  if native library loaded:
       native_compute(live, target, 5.0)
  else:
       java_compute(live, target, 5.0)
```

Both implementations must match fixtures in `05-native-contract.md`.

---

## 8. Data model (logical)

### 8.1 Keep from v1

- `users`
- `accounts` (`user_id`, `account_type`, `account_name`, `currency`)
- `holdings` (`account_id`, `ticker`, `instrument_name`, `quantity`, `avg_buy_price`, `currency`)
- `alerts` (optional for P1)

### 8.2 Change

| Change                                                                               | Reason                      |
| ------------------------------------------------------------------------------------ | --------------------------- |
| Replace `users.password_md5` with `password_hash` (or add column and stop using MD5) | FR-AUTH-5                   |
| Stop using `target_allocations.account_type` for the indicator                       | Wrong product model         |
| New `user_targets(user_id unique, equity_pct, fund_pct, updated_at)`                 | FR-TA-5                     |
| New `instrument_ref(ticker pk, name, asset_class, currency)`                         | Classification + demo funds |
| New `instrument_prices(ticker, price, currency, as_of, source)`                      | One price list              |
| New `fx_rates(from_ccy, to_ccy, rate, as_of, source)`                                | One FX list                 |

Holdings stay thin. Classification and prices live on reference tables so a new ticker does not require a controller edit.

### 8.3 Valuation rule

```
market_value_native = quantity * price_in_holding_currency
market_value_sek    = market_value_native * fx(holding_currency → SEK)
```

If holding currency is SEK, FX rate is 1 and still reported with source `identity`.

If price or FX is missing: exclude the holding from totals **and** list it under `unvaluedHoldings` in the API so the UI can show a warning. Do not silently use 10.45 or 0.

### 8.4 Allocation rule

```
basis          = value_sek(EQUITY) + value_sek(FUND)
liveEquityPct  = 100 * value_sek(EQUITY) / basis     (if basis > 0)
liveFundPct    = 100 - liveEquityPct
otherSek       = value_sek(OTHER) + unvalued
driftPp        = abs(liveEquityPct - targetEquityPct)
exceeded       = targetExists && driftPp >= 5
```

If `basis == 0`, state is `no-basis` (no indicator maths).

---

## 9. Security architecture (minimum)

| Threat in v1              | MVP control                                                                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SQL injection on login    | Parameterised queries / JPA                                                                                                                                         |
| MD5                       | BCrypt (or equivalent)                                                                                                                                              |
| IDOR delete holding/alert | Filter by current user; tests for “cannot delete other’s row”                                                                                                       |
| Session forever           | Reasonable session timeout in config                                                                                                                                |
| CSRF on cookie session    | Same-origin SPA + Spring CSRF token **or** custom header check. If this is too heavy for week 3, document the residual risk and keep all mutating calls same-origin |
| Stack traces to browser   | Global API error handler                                                                                                                                            |
| Advice leakage            | Copy review in UX spec; API `message` fields stay descriptive                                                                                                       |

Do not build a full OAuth/IdP. Demo users in seed are enough.

---

## 10. Error model

API errors are JSON, not HTML error pages, for `/api/*`.

```
{
  "error": "VALIDATION",
  "message": "equityPercent + fundPercent must equal 100",
  "details": {}
}
```

Suggested codes: `UNAUTHORIZED`, `FORBIDDEN`, `VALIDATION`, `NOT_FOUND`, `UNVALUED_MARKET_DATA`, `INTERNAL`.

SPA never renders raw exception text.

---

## 11. Configuration

Move magic numbers to config:

| Key                                 | Value            |
| ----------------------------------- | ---------------- |
| `portfolio.drift.threshold-percent` | `5.0`            |
| `portfolio.fx.base`                 | `SEK`            |
| `native.library-name`               | `portfoliodrift` |
| `native.enabled`                    | `true`/`false`   |

`native.enabled=false` forces the Java fallback (useful on Windows if `.so` load is painful during early sprints).

---

## 12. Build and deploy

Local:

```
infra/docker compose up --build
```

Override file keeps the published localhost port (v1 uses 8082). Do not put `ports` in the shared `docker-compose.yml`.

CI/stage/prod: push `develop` → stage, `main` → prod. A failed build must not require compose contract changes.

Postgres major upgrade is a **process** (volume reset via school tech support). Do not sneak a 12 → 15 bump onto `main` the night before a demo.

---

## 13. Testing architecture

| Layer           | Who  | What                                                                      |
| --------------- | ---- | ------------------------------------------------------------------------- |
| Native unit     | C++  | Fixtures: 60 vs 60 → 0; 60 vs 68 → 8; threshold edge 5.0                  |
| Domain unit     | Java | Same fixtures on Java fallback; target sum validation; SEK conversion     |
| API test        | Java | Login fail/success; overview is scoped to user; PUT target 50/40 rejected |
| Component / RTL | JS   | Indicator states; form validation; login error surface                    |
| Manual script   | PL   | Five-step Anna journey in `12-test-status.md`                             |

Coverage percentage is not a gate. The four automated clusters above are.

---

## 14. Migration path (so work can start in parallel)

| Step | Outcome                                          | Unblocks                  |
| ---- | ------------------------------------------------ | ------------------------- |
| 0    | This doc + API contract merged                   | Everyone                  |
| 1    | `frontend/` skeleton + mock server from contract | JS                        |
| 2    | Auth API + hashed seed user                      | JS login against real API |
| 3    | Reference tables + seed fund + FX/price rows     | Aggregation               |
| 4    | `GET /api/portfolio` with Java drift fallback    | JS overview               |
| 5    | `PUT /api/portfolio/target`                      | JS target form            |
| 6    | Native lib + tests                               | C++ course requirement    |
| 7    | JNA hook behind a flag                           | Nice for CTO week         |
| 8    | Retire Thymeleaf from the demo path              | Cleaner demo              |

JS must not wait for step 7. C++ must not wait for React.

---

## 15. What we will tell specialists

**CTO:** modular monolith, one drift rule, native isolated behind an interface, fallback on purpose, FX/prices centralized, known residual CSRF if we ship cookie-auth without a full token setup.

**UX:** one page that answers “what do I have, what did I intend, has it moved?”. Numbers before charts. Disclaimer visible.

**Delivery:** compose contract untouched, demo path documented, Thursday fallback is a recorded walkthrough + local `compose up`.

---

## 16. Open architecture items

1. Confirm AD-4a (session cookie) with the Java pair this week.
2. Confirm Flyway vs hand-run SQL for the first schema change.
3. Confirm JNA vs JNI (default JNA).
4. Confirm where static SPA files are mounted in Spring (must be decided before Dockerfile work).

Log the answers in `10-decision-log.md`.

---

## 17. Next document

`04-api-contract.md` — the file the JS and Java groups should print and treat as law.

---

## 18. AI disclosure

Drafted with BMAD Fullstack Team assistance (Grok / BMad Orchestrator) on 2026-08-26 from v1 sources and PRD v1.0. Team must accept AD-1–AD-12 before implementation.
