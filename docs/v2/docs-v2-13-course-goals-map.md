# Course Goals Map

**Version:** 1.0  
**Date:** 2026-08-26  
**Source of goals:** course plan *Kunddriven leverans och avancerad produktutveckling* (60 yhp), YH02029 omgång 3, attached PDF  
**Grade target:** Pass (G) = all goals fulfilled. VG extras are listed at the end and are **not** extra product scope.

Use this before a checkpoint or oral exam: pick your name, then point at evidence.

The school assignment text sometimes numbers goals differently (17 items). If a teacher uses that list, map by **wording**, not by number.

---

## How to read a row

- **Evidence (team)** — files or rituals that exist even if you did not write them
- **Evidence (you)** — what you personally should be able to show
- **When** — when the goal becomes visible in the calendar

---

## Knowledge (1–9)

### 1. Customer need → requirements, priorities, delivery goals
- **Team:** `01-project-brief.md`, `02-prd.md`, D-002 / D-003
- **You:** explain why 60/40 asset class beat v1 account-type targets
- **When:** week 2 onward

### 2. Agile planning, follow-up, re-prioritisation
- **Team:** `08-team-board.md`, `14-sprint-plan-to-mvp.md`, weekly PL slot
- **You:** one example where scope was cut (Pension, three native modules)
- **When:** every week

### 3. Document requirements, assumptions, boundaries, dependencies
- **Team:** this pack; especially brief non-goals, API/native contracts, decision log
- **You:** a story you owned and its deps
- **When:** week 2 onward

### 4. Changing requirements, feedback, limited resources, risk → plan
- **Team:** risks in brief §7; feedforward rows in decision log; fallback demo
- **You:** what you stopped doing after a checkpoint
- **When:** weeks 6–11 especially

### 5. QA, testing, review, documentation → stable, traceable delivery
- **Team:** `09`, `12-test-status.md`, reviews in DoD
- **You:** a test or review you performed
- **When:** week 3 onward

### 6. Deliverability, deploy, security, maintainable operations (right-sized)
- **Team:** `DRIFT.md` respected; security minimums in PRD; service layer
- **You:** if Java — auth/IDOR/FX; if JS — one-origin deploy notes; if C++ — portable build
- **When:** weeks 3–8

### 7. AI/automation as support in research, problem-solving, docs, QA, comms
- **Team:** `11-ai-usage-log.md`
- **You:** at least one row with your name
- **When:** whenever you use a tool

### 8. Reflect on AI: responsibility, understanding, source criticism, ownership, judgement
- **Team:** A-001 plus later rows; “contract wins” rule
- **You:** one thing you rejected from a model (example: invented Pension, 7% threshold, advice copy)
- **When:** written reflection + oral

### 9. Professional communication, presentation, feedback → customer understanding
- **Team:** demo script, disclaimer, spoken parts
- **You:** a Friday dialogue note (outside this repo if school requires) and a demo segment
- **When:** Fridays + weeks 7–12

---

## Skills (10–21)

### 10. Interpret customer need → goals, prioritized deliverables, tasks
- **Evidence:** PRD P0 list; your issues from `07`
- **You:** the slice you took from the five-step flow

### 11. Plan and work in a cross-functional team (backlog, sprint goal, owners, follow-up)
- **Evidence:** `08`, board labels, PL rotation
- **You:** show last week’s owner line next to your commits

### 12. Reasonable estimates and risk calls
- **Evidence:** points on stories; risks R-1–R-10
- **You:** one estimate that was wrong and what you changed

### 13. Adjust plan, priority, ambition when facts change
- **Evidence:** decision log updates; P1 parked
- **You:** feedforward do/defer you participated in

### 14. Contribute to a coherent solution (functional + relevant non-functional)
- **Evidence:** running compose path; contracts
- **You:** your layer still fits the overview JSON

### 15. QA work: test, review, validate against goals and user need
- **Evidence:** T-* ids in `12`; E7 stories
- **You:** T-id you made green

### 16. Document goals, decisions, boundaries, process, test status, risks, results
- **Evidence:** this folder
- **You:** a paragraph you actually wrote (README, native README, decision row)

### 17. Use AI and still review, explain, justify, extend the result
- **Evidence:** `11` + oral
- **You:** walk through AI-touched work without opening the chat

### 18. Communicate solution, customer value, technical/method decisions, risks, cuts, next steps
- **Evidence:** demo script; CTO-underlag week 6
- **You:** 90-second version of *your* part

### 19. Receive, judge, turn feedback into prioritized improvements
- **Evidence:** D-F-CTO / UX / DM / customer rows
- **You:** one accepted and one deferred point

### 20. Individual responsibility visible; follow team working agreements
- **Evidence:** named stories, DoR/DoD
- **You:** no “we just did it” without artifacts

### 21. Present a partial delivery and a final delivery (need → solution → quality → value)
- **Evidence:** week 7 recording, week 10 qual, week 12 final
- **You:** prepared spoken beat

---

## Assessment forms (from the course plan)

| Form | What we keep ready |
|---|---|
| Written knowledge test | This map + brief + PRD definitions |
| Written individual reflection | Use `11` + a personal note on D-002 / fallback / advice line |
| Project submission (group, individual contribution assessed) | repo + `docs/v2` + git history |
| Workshops / checkpoints (formative) | week goals in `08` / `14` |

Formative cannot alone produce a fail. Still treat checkpoints as rehearsal for the oral.

---

## VG extras (do not inflate MVP)

Course plan VG bullets, mapped without adding product:

| VG bullet | If it happens, it looks like |
|---|---|
| High precision breaking specs into traceable deliverables and shared understanding of interfaces | Contracts kept in sync; stories quote FR-ids; no hallway JSON |
| Skilled estimates/risks updated when reality changes | Decision log + revised `14` after week 4–6 |
| High precision planning, building, testing, delivering a complete system incl. security, performance, docs | Core flow + security minimums + honest test status — not k6/ZAP as vanity |

Chase these only if P0 is already boring.

---

## Per-person cheat sheet

| Person | Goals you can claim most easily | Point at |
|---|---|---|
| Tomac | 1–3, 7–9, 16, 18, 20 | pack, E0-S1, E5-S5, demo framing |
| Zaida | 10, 14, 15, 18 | E5-S2, indicator states, T-F2 |
| Björn | 10, 11, 21 | login/target UI, week 7 recording |
| Erik | 5, 6, 14, 15 | auth, compose, IDOR/session |
| Rasha | 1, 6, 12, 14 | FX/prices/aggregation, D-005 |
| Pär | 6, 14, 18 | ABI, E6-S1, CTO week explain |
| Henrik | 5, 15, 16, 19 | `ctest`, native README, week 8 feedforward |

Everyone still touches 7–8, 11, 20.

---

## Next document

`14-sprint-plan-to-mvp.md` — calendar from week 2 to week 8.

---

## AI disclosure

Drafted with BMAD Fullstack Team assistance (Grok / BMad Orchestrator) on 2026-08-26 from the attached course plan PDF.
