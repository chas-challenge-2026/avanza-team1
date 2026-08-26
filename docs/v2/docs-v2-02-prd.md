# Product Requirements Document — Avanza Portfolio Health v2

**Version:** 1.0  
**Date:** 2026-08-26  
**Status:** Draft for team approval  
**Author:** BMAD Product Manager, on behalf of Chas Academy Avanza Team 1  
**Based on:** `01-project-brief.md` v1.0, team MVP, v1 repo, course plan  
**Related files:** `00-index.md`, `03-architecture.md`, `04-api-contract.md`, `07-epics-and-stories.md`

---

## 1. Introduction

This PRD specifies the **MVP** of Portfolio Health: a brownfield evolution of the inherited Avanza Portföljhälsa v1 app.

The product helps a logged-in customer see one portfolio picture in SEK, compare it with a target asset-class mix they set themselves, and notice when live weights have drifted by more than **5%**. It informs. It does not advise.

School document `docs/v2-targets.md` is **not** the requirement list for this PRD. Items from that file appear here only when they are needed for the core flow or for a professional, gradable delivery.

---

## 2. Product principles

1. **Control over cleverness.** One overview beats five analytics widgets.
2. **One rule, one number.** Drift threshold is 5% in every layer.
3. **Visible basis.** If a figure is converted or classified, the UI can say how.
4. **Information, not advice.** No “you should sell X”.
5. **Contracts before code.** JS, Java, and C/C++ integrate through written contracts.
6. **Honest scope.** Missing Pension, approximate FX, or a Java fallback is allowed if documented.
7. **Traceable work.** Requirements are written so they can become named stories.

---

## 3. Users and jobs-to-be-done

| User               | Job                                                         | MVP outcome                                          |
| ------------------ | ----------------------------------------------------------- | ---------------------------------------------------- |
| Anna (beginner)    | Understand what I hold and whether it still matches my plan | Login → one view → target → indicator                |
| Erik (experienced) | Trust the aggregation and FX enough to use the signal       | Same flow, visible FX as-of and classification rules |
| Team / examiners   | See a stable demo and individual contribution               | DoD artifacts + explainable slices                   |

---

## 4. Definitions

| Term                    | Meaning in this PRD                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Holding**             | A position on an account: ticker, name, quantity, average price, currency                                                                                    |
| **Account type in MVP** | `ISK`, `KF`, `DEPA` (custody). `PENSION` is out of MVP                                                                                                       |
| **Asset class**         | `EQUITY`, `FUND`, `OTHER`                                                                                                                                    |
| **Target allocation**   | User-set percentages for EQUITY and FUND that sum to 100%. OTHER is not a target bucket; it is flagged separately if present                                 |
| **Live allocation**     | Market value of EQUITY and FUND holdings in SEK, each as % of (EQUITY + FUND) market value. OTHER is excluded from the 60/40 maths and shown as a side note  |
| **Drift**               | Absolute difference in percentage points between live EQUITY % and target EQUITY % (equivalent for FUND). Example: target 60/40, live 68/32 → drift **8 pp** |
| **Threshold**           | **5 percentage points**. Drift ≥ 5 → indicator active                                                                                                        |
| **FX rate**             | Factor used to convert a holding currency to SEK. Must have a source label and an as-of date/time                                                            |
| **Advice**              | Any wording that tells the user to buy, sell, or rebalance a named instrument                                                                                |

Classification starter rule (until a richer map exists):

- Tickers that are common single-name stocks (e.g. `ERIC-B`, `VOLV-B`, `AAPL`, `SWED-A`, `SAND`) → `EQUITY`
- Known funds (none in current seed) → `FUND`
- Anything unclassified → `OTHER` (visible, not silently dropped)

v1 seed has only equity-like names. For a credible 60/40 demo the team **must** add at least one FUND holding (and/or a classification table) in a Flyway/seed change. That is an MVP data requirement, not polish.

---

## 5. MVP user journey

1. User opens the app and logs in with email + password.
2. On success, user lands on **Portfolio overview**.
3. Overview shows:
   - total value in SEK
   - breakdown by account type (ISK / KF / Depå)
   - breakdown by asset class (Equity / Fund / Other)
   - FX as-of line
   - target mix vs live mix
   - drift indicator (ok / drifted), using 5%
4. User opens **Target allocation**, sets Equity % / Fund % (default suggestion 60/40, user-editable), saves.
5. Overview refreshes against the new target.
6. User can log out.

