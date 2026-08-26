# Documentation Index — Avanza Portfolio Health v2

**Product working name:** Portfolio Health (Portföljhälsa)  
**Customer:** Avanza (challenge case)  
**Team:** Chas Academy Team 1  
**Branch:** `docs/v2-planning`  
**Language of this pack:** English  
**Status:** Active  
**Last updated:** 2026-08-26  
**Owner of this file:** Product Owner / rotating Project Lead

---

## 1. How to use this pack

This folder is the team's shared source of truth for the brownfield move from v1 → MVP (v2 core).

Rules:

1. **Read before you code.** If a story is not in `07-epics-and-stories.md` and does not meet Definition of Ready, it is not started.
2. **Contracts beat hallway talk.** JavaScript talks to Java only through `04-api-contract.md`. C/C++ talks to Java only through `05-native-contract.md`.
3. **Decisions live in the decision log.** If the team chooses something, write it in `10-decision-log.md` the same day.
4. **Do not edit v1 school docs in place.** Keep `docs/architecture.md`, `docs/known-bugs.md`, `docs/v2-targets.md` and `docs/README-pain-points.md` as the inherited v1 baseline. This pack _interprets_ them for our MVP.
5. **Course grade first.** Competition placement is optional. Every artifact below maps to a course goal in `13-course-goals-map.md`.

Suggested first reading order for a new teammate (about 45 minutes):

1. This file
2. `01-project-brief.md`
3. `02-prd.md`
4. The contract for _your_ layer (`04`, `05`, or `06`)
5. `08-team-board.md` + the stories assigned to you in `07`

---

## 2. What we are building (one paragraph)

Many Avanza customers can see _how much_ they have, but not _how the portfolio is allocated_, _how FX moves the value_, or _when the live mix has drifted from the plan_. Our MVP lets a user log in, see one consolidated portfolio across savings types (values in SEK with FX applied), set a target allocation (for example 60/40), and get a clear indicator when drift passes a single agreed threshold. We do **not** give personal investment advice and we do **not** auto-rebalance.

---

## 3. Locked product decisions (start here)

These are team-approved starting points. Change them only via the decision log.

| ID    | Decision                | Value                                                                                                                                                            |
| ----- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-001 | Drift threshold         | **5%** everywhere (dashboard, alerts, native module). v1 used 5% and 7%; that inconsistency is a bug.                                                            |
| D-002 | Target allocation model | **Asset class** (e.g. equities / funds), not account type (ISK / KF / custody). v1 seed data is account-type based and must be migrated or remapped.             |
| D-003 | Account types in MVP    | ISK, KF, custody (Depå). **Pension is out of MVP** unless seed data is added later. Show it as a documented boundary, not a silent missing box.                  |
| D-004 | Advice boundary         | Inform and highlight drift. Never recommend _what to buy or sell_. Copy must stay on the information side of the line.                                           |
| D-005 | FX in MVP               | All displayed totals in **SEK**. At least one explicit FX source (even a dated table or a simple official feed). No more hardcoded `10.45` in three controllers. |
| D-006 | Native scope            | **One** C/C++ module (allocation drift or a single risk metric) + a Java fallback. Buildable, testable, explainable even if not fully wired on demo day.         |
| D-007 | MVP deadline            | End of course **week 8** (5–9 Oct 2026). Weeks 9–12 are stabilize, demo, rework.                                                                                 |
| D-008 | Grade target            | **Pass (G)**. VG-level precision is welcome if it does not inflate scope.                                                                                        |
| D-009 | Friday rule             | No project work on Fridays. That time is LIA / professional dialogue only.                                                                                       |

---

## 4. File map

| File                             | Purpose                                  | Primary readers        | When it is “done enough”                     |
| -------------------------------- | ---------------------------------------- | ---------------------- | -------------------------------------------- |
| `00-index.md`                    | Map, rules, locked decisions             | Everyone               | Always current                               |
| `01-project-brief.md`            | Pain, users, goals, non-goals            | Everyone               | Approved by team                             |
| `02-prd.md`                      | Functional + non-functional requirements | PM / PO / all builders | Stories can be sliced from it                |
| `03-architecture.md`             | Layers, data flow, v1 → v2 shape         | Java + JS + C++        | Each layer knows its boundary                |
| `04-api-contract.md`             | REST + JSON between React and Spring     | JS + Java              | Mockable without the other side              |
| `05-native-contract.md`          | C API, build, JNA, fallback              | C++ + Java             | Module can be compiled and unit-tested alone |
| `06-ux-spec.md`                  | Screens, states, copy, advice boundary   | JS + whole team        | Core flow can be drawn on a whiteboard       |
| `07-epics-and-stories.md`        | Backlog ready to become GitHub issues    | PL + everyone          | Every MVP story has AC, owner role, deps     |
| `08-team-board.md`               | Who owns what, by person and week        | Everyone               | No one is unsure what “their job” is         |
| `09-definition-of-ready-done.md` | DoR / DoD including course DoD           | Everyone               | Used in every sprint start                   |
| `10-decision-log.md`             | Why we chose X over Y                    | PL + examiners         | Updated the same day as the decision         |
| `11-ai-usage-log.md`             | Where AI influenced work                 | Everyone (individual)  | Each person can explain their own AI use     |
| `12-test-status.md`              | What is tested, what is not              | Whole team             | Honest and dated                             |
| `13-course-goals-map.md`         | Course goals → evidence                  | Individual + PL        | Each person can point to their evidence      |
| `14-sprint-plan-to-mvp.md`       | Week 2–8 plan                            | PL + team              | Revised at each sprint start                 |

