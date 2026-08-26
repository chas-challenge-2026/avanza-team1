# Project Brief — Avanza Portfolio Health v2

**Version:** 1.0  
**Date:** 2026-08-26  
**Status:** Draft for team approval  
**Author:** BMAD Analyst / Orchestrator, on behalf of Chas Academy Avanza Team 1  
**Based on:** Customer case text, team MVP, course plan, v1 repo docs  
**Related files:** `00-index.md`, `02-prd.md`

---

## 1. Executive summary

Avanza customers with growing, multi-account, multi-currency portfolios often lose track of _composition_ and _change_. They can see a total in kronor, but not whether the live mix still matches the plan they once chose, or whether FX — not their own decisions — moved the risk.

This project takes an inherited v1 internal app (“Avanza Portföljhälsa”) and delivers a **v2 MVP**: login, one consolidated portfolio view in SEK with explicit FX, a user-set target allocation (asset-class, e.g. 60/40), and a single drift indicator at a **5%** threshold.

We are a mixed student team (JavaScript, Java, C/C++). The product must stay demoable and explainable. We do not give personal investment advice. We do not auto-rebalance. We do not implement the school’s full maximum v2 catalogue in this phase.

---

## 2. Problem

### 2.1 The pain

Savings become large and messy. Customers lack a single picture of:

- risk level and mix between asset classes
- how the strategy has changed over time
- the effect of markets and currencies

**Anna example (from the case):** she knows the total, not what is equities vs funds, and not how USD moves the number. More customers hold foreign names. A portfolio can drift from 60/40 to 75/25 without a conscious decision. Risk changes in the background.

Customers want more than a balance:

- why value moved
- which risks they are actually running
- how money is distributed
- **when something material has changed**
- one picture of the whole portfolio

### 2.2 What they do today

When the in-app picture is weak, people leave: CSV export, spreadsheets, third-party risk and allocation tools, “what if I had another mix?” interest. Rebalancing — restoring the original mix after the market has moved the weights — is the operational heart of the pain. Avanza already has some fund-level tools. That is not enough across several accounts, several asset classes, and foreign holdings. The customer often does not notice that it is time to review.

### 2.3 What Avanza wants

Give the customer a clear view of **portfolio now vs original plan**, and a signal when the gap is large enough to _consider_ an action (for example rebalancing).

The win is **felt control**, not a research terminal:

- works for beginners and experienced investors
- clear whole-portfolio picture
- possible to notice change
- supports more informed decisions
- stays simple

### 2.4 Hard boundary

No personal investment advice. The product may inform. It may not tell the customer what to buy or sell.

### 2.5 Core question

How do we help customers with growing, complex portfolios understand their savings better, notice when the strategy has drifted, and keep a clear whole picture — without making the product too advanced?

---

## 3. Why this is a brownfield project

v1 already exists in `backend/AvanzaPortal`:

- Spring Boot 2.7 / Java 11 monolith
- Thymeleaf + Bootstrap 3
- SQL and business rules inside controllers
- PostgreSQL 12 + seed users Anna and Erik
- Intentional defects: SQL injection, MD5, IDOR, hardcoded FX `10.45`, 5% vs 7% drift threshold, no tests, no service layer

v1 _does_ already show accounts, holdings, a SEK total, some allocation-vs-target UI, and alerts. The target model in seed data is **per account type** (ISK 60% / KF 25% / custody 15%), which is **not** the MVP model. That mismatch is a first-class product risk and must be resolved in data + UI, not ignored.

The course wants a v1 → v2 story: analyse, prioritise, modernise, and be able to say what changed and why.

---

## 4. Goals

### 4.1 Product goals (MVP)

| ID  | Goal                                                    | Success signal                                                  |
| --- | ------------------------------------------------------- | --------------------------------------------------------------- |
| G-1 | One login-to-overview flow that a non-expert can follow | Demo without a scripted apology                                 |
| G-2 | Consolidated view across ISK, KF, custody               | User does not have to add accounts in their head                |
| G-3 | Totals in SEK with FX applied and visible               | Anna can see that USD holdings are converted, and on what basis |
| G-4 | User-owned target allocation by asset class             | User can set e.g. 60% equities / 40% funds                      |
| G-5 | Single drift rule at 5%                                 | Same number on overview and alerts                              |
| G-6 | Control without advice                                  | Copy never becomes a recommendation                             |

### 4.2 Team / course goals

| ID   | Goal                                                                 |
| ---- | -------------------------------------------------------------------- |
| G-7  | Each person can point to visible work (code, tests, docs, decisions) |
| G-8  | Contracts let JS, Java, and C/C++ work in parallel                   |
| G-9  | Documentation stays honest: scope, bugs, FX basis, fallback          |
| G-10 | AI use is logged and explainable                                     |
| G-11 | Pass (G) on the course. Competition rank is secondary                |

### 4.3 Non-goals (MVP)

Explicitly **out** unless the team later logs a scope increase:

- Personalised buy/sell advice or “you should rebalance now by selling X”
- Automatic order routing or auto-rebalance execution
- Full 5-year backtest engine
- Three native modules
- Pension accounts (not in current seed)
- Live multi-vendor market-data platform
- Historical “how did my strategy change over years” timeline
- Alternative-scenario lab (“how would 70/30 have performed”)
- School performance gates as hard release criteria (k6 P95, 80% coverage, ZAP clean)
- Pixel-perfect replica of avanza.se

These items may appear on a later/wishlist list in the PRD. They must not block the five-step core flow.

---

## 5. Users

### 5.1 Primary: Anna (beginner with a growing portfolio)

- Has ISK + maybe KF / custody
- Holds at least one USD name
- Understands “I wanted about 60/40” better than Sharpe or EWMA
- Needs plain language and one traffic-light / threshold message

