# Sprint Plan to MVP

**Version:** 1.0  
**Date:** 2026-08-26  
**Horizon:** course week 2 → week 8 (MVP)  
**After week 8:** stabilize, feedforward, qual demo, rework — not new product bets  
**Constraint:** no project work on Fridays

Revise the **week goal** every Monday. Do not rewrite the whole file unless the goal itself changed.

---

## 1. Calendar reminder (course)

| Week  | Dates 2026    | Course frame                                 | Our product frame                    |
| ----- | ------------- | -------------------------------------------- | ------------------------------------ |
| 1     | 17–21 Aug     | Start, specialist live workshops             | Past                                 |
| 2     | 24–28 Aug     | Planning, MVP, backlog, first run check      | **We are here** — docs + rails       |
| 3–5   | 31 Aug–18 Sep | Production toward core flow                  | Auth, data, API, UI, native tests    |
| 6     | 21–25 Sep     | CTO material due Thu 24 Sep 16:00            | Explain architecture + risks         |
| 7     | 28 Sep–2 Oct  | CTO films; recorded demo due Thu 1 Oct 16:00 | One-origin build + recording         |
| 8     | 5–9 Oct       | UX + DM films                                | **MVP freeze** + process feedforward |
| 9     | 12–16 Oct     | Qual-demo plan due Thu 15 Oct 17:00          | After this file                      |
| 10    | 19–23 Oct     | Qual demo Thu 22 Oct                         | After this file                      |
| 11–12 | 26 Oct–6 Nov  | Rework + final Wed 4 Nov 15:00               | After this file                      |

---

## 2. Definition of “MVP done” (exit of week 8)

Copied from PRD §10, shortened:

1. Anna path on compose
2. SEK totals + visible FX
3. Target 60/40 save/show
4. 5% indicator both sides explainable
5. No advice copy
6. Auth minimums
7. Native build+test, JNA optional
8. README / decision log / test status true
9. Named individual slices

---

## 3. Week plans

### Week 2 · 24–28 Aug · Planning and rails

**PL:** Tomac  
**Sprint goal:** Shared picture + first issues + each lane has a started P0.

| Done when                                               | Stories     |
| ------------------------------------------------------- | ----------- |
| `docs/v2` on `docs/v2-planning` and issues created      | E0-S4       |
| `frontend/` skeleton or a written start date            | E0-S1       |
| Mock fixtures exist **or** are scheduled day-one week 3 | E0-S2       |
| Compose still runs; migration approach proposed         | E0-S3       |
| Native folder started (header or CMake)                 | E6-S1 start |

**Checkpoint:** not a product demo. Show the board and one running v1 compose.

**Risk this week:** talking instead of cutting issues.

---

### Week 3 · 31 Aug–4 Sep · Identity and facts

**PL:** Erik  
**Sprint goal:** Real login API + seed that can support 60/40 + native tests exist.

| Lane | Commit to                          |
| ---- | ---------------------------------- |
| Java | E1-S1, E1-S2, E2-S1 underway       |
| JS   | E1-S3 on mock; switch if API ready |
| C++  | E6-S1 mostly done, E6-S2 started   |

**Checkpoint:** Anna logs in via `/api/auth/login` **or** UI against mock. `ctest` runs somewhere.

**Risk:** Java upgrade rabbit hole (Boot 3 / Java 21). Do not block login on it.

---

### Week 4 · 7–11 Sep · First truthful portfolio JSON

**PL:** Zaida  
**Sprint goal:** `GET /api/portfolio` returns user-scoped SEK numbers.

| Lane | Commit to                                     |
| ---- | --------------------------------------------- |
| Java | E2-S2, E3-S1, start E3-S2                     |
| JS   | E5-S1, E5-S2 on mock; try live if JSON exists |
| C++  | E6-S2 green                                   |

**Checkpoint:** curl or UI shows a total and FX as-of (even if target is null).

**Risk:** classification without a fund in seed — add the fund this week at latest.

---

### Week 5 · 14–18 Sep · Close the loop

**PL:** Rasha  
**Sprint goal:** Five-step flow works end-to-end on compose (ugly is fine).

| Lane | Commit to                  |
| ---- | -------------------------- |
| Java | E3-S2, E4-S1, E4-S2, E6-S3 |
| JS   | E5-S2 live, E5-S3, E1-S4   |
| C++  | Support numbers; buffer    |

**Checkpoint:** PL drives the manual script T-M1 once.

**Risk:** polishing charts. Numbers first.

---

### Week 6 · 21–25 Sep · CTO week

**PL:** Pär  
**Sprint goal:** Core flow still works **and** a short CTO pack exists.

Deliver by **Thu 24 Sep 16:00**:

- Picture from `03-architecture.md`
- What v1 vs v2 changed
- Risks (FX honesty, CSRF residual, native load)
- What you will show vs fallback
- Who owns which box

Code this week: leftover literals, service-layer cleanup, E6-S4 only if F1–F10 already green.

**Risk:** rewriting the stack to impress CTO. Don’t.

---

### Week 7 · 28 Sep–2 Oct · Recorded demo

**PL:** Björn  
**Sprint goal:** Recording of the Anna path + one-origin deploy path started or done.

Deadline **Thu 1 Oct 16:00** — recorded demo rehearsal.

| Must                        | Stories            |
| --------------------------- | ------------------ |
| Script + recording          | E7-S2              |
| Prefer E5-S5 if not already | SPA in `app` image |
| Bug bash against T-M1       | all                |

**Risk:** recording the Thymeleaf v1 by mistake. Demo the SPA.

---

### Week 8 · 5–9 Oct · Freeze

**PL:** Henrik  
**Sprint goal:** MVP accepted. Specialist films turned into decisions, not new epics.

- P0 only
- E7-S1, E7-S4, E7-S5
- D-F-UX and D-F-DM rows
- No Pension, no backtest, no k6 gate

**Exit review (Thu):** PRD §10 checklist signed by PL + one person per lane.

---

## 4. After MVP (do not plan as if it were now)

| Week | Only this                                          |
| ---- | -------------------------------------------------- |
| 9    | Qual-demo plan, fallback, spoken parts             |
| 10   | Live customer demo                                 |
| 11   | Customer feedforward → omtagsplan                  |
| 12   | README truth, freeze, final submit Wed 4 Nov 15:00 |

New features after week 8 need a decision-log row that says what P0 evidence stays intact.

---

## 5. Weekly ritual (copy to chat each Monday)

```
Week goal:
PL:
Stories in:
Stories out (DoR failed):
Known risk:
Friday: no project work
```

---

## 6. Capacity hint

Seven people × four project days ≈ 28 person-days per week on paper. Reality is closer to **12–18 effective** after school, setup, and language barriers. That is why P0 is the five-step flow, not `docs/v2-targets.md`.

---

## 7. Pack complete — index tick list

When you merge this file, update `00-index.md` section 11 to **Written** for `01`–`14`.

Recommended next _implementation_ moves (not more docs):

1. Merge `docs/v2-planning` to `develop` when the team has accepted the pack
2. Create GitHub issues from `07` (E0-S4)
3. JS: E0-S1 / E0-S2
4. Java: E0-S3 / E1-S1
5. C++: E6-S1

---

## AI disclosure

Drafted with BMAD Fullstack Team assistance (Grok / BMad Orchestrator) on 2026-08-26 from the course week list and this pack.
