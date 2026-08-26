# Epics and Stories — Portfolio Health MVP

**Version:** 1.0  
**Date:** 2026-08-26  
**Status:** Draft for team approval  
**Based on:** PRD, architecture, API contract, native contract, UX spec  
**How to use:** one GitHub issue per story. Copy the story id into the issue title.

Estimates are **relative points** (1 / 2 / 3 / 5 / 8). 1 ≈ half a workday for one person who already knows the slice. They are planning aids, not grades.

Owner is a **lane**, not a prison. Names in `08-team-board.md` take the lane.

---

## Epic map

| Epic | Goal | Lanes |
|---|---|---|
| E0 | Team rails: repo layout, branches, mocks, docs hygiene | All / PL |
| E1 | Auth that is safe enough for a demo | Java + JS |
| E2 | Reference data: classes, prices, FX, fund seed | Java |
| E3 | Portfolio overview API | Java |
| E4 | Target allocation API | Java |
| E5 | Overview + target UI | JS |
| E6 | Native drift module + fallback | C++ + Java |
| E7 | Quality, README, demo path | All |

P0 stories are required for the week-8 MVP. P1 is only after the core flow works. P2 stays in the parking lot.

---

## E0 — Team rails

### E0-S1  Scaffold frontend package  **P0**  **JS**  **3**

**As a** JS developer  
**I want** a `frontend/` app with routing for login, overview, target  
**So that** UI work can start against a mock.

**AC**

- Vite + React + TypeScript builds locally
- Routes exist; placeholder pages render
- README snippet: how to run frontend alone
- Vite proxy **or** documented CORS plan toward `:8082`

**Deps:** none  
**Visible contribution:** repo tree + run instructions

---

### E0-S2  Mock API from contract  **P0**  **JS**  **3**

**As a** JS developer  
**I want** fixtures for the four indicator states  
**So that** UI is not blocked by Spring.

**AC**

- Mock covers login, me, logout, GET portfolio, GET/PUT target
- Fixtures match `04-api-contract.md` section 9
- Toggle to drop mock when real API exists

**Deps:** E0-S1  
**Visible contribution:** fixture files

---

### E0-S3  Backend runnable + first migration path  **P0**  **Java**  **5**

**As a** Java developer  
**I want** v1 still running and a place for schema changes  
**So that** we do not edit `seed.sql` as if it were production.

**AC**

- `docker compose up --build` still serves the app
- Decision recorded: Flyway vs manual SQL
- Empty service/repository packages exist (no giant new feature required)

**Deps:** none  
**Visible contribution:** migration decision + package layout

---

### E0-S4  Issue hygiene  **P0**  **PL**  **1**

**As a** project lead  
**I want** these stories in the board with DoR fields  
**So that** sprint planning is mechanical.

**AC**

- GitHub issues (or equivalent) created for all P0 stories
- Labels: `lane:js` `lane:java` `lane:cpp` `lane:shared` `P0` `P1`

**Deps:** this file merged

---

## E1 — Auth

### E1-S1  Parameterised login + password hash  **P0**  **Java**  **5**

**PRD:** FR-AUTH-5, FR-AUTH-6, NFR-SEC-1

**AC**

- Login SQL is parameterised
- Password verify uses BCrypt (or logged equivalent)
- Seed users updated; README credentials updated
- Automated test: wrong password → 401; Anna → 200

**Deps:** E0-S3  
**Visible contribution:** AuthService + test + seed change

---

### E1-S2  Session API  **P0**  **Java**  **5**

**PRD:** FR-AUTH-1–4, FR-AUTH-7

**AC**

- `POST /api/auth/login|logout` and `GET /api/auth/me` match contract
- Unauthenticated `/api/portfolio` → 401
- Cookie or JWT matches architecture decision

**Deps:** E1-S1  
**Visible contribution:** API tests

---

### E1-S3  Login UI  **P0**  **JS**  **3**

**PRD:** FR-AUTH-1, UX 4.1

**AC**

- Form posts to contract
- Generic error string
- Success navigates to overview
- Password not stored in localStorage

**Deps:** E0-S1, mock or E1-S2  
**Visible contribution:** login feature

---

### E1-S4  Session restore + logout  **P0**  **JS**  **2**

**AC**

- Boot calls `/api/auth/me`
- 401 on API → `/login`
- Header logout works

**Deps:** E1-S3

---

## E2 — Reference data

### E2-S1  Instrument + price + FX tables  **P0**  **Java**  **5**

**PRD:** FR-FX-1–4, FR-H-2–3, section 9 PRD

**AC**

- Tickers map to EQUITY / FUND / OTHER
- At least one FUND in Anna’s seed
- USD/SEK rate stored with source + as-of
- Prices in one table/service
- No `10.45` literal left in controllers you still compile

**Deps:** E0-S3  
**Visible contribution:** migration + seed

---

### E2-S2  Market services  **P0**  **Java**  **3**

**AC**

- `FxService` and `InstrumentPriceService` are the only lookup points
- Missing price/FX reported, not defaulted

**Deps:** E2-S1

---

## E3 — Overview API

### E3-S1  Aggregation service  **P0**  **Java**  **8**

**PRD:** FR-PF-1–10, valuation rules in architecture

**AC**

- Values in SEK
- Splits by account type and asset class
- OTHER excluded from basis
- Unvalued holdings listed
- User isolation: Erik does not see Anna’s rows
- Unit tests for valuation + basis