Holdings list may be reachable for transparency and for demo of data, but is not the primary journey.

---

## 6. Functional requirements

Priority: **P0** = MVP must, **P1** = should if time before week 8, **P2** = later.

### 6.1 Authentication

| ID        | Requirement                                                                                                                                        | Pri |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| FR-AUTH-1 | User can log in with email and password                                                                                                            | P0  |
| FR-AUTH-2 | Invalid credentials return a safe, generic error (no user enumeration beyond what v1 already does is acceptable; do not print SQL or stack traces) | P0  |
| FR-AUTH-3 | Unauthenticated requests to portfolio/target/holdings APIs are rejected                                                                            | P0  |
| FR-AUTH-4 | User can log out and cannot keep using portfolio APIs with the old credential                                                                      | P0  |
| FR-AUTH-5 | Passwords are stored with a modern hash (BCrypt or equivalent). MD5 is removed for new verifications                                               | P0  |
| FR-AUTH-6 | Login query is parameterised. String-concatenated SQL is gone                                                                                      | P0  |
| FR-AUTH-7 | Demo users Anna and Erik still work after seed/migration (password may be reset in seed; README must list current credentials)                     | P0  |

### 6.2 Portfolio overview

| ID       | Requirement                                                                                        | Pri |
| -------- | -------------------------------------------------------------------------------------------------- | --- |
| FR-PF-1  | Logged-in user sees holdings from **their** accounts only                                          | P0  |
| FR-PF-2  | Overview includes ISK, KF, and Depå when the user has those accounts                               | P0  |
| FR-PF-3  | Total market value is shown in SEK                                                                 | P0  |
| FR-PF-4  | Each foreign-currency holding is converted with the current FX table/feed, not a scattered literal | P0  |
| FR-PF-5  | UI shows FX source + as-of                                                                         | P0  |
| FR-PF-6  | Overview shows value by account type                                                               | P0  |
| FR-PF-7  | Overview shows value by asset class (EQUITY / FUND / OTHER)                                        | P0  |
| FR-PF-8  | Overview shows live vs target allocation for EQUITY and FUND                                       | P0  |
| FR-PF-9  | Empty portfolio has an explicit empty state, not a blank crash                                     | P0  |
| FR-PF-10 | Pension is not shown as an empty fake account. If mentioned at all, it is labelled as out of scope | P0  |

### 6.3 Target allocation

| ID      | Requirement                                                                                                                                               | Pri |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| FR-TA-1 | User can view their current target                                                                                                                        | P0  |
| FR-TA-2 | User can set Equity % and Fund %                                                                                                                          | P0  |
| FR-TA-3 | Equity % + Fund % must equal 100. Server rejects other sums                                                                                               | P0  |
| FR-TA-4 | Values are numeric, 0–100 inclusive                                                                                                                       | P0  |
| FR-TA-5 | Target is stored per user (one portfolio-level target in MVP)                                                                                             | P0  |
| FR-TA-6 | If no target exists, UI prompts to set one and does not invent a silent 60/40 in the database without user action. A **display hint** of 60/40 is allowed | P0  |
| FR-TA-7 | Saving a target immediately affects drift on the next overview fetch                                                                                      | P0  |

### 6.4 Drift indicator

| ID      | Requirement                                                                                 | Pri |
| ------- | ------------------------------------------------------------------------------------------- | --- |
| FR-DR-1 | Drift = abs(liveEquityPct − targetEquityPct) in percentage points                           | P0  |
| FR-DR-2 | Indicator is inactive when drift < 5                                                        | P0  |
| FR-DR-3 | Indicator is active when drift ≥ 5                                                          | P0  |
| FR-DR-4 | The same threshold constant is used in API, UI, alerts (if shown), and native module        | P0  |
| FR-DR-5 | UI states are at least: `no-target`, `on-track`, `drifted`                                  | P0  |
| FR-DR-6 | Drifted copy explains the gap in numbers. It does **not** name instruments to sell          | P0  |
| FR-DR-7 | If OTHER value exists, UI notes that those holdings are excluded from the 60/40 calculation | P1  |
| FR-DR-8 | Optional alerts list may show drift events, but only with the 5% rule                       | P1  |

### 6.5 Holdings and classification

