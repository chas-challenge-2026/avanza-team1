# Definition of Ready and Done

**Version:** 1.0  
**Date:** 2026-08-26  
**Status:** Draft for team approval  
**Based on:** team DoR/DoD, course v2 DoD, this documentation pack

Use this in every sprint start. If a story fails DoR, it is not started. If it fails DoD, it is not “done” in the checkpoint.

---

## 1. Definition of Ready (story)

A story may move to **In progress** only when all of the following are true:

1. **ID and title** exist (`E3-S2 GET /api/portfolio`).
2. **Description** says what changes in the product, not only “fix backend”.
3. **Acceptance criteria** are testable (yes/no), copied or refined from `07`.
4. **PRD / contract refs** are listed when the story touches API, drift, or copy.
5. **Estimate** exists (1 / 2 / 3 / 5 / 8).
6. **Lane + named owner** exist in the issue and on `08-team-board.md`.
7. **Dependencies** are named. Blocked deps are visible on the board.
8. **Fits the remaining week** (remember: no Friday project work).
9. **Team can explain the outcome** in one sentence.
10. **Contract impact** is handled: if JSON changes, `04` is updated *before* coding.
11. **Advice boundary** is considered if the story adds UI strings.
12. **DoR check** was spoken in sprint start or PL slot, not assumed.

If design or API shape is still being invented, the work is a spike. Time-box spikes (max one day) and write the decision before implementation stories start.

---

## 2. Definition of Done (story)

A story may move to **Done** only when all of the following are true:

1. **Code** implements the acceptance criteria.
2. **Review** by at least one other person in the same lane (or PL for docs).
3. **Tests** exist at the level the story asked for (see `03` / `07`). Pure docs stories: review only.
4. **Integrated** on the agreed branch (`develop` for runtime code).
5. **No known blocker bugs** introduced, or they are listed in `12-test-status.md` / known gaps.
6. **Docs touched if needed:** README, contract, decision log, native README, AI log.
7. **Runs in the shared environment** the team actually uses (local compose and/or stage).
8. **Owner can explain it** without reading the chat history.
9. **Individual name** is findable (commit, PR, or explicit “owned by” in the issue).

“It works on my laptop” is not Done.

---

## 3. Definition of Done (MVP / v2 delivery)

From the case brief, restated so it is checkable:

| # | Criterion | Evidence |
|---|---|---|
| 1 | Core flow works and can be shown | Manual script in `12-test-status.md` executed on a dated build |
| 2 | README: install, run, test, known gaps, boundaries | Root README |
| 3 | Test status documented and sized to our scope | `12-test-status.md` |
| 4 | Decision log shows real forks | `10-decision-log.md` |
| 5 | Individual contributions can be derived | issues + git + `08` + demo parts |
| 6 | Relevant specialist feedforward processed | decision-log rows do / defer / why |
| 7 | Fallback if live demo fails | recording + screenshots + `compose up` notes |
| 8 | C/C++ module buildable, testable, explainable | `native/README.md` + `ctest` (integration optional) |
| 9 | Frontend, backend, native form one understandable whole | architecture + demo narrative |
| 10 | Advice boundary holds | UX copy review E7-S4 |

PRD §10 is the product acceptance list. This table is the course wrapper around it.

---

## 4. Definition of Done (week checkpoint)

Good enough to show PL / teacher that the week happened:

- Week goal from `08` / `14` stated in one line
- What moved to Done
- What is blocked, by whom
- What each person did (not “the team”)
- README not lying about how to run
- New decisions written the same day

A checkpoint without a runnable increment after week 4 is a smell. Weeks 2–3 may show mocks + `ctest` + login only.

---

## 5. Ready for demo (live or recorded)

1. Seed credentials work on the build you will show.
2. Anna path: login → SEK total → FX line → set or show 60/40 → indicator.
3. One person drives, others have spoken parts prepared.
4. Known gaps are on a slide or README, not discovered live.
5. Fallback machine / recording is already exported.
6. Native story: either JNA on or `ctest` + fallback sentence.

---

## 6. Explicit non-criteria

These do **not** block Done for MVP:

- 80% line coverage
- k6 P95
- OWASP ZAP clean
- Pension
- Three native modules
- Winning the customer heat
- Perfect visual polish

They may still be mentioned as later work.

---

## 7. Tiny working agreements

- Branch from `develop` for code; docs-only work may use `docs/v2-planning` until merged.
- PR text links the story id.
- Do not commit secrets.
- Do not break `infra/docker-compose.yml` platform rules.
- If you use AI for a decision, test, or substantial snippet: one line in `11-ai-usage-log.md` the same day.

---

## 8. Next document

`10-decision-log.md` — template plus the decisions already locked in this pack.

---

## AI disclosure

Drafted with BMAD Fullstack Team assistance (Grok / BMad Orchestrator) on 2026-08-26 from the team’s own DoR/DoD and the course brief.