**Deps:** E2-S2, E1-S2  
**Visible contribution:** PortfolioService

---

### E3-S2  `GET /api/portfolio`  **P0**  **Java**  **5**

**AC**

- Payload matches `04-api-contract.md` §5.4
- `target` is null when unset
- `drift.thresholdPercent === 5`
- `computedBy` present (fallback allowed)

**Deps:** E3-S1, E4-S1 (target read can stub null first), E6-S3 (fallback)

**Split tip:** ship first with `target: null` and `status: NO_TARGET` if E4 slips one day — then wire target.

---

### E3-S3  `GET /api/holdings`  **P1**  **Java**  **3**

**AC** — contract §5.7, ownership filter

---

## E4 — Target API

### E4-S1  Persist user target  **P0**  **Java**  **3**

**PRD:** FR-TA-1–7

**AC**

- Table `user_targets` (or equivalent)
- v1 account-type targets not used for indicator

**Deps:** E0-S3

---

### E4-S2  GET/PUT `/api/portfolio/target`  **P0**  **Java**  **3**

**AC**

- Sum ≠ 100 → 400
- Range errors → 400
- PUT then GET portfolio reflects new target

**Deps:** E4-S1, E3-S2

---

## E5 — UI

### E5-S1  App shell  **P0**  **JS**  **2**

**AC** — header, nav, logout slot, Swedish strings file

**Deps:** E0-S1

---

### E5-S2  Overview UI  **P0**  **JS**  **5**

**PRD:** FR-PF-*, UX 4.2 and 5

**AC**

- Renders total, breakdowns, FX line, disclaimer
- Four indicator states from fixtures
- No banned phrases
- Unvalued warning when array non-empty

**Deps:** E0-S2 or E3-S2, E5-S1

---

### E5-S3  Target UI  **P0**  **JS**  **3**

**AC**

- Sum gate
- Hint 60/40 is not auto-saved
- Save then overview updates (mock or live)

**Deps:** E5-S1, mock or E4-S2

---

### E5-S4  Holdings table  **P1**  **JS**  **3**

**Deps:** E3-S3, E5-S1

---

### E5-S5  Serve SPA from Spring image  **P0**  **JS + Java**  **5**

**NFR-REL-2**

**AC**

- Dockerfile multi-stage or equivalent
- Demo uses one origin
- Compose contract untouched

**Deps:** E0-S1, working API  
**Do this before week-8 demo, not on day one.**

---

## E6 — Native drift

### E6-S1  C library + fixtures F1–F10  **P0**  **C++**  **5**

**AC** — ABI in `05-native-contract.md`, shared lib builds on documented OS

**Deps:** none

---

### E6-S2  Native tests + README  **P0**  **C++**  **3**

**AC**

- E-fixtures + NULL out
- `ctest` (or documented runner) green
- `native/README.md` explains build/test/meaning

**Deps:** E6-S1

---

### E6-S3  Java fallback + same fixtures  **P0**  **Java**  **2**

**AC**

- Fallback used when lib missing
- Tests F1–F10 / E1–E3
- API `computedBy` is truthful

**Deps:** E3-S1

---

### E6-S4  JNA hook behind flag  **P1**  **Java + C++**  **5**

**AC**

- `native.enabled=true` + lib present → `computedBy: NATIVE`
- Load failure → fallback, request still 200

**Deps:** E6-S2, E6-S3

---

## E7 — Delivery quality

### E7-S1  README true  **P0**  **PL + all**  **3**

**AC** — install, run, test, credentials, gaps, pension out, FX source, fallback

---

### E7-S2  Manual demo script  **P0**  **PL**  **2**

**AC** — Anna five-step path in `12-test-status.md`, plus fallback if live fails

---

### E7-S3  IDOR audit on exposed writes  **P0**  **Java**  **3**

**AC** — if any delete/update exists, ownership test exists; if not exposed, write that in test-status

---

### E7-S4  Advice-copy review  **P0**  **JS + PL**  **1**

**AC** — grep UI strings against banned list

---

### E7-S5  Decision log + AI log filled  **P0**  **Everyone**  **2**

**AC** — rows for allocation model, threshold, FX, auth, native, AI drafts

---

## Suggested build order (ignore at your peril)

```
Week 2–3   E0, E1-S1/S2, E6-S1 start, E0-S1/S2 UI mock
Week 3–4   E1-S3/S4, E2, E6-S2
Week 4–5   E3-S1/S2, E4, E5-S1/S2
Week 5–6   E5-S3, E6-S3, E7-S3
Week 6–7   E5-S5, E6-S4 if time, CTO notes
Week 7–8   E7-S1/S2/S4/S5, harden demo
```

Parallelism: C++ never waits for React. JS never waits for JNA.

---

## Stories we will not open in MVP

- Pension accounts
- Pagination
- Alerts product
- Backtest native
- Holdings CRUD as a customer feature
- k6 / ZAP gates
- Dark mode

---

## Issue template (paste)

```md
### Story
E?-S?

### Lane
js | java | cpp | shared

### PRD refs


### Acceptance


### Deps


### Estimate

### Demo / grade note
What should an examiner look at?
```

---

## Next document

`08-team-board.md` — names on lanes and a week-by-week staffing sketch.

---

## AI disclosure

Drafted with BMAD Fullstack Team assistance (Grok / BMad Orchestrator) on 2026-08-26.