| ID     | Requirement                                                           | Pri                                 |
| ------ | --------------------------------------------------------------------- | ----------------------------------- |
| FR-H-1 | System can list the current user’s holdings                           | P0                                  |
| FR-H-2 | Each holding has an asset class used in aggregation                   | P0                                  |
| FR-H-3 | Seed/demo data includes both EQUITY and FUND so 60/40 is demonstrable | P0                                  |
| FR-H-4 | Create/delete holding may exist for demo/admin                        | P1                                  |
| FR-H-5 | Delete holding (if exposed) is ownership-checked (no IDOR)            | P0 if endpoint exists               |
| FR-H-6 | Pagination of holdings list                                           | P2 (not required to demo core flow) |

### 6.6 FX

| ID      | Requirement                                                                    | Pri |
| ------- | ------------------------------------------------------------------------------ | --- |
| FR-FX-1 | Supported holding currencies in MVP: SEK and USD at minimum                    | P0  |
| FR-FX-2 | One FX provider module/service owns all rates                                  | P0  |
| FR-FX-3 | Rate responses include `from`, `to`, `rate`, `source`, `asOf`                  | P0  |
| FR-FX-4 | Missing rate fails loudly in API (error field) rather than defaulting to 10.45 | P0  |
| FR-FX-5 | Additional currencies (EUR, NOK, …)                                            | P2  |

### 6.7 Native module

| ID       | Requirement                                                                                  | Pri                                    |
| -------- | -------------------------------------------------------------------------------------------- | -------------------------------------- |
| FR-NAT-1 | A C/C++ library can compute drift (or one documented risk metric) from simple numeric inputs | P0 for “module exists and is testable” |
| FR-NAT-2 | Automated tests run on the native library without the web app                                | P0                                     |
| FR-NAT-3 | README in `native/` explains build, test, and what the function means                        | P0                                     |
| FR-NAT-4 | Java can call the library **or** use a documented fallback that implements the same rule     | P0 (integration itself may be P1)      |
| FR-NAT-5 | Backtest engine and FX pipeline as separate native modules                                   | P2                                     |

### 6.8 Advice boundary

| ID       | Requirement                                                              | Pri |
| -------- | ------------------------------------------------------------------------ | --- |
| FR-ADV-1 | UI and API messages never instruct a trade                               | P0  |
| FR-ADV-2 | Allowed: “Your equity share is 8 pp above your 60% target.”              | P0  |
| FR-ADV-3 | Forbidden examples: “Sell AAPL”, “Rebalance now”, “You should buy funds” | P0  |
| FR-ADV-4 | Overview includes a short disclaimer that figures are informational      | P0  |

### 6.9 Documentation and operability (product, not just course)

| ID       | Requirement                                                           | Pri |
| -------- | --------------------------------------------------------------------- | --- |
| FR-DOC-1 | Root README can start the app from a clean checkout                   | P0  |
| FR-DOC-2 | README lists credentials, ports, test command, known gaps, scope cuts | P0  |
| FR-DOC-3 | Decision log contains allocation model, threshold, FX, auth, native   | P0  |
| FR-DOC-4 | Test status file is dated and matches reality                         | P0  |
| FR-DOC-5 | AI usage that affected decisions, code, or analysis is logged         | P0  |

---

## 7. Non-functional requirements

Sized to a student MVP, not a bank SLA.

| ID          | Requirement                                                                                                                                           | Pri |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| NFR-SEC-1   | No SQL injection on login or other query paths we touch                                                                                               | P0  |
| NFR-SEC-2   | No IDOR on delete/update endpoints we expose                                                                                                          | P0  |
| NFR-SEC-3   | No stack traces or SQL in responses                                                                                                                   | P0  |
| NFR-SEC-4   | Secrets not committed (DB passwords in env / compose as already patterned)                                                                            | P0  |
| NFR-REL-1   | Core flow demoable after `docker compose up --build`                                                                                                  | P0  |
| NFR-REL-2   | Frontend is served from the same deployable `app` image (`DRIFT.md`)                                                                                  | P0  |
| NFR-REL-3   | Platform compose rules are not broken (`expose`, service name `app`)                                                                                  | P0  |
| NFR-UX-1    | Core flow usable on a laptop browser at 1280px wide                                                                                                   | P0  |
| NFR-UX-2    | Language in UI: Swedish is acceptable for customer-facing copy; code and this pack stay English. Pick one UI language and keep it                     | P0  |
| NFR-UX-3    | Loading and error states exist on overview and login                                                                                                  | P0  |
| NFR-QA-1    | Automated tests exist for: login happy/sad path (API or service), drift maths (unit), FX conversion of one USD holding, target validation (sum ≠ 100) | P0  |
| NFR-QA-2    | Manual test script for the five-step demo exists in `12-test-status.md`                                                                               | P0  |
| NFR-QA-3    | 80% coverage / k6 / ZAP as release gates                                                                                                              | P2  |
| NFR-PERF-1  | Overview for seed-sized data responds fast enough for a live demo (guideline: under 2 seconds locally)                                                | P0  |
| NFR-PERF-2  | 10 000 holdings / 100 users load test                                                                                                                 | P2  |
| NFR-MAINT-1 | Business rules live outside controllers (service layer or equivalent)                                                                                 | P0  |
| NFR-MAINT-2 | Threshold and asset-class mapping live in one place each                                                                                              | P0  |