### 5.2 Secondary: Erik (more experienced)

- Wants the same picture, plus confidence that FX and aggregation are not invented
- Will ask “where does the rate come from?” and “is this advice?”
- Still must not be offered a trading desk

### 5.3 Internal users (not product personas)

- Team members who must demo and explain
- Course examiners who grade individual contribution
- Challenge specialists (CTO, UX, Delivery) who send feedforward

---

## 6. Scope boundaries

### 6.1 In scope for MVP

- Authenticated session that is not trivially bypassed
- Read model: accounts + holdings → aggregated portfolio
- FX conversion to SEK with documented source and timestamp/as-of
- Target allocation create/update for the logged-in user (asset class)
- Drift calculation vs that target, threshold 5%
- UI: login, overview, set target, drift indicator, basic error/empty states
- README: install, run, test, known gaps, boundaries
- Decision log, test status, AI log
- One C/C++ module **or** documented Java fallback
- Mapping of work to course goals

### 6.2 Inherited v1 behaviour we keep only if it serves the MVP

- Seed users for demo (`anna@example.com` / `erik@example.com`)
- Ability to list holdings (needed for aggregation)
- Alerts as a _possible_ presentation of drift — only if they use the same 5% rule

Add/remove holding can stay as a thin admin/demo tool. It is not the customer pain. Do not spend the sprint on a brokerage UI.

### 6.3 Constraints

| Type         | Constraint                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| Time         | MVP by end of week 8 (5–9 Oct 2026). No project work on Fridays                                            |
| People       | 7 students, three languages, junior level                                                                  |
| Platform     | Must stay deployable under `DRIFT.md` (compose contract, `app` service, frontend baked into backend image) |
| Legal / case | No personal advice                                                                                         |
| Pedagogy     | Native part must be buildable and explainable even if integration slips                                    |
| Honesty      | Document known bugs we choose not to fix                                                                   |

---

## 7. Risks (first cut)

| ID   | Risk                                     | Impact                                | Mitigation                                          |
| ---- | ---------------------------------------- | ------------------------------------- | --------------------------------------------------- |
| R-1  | Three languages, no shared words         | Parallel work that does not integrate | API + native contracts before feature coding        |
| R-2  | v1 target model ≠ MVP asset-class model  | Wrong product, wasted UI              | Schema + mapping decision in architecture + stories |
| R-3  | FX “properly” becomes a research project | Missed overview                       | One source, cached/dated, good enough, documented   |
| R-4  | School v2-targets treated as mandatory   | Scope explosion                       | Index D-008 + this brief’s non-goals                |
| R-5  | Native module late                       | Demo hole                             | Java fallback is first-class, not a shame flag      |
| R-6  | Advice-like copy                         | Case fail / ethical miss              | UX spec banned phrases                              |
| R-7  | Individual work invisible                | Grade risk even if the app works      | Named stories, PL checklist, course-goals map       |
| R-8  | Deploy contract broken                   | Stage/prod red                        | Leave `infra/docker-compose.yml` rules intact       |
| R-9  | Threshold split returns (5 vs 7)         | Confusing demo                        | One constant shared by API, UI, native              |
| R-10 | Feedforward ignored                      | Extra work in weeks 7–9               | Decision log rows for each specialist film          |

---

## 8. Success criteria

### 8.1 Demo success (customer + course)

A teammate can, on a staged or local build:

1. Log in as Anna
2. Show one portfolio picture in SEK
3. Point at FX conversion without hand-waving
4. Show or set 60/40 (or equivalent)
5. Show the indicator on / off relative to 5%
6. Say what v1 did, what v2 changed, and what we deliberately did not build
7. Survive a failed live path with a fallback (recording, screenshots, local run)

### 8.2 Delivery success (course DoD for v2)

- Core flow works and can be shown
- README: install, run, test, known defects, boundaries
- Test status documented and sized to _our_ scope
- Decision log has the real forks (allocation model, FX, auth, native, threshold)
- Individual contribution is traceable
- Specialist feedforward that arrived has been processed (done / deferred / why)

### 8.3 What “good enough for G” looks like

Stable core flow + honest docs + visible individual work + ability to explain choices. Not a complete bank platform.

---

## 9. Proposed product name and framing

**UI name:** Portfolio Health  
**Swedish customer language when needed:** Portföljöversikt / Portföljhälsa

Positioning line (not a slogan for marketing polish):

> See your whole portfolio in SEK, compare it with the mix you intended, and notice when it has drifted — without being told what to trade.

---

## 10. Open questions (resolve in PRD / architecture if still open)

1. Which asset classes exist in MVP — two buckets (equities / funds) or three (equities / funds / other)?  
   **Recommendation:** two buckets + “other/unclassified” so unknown tickers do not silently vanish.
2. Is target one portfolio-level mix, or per account?  
   **Recommendation:** one portfolio-level mix for MVP (matches “samlad bild”).
3. Auth mechanism for the React app — JWT or server session + cookie?  
   Decide in architecture; both can meet MVP if CSRF/IDOR are handled.
4. FX source for demo — static dated table, Riksbanken/ECB fetch, or mocked endpoint?  
   **Recommendation:** start with a dated table or one official fetch + cache; never scatter literals in UI.
5. Who is PL in week 2?

If the team disagrees with a recommendation, log the alternative in `10-decision-log.md` and update `00-index.md`.

---

## 11. Immediate next document

`02-prd.md` — turns this brief into numbered requirements the stories can quote.

---

## 12. AI disclosure

Drafted with BMAD Fullstack Team assistance (Grok / BMad Orchestrator) on 2026-08-26 from the customer case, team MVP text, course instructions, and v1 repository documentation. Team must accept or amend before implementation.