Inherited v1 documents (do not replace):

| File                       | Role                                                                   |
| -------------------------- | ---------------------------------------------------------------------- |
| `../architecture.md`       | v1 as-is architecture                                                  |
| `../known-bugs.md`         | Intentional defects to fix or explicitly defer                         |
| `../v2-targets.md`         | School's _maximum_ v2 vision — treated as a menu, not our MVP contract |
| `../README-pain-points.md` | What already works and what breaks at scale                            |
| `../../README.md`          | How to run v1                                                          |
| `../../DRIFT.md`           | Local run + deploy platform rules                                      |
| `../native/README.md`      | School stub for three native modules (we implement one)                |

---

## 5. Team and default lanes

| Person            | Programme            | Default lane                                    | Typical artifacts that show individual contribution |
| ----------------- | -------------------- | ----------------------------------------------- | --------------------------------------------------- |
| Tomac Jansson     | Fullstack JavaScript | React app, UX implementation, docs coordination | Frontend PRs, UX states, API client, README parts   |
| Zaida Wiss        | Fullstack JavaScript | React app (portfolio view + drift UI)           | Components, tests, screenshots in demo notes        |
| Björn Boman       | Fullstack JavaScript | React app (auth shell, layout, integration)     | Auth flow, routing, error states                    |
| Erik Berglund     | Fullstack Java       | Spring API, domain model, security              | Services, Flyway, JWT/session, reviews              |
| Rasha Knifdi      | Fullstack Java       | Spring API, aggregation + FX + persistence      | Portfolio service, FX adapter, tests                |
| Pär Lundh         | System (C/C++)       | Native module + tests                           | CMake build, unit tests, README for `native/`       |
| Henrik Westerlund | System (C/C++)       | Native module + Java bridge notes               | Algorithm, fixtures, fallback spec                  |

One person rotates as **Project Lead** each week: backlog hygiene, decision log, test-status date, README sanity. Name the PL in `08-team-board.md`.

---

## 6. System sketch (target for MVP)

```
React 18 + TypeScript  (JS team)
        |  JSON over HTTPS, contract in 04-api-contract.md
Spring Boot API         (Java team)
        |  optional JNA call, contract in 05-native-contract.md
C/C++ module            (C++ team)     ── or Java fallback
        |
PostgreSQL              (Flyway-managed schema)
```

v1 today is a Thymeleaf monolith with SQL inside controllers. We do not need to finish every item in `docs/v2-targets.md` to ship the core flow.

---

## 7. MVP core flow (must demo end-to-end)

1. User logs in.
2. User sees one consolidated portfolio across included account types.
3. Values are shown in SEK with FX applied and the FX basis visible.
4. User can set a target allocation (e.g. 60/40).
5. System shows a clear indicator when live allocation has drifted past **5%**.

Everything else is later or explicitly out of scope. See the PRD.

---

## 8. Working rhythm

| When            | What                                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| Sprint start    | Set one week goal. Confirm DoR on pulled stories. Update `14-sprint-plan-to-mvp.md`.                               |
| During week     | Small PRs into `develop`. Update README / test status / decision log when reality changes.                         |
| PL slot (2.5 h) | Status, blockers, priority, individual visibility.                                                                 |
| Thursday-ish    | Checkpoint quality: something runnable, docs not stale.                                                            |
| Friday          | No project work. Professional dialogues / LIA only. Log conversations outside this pack if the school requires it. |

Git hygiene (from `DRIFT.md`):

- Feature branches → `develop` (stage) → `main` (prod)
- Never break `infra/docker-compose.yml` platform rules
- Frontend is built _into_ the backend image; no separate public frontend container

---

## 9. School v2-targets vs our MVP

`docs/v2-targets.md` asks for Java 21, Spring Boot 3.2, JPA, Flyway, JWT, React 18, three native modules, 80% service coverage, OWASP ZAP clean, k6 P95 < 200 ms.

We treat that list as **direction**, not a promise.

**In MVP if it unlocks the core flow or basic professionalism:**

- Layered backend (controller / service / persistence)
- Auth that is not trivially broken (no SQL injection, hashed passwords, ownership checks)
- React UI for the five-step flow
- One FX path
- One native module _or_ a documented fallback
- Tests that match our actual scope
- README, decision log, test status, AI log

**After MVP / only if time:**

- Full Java 21 + virtual threads
- Three native modules
- 80% coverage, k6, ZAP as formal gates
- Live market-data platform
- Pension accounts
- Auto-rebalance or scenario backtests

---

## 10. Course evidence (short)

You pass by making work **traceable**, not by winning the customer heat.

Minimum evidence trail for each person:

- Named stories in `07` + commits/PRs
- Notes in `10-decision-log.md` or review comments for choices you owned
- Rows in `11-ai-usage-log.md` if AI touched your work
- Ability to explain your part live (login, aggregation, FX, indicator, or native module)

Full mapping: `13-course-goals-map.md`.

---

## 11. Document status

| File                  | Status  |
| --------------------- | ------- |
| `00-index.md`         | Written |
| `01-project-brief.md` | Written |
| `02`–`14`             | Written |

When a later file is added, tick it here and bump **Last updated** on this index.

---

## 12. AI disclosure for this file

Drafted with assistance from the BMAD Fullstack Team (Grok / BMad Orchestrator) on 2026-08-26 from the course brief, team MVP, v1 repository docs, and the course plan PDF. The team must review and accept the locked decisions before treating them as final in implementation.