---

## 8. Requirements we explicitly reject for MVP

| Item from school v2-targets or case extras | Status                                                                                                 |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Java 21 virtual threads as a must          | Optional upgrade, not a story blocker                                                                  |
| Spring Boot 3.2 as a must                  | Allowed and recommended if the Java pair can do it without burning week 3–4; not a product requirement |
| Three native modules                       | Rejected                                                                                               |
| Auto-rebalance                             | Rejected                                                                                               |
| Historical strategy timeline               | Rejected                                                                                               |
| Scenario lab                               | Rejected                                                                                               |
| Pension aggregation                        | Rejected until seed + story exists                                                                     |
| Pixel-perfect Avanza brand clone           | Rejected                                                                                               |

---

## 9. Data implications (product view)

Minimum data the product needs:

- `users` with a modern password field (migration from `password_md5`)
- `accounts` belonging to a user
- `holdings` with currency and enough fields to value a position
- **market price source** for each ticker (table or service). v1 hardcodes prices in controllers; MVP needs one lookup
- `fx_rates` or equivalent
- `asset_class` on holding or on instrument
- `target_allocations` **per user** with equity_pct / fund_pct (replace or stop using account-type targets for the indicator)

Pricing honesty: live exchange prices are not required. A dated internal price table is enough if README says so. Inventing three different price maps again is not allowed.

---

## 10. Acceptance of the MVP as a whole

The MVP is accepted when all of the following are true:

1. Anna can complete the five-step journey on a built environment.
2. Totals are in SEK; USD is converted; source/as-of is visible.
3. A target of 60/40 can be saved and shown against live weights.
4. Crossing 5% turns the indicator on; going below turns it off (demonstrable with seed or a fixture).
5. Copy stays on the information side of the advice line.
6. FR-AUTH security minimums hold.
7. Native module is buildable and tested, with integration or fallback documented.
8. README, decision log, and test status match the build.
9. Each teammate can point to at least one P0 slice they own.

---

## 11. Out-of-scope backlog (parking lot)

Keep here so ideas are not lost and not started:

- Pension accounts
- EUR and other FX pairs
- Per-account targets
- Alerts centre as a product, not a dump of v1 HTML
- Holdings CRUD as a customer feature
- Backtest “what if I had rebalanced monthly”
- Sharpe / max drawdown as customer-facing metrics
- Mobile-native app
- Bank-grade market data

---

## 12. Traceability to course goals (summary)

Full table lives in `13-course-goals-map.md`. Short version:

- Knowledge 1–6, 9 ↔ this PRD + architecture + demo narrative
- Knowledge 7–8 ↔ AI log + ability to explain generated drafts
- Skills 10–21 ↔ stories, estimates, reviews, docs, presentation
- Competences / VG extras ↔ only if quality is already there; not extra scope

---

## 13. Open items carried from the brief

Recommendations now **promoted to PRD defaults**:

| Topic         | Default in this PRD                                               |
| ------------- | ----------------------------------------------------------------- |
| Asset classes | EQUITY / FUND + OTHER                                             |
| Target grain  | One mix per user                                                  |
| Drift formula | abs(live equity % − target equity %)                              |
| Threshold     | 5 pp                                                              |
| Demo data     | Must include a fund position                                      |
| Auth style    | Left to architecture (JWT _or_ session), security FRs still apply |
| UI language   | Team picks Swedish or English in UX spec; one language only       |
| FX            | Single service; dated table allowed                               |

---

## 14. Next document

`03-architecture.md` — how v1 becomes layered services, where React sits, how drift and FX are computed, and how the native library plugs in.

---

## 15. AI disclosure

Drafted with BMAD Fullstack Team assistance (Grok / BMad Orchestrator) on 2026-08-26. Team reviews before stories are created from these IDs.
