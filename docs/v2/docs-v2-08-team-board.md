# Team Board — Portfolio Health

**Version:** 1.0  
**Date:** 2026-08-26  
**Status:** Draft for team approval  
**How to use:** update names at each sprint start. This file is a staffing sketch, not a contract with the school.

Fridays are **not** project days.

---

## 1. People

| Name              | Programme      | Lane                | Home stories                                   |
| ----------------- | -------------- | ------------------- | ---------------------------------------------- |
| Tomac Jansson     | Fullstack JS   | JS-A + docs liaison | E0-S1, E5-S1, E5-S5, E7-S1 help, pack shepherd |
| Zaida Wiss        | Fullstack JS   | JS-B                | E0-S2, E5-S2 overview UI                       |
| Björn Boman       | Fullstack JS   | JS-C                | E1-S3, E1-S4, E5-S3 target UI                  |
| Erik Berglund     | Fullstack Java | Java-A              | E0-S3, E1-S1, E1-S2, E5-S5 backend side        |
| Rasha Knifdi      | Fullstack Java | Java-B              | E2-S1, E2-S2, E3-S1, E3-S2, E4-\*              |
| Pär Lundh         | System C/C++   | Native-A            | E6-S1 implementation                           |
| Henrik Westerlund | System C/C++   | Native-B            | E6-S2 tests/README, pair on E6-S4              |

If two JS people pair on overview, write both on the issue. Do not leave a P0 story without a name after Thursday’s planning.

---

## 2. Project Lead rotation

PL owns: board, decision-log prompt, test-status date, “who is invisible this week?”, checkpoint narrative.

| Course week | Dates (2026) | Suggested PL           | Why this week is heavy             |
| ----------- | ------------ | ---------------------- | ---------------------------------- |
| 2           | 24–28 Aug    | Tomac                  | Planning pack, issues, first rails |
| 3           | 31 Aug–4 Sep | Erik                   | Auth + schema landing              |
| 4           | 7–11 Sep     | Zaida                  | Overview UI + API first contact    |
| 5           | 14–18 Sep    | Rasha                  | Aggregation / target truth         |
| 6           | 21–25 Sep    | Pär                    | CTO pack, native explainability    |
| 7           | 28 Sep–2 Oct | Björn                  | Recorded demo, integration polish  |
| 8           | 5–9 Oct      | Henrik                 | UX/DM feedforward → decisions      |
| 9           | 12–16 Oct    | Tomac                  | Qual-demo plan                     |
| 10          | 19–23 Oct    | Erik                   | Live qual demo                     |
| 11–12       | 26 Oct–6 Nov | rotate by availability | Rework + final README              |

Swap freely. Write the actual PL name here when you swap.

PL is not “the person who codes everything”. If PL’s own story slips, say so in the PL slot.

---

## 3. How the three languages meet

```
JS-A/B/C  ←→  04-api-contract.md  ←→  Java-A/B
Java-B    ←→  05-native-contract.md ←→  Native-A/B
PL        ←→  10-decision-log.md, 12-test-status.md
```

Standup question that actually helps:

1. What contract field did I touch?
2. What am I blocked on that is _someone else’s_ endpoint or fixture?
3. What will an examiner see with my name on it this week?

Do not explain Java generics to C++ or CSS to Java in the PL slot.

---

## 4. Week-by-week staffing (to end of MVP)

### Week 2 — now (planning + rails)

| Person | Focus                                        |
| ------ | -------------------------------------------- |
| Tomac  | Finish docs pack, create issues, E0-S1 start |
| Zaida  | E0-S2 mock fixtures                          |
| Björn  | Help E0-S1 routes / login skeleton           |
| Erik   | E0-S3 running app + migration decision       |
| Rasha  | Read v1 controllers; sketch tables for E2    |
| Pär    | E6-S1 header + empty lib                     |
| Henrik | CMake + first test harness                   |

**Week goal:** everyone has a repo path and a first issue. No hero feature.

### Week 3 — auth + data + native core

| Person       | Focus                                             |
| ------------ | ------------------------------------------------- |
| Erik         | E1-S1, E1-S2                                      |
| Rasha        | E2-S1 seed fund + FX table                        |
| Björn        | E1-S3 against mock, switch to real API when ready |
| Zaida        | Keep fixtures honest; start overview layout       |
| Tomac        | Proxy/CORS, shell, help login                     |
| Pär / Henrik | E6-S1 / E6-S2                                     |

**Week goal:** Anna can log in on real API **or** mock, and `ctest` exists.

### Week 4 — first portfolio JSON

| Person        | Focus                                     |
| ------------- | ----------------------------------------- |
| Rasha         | E3-S1 maths                               |
| Erik          | Wire security + review Rasha; start E4-S1 |
| Zaida         | E5-S2 on mock                             |
| Björn / Tomac | E1-S4, E5-S1                              |
| Native        | Finish fixtures F/E                       |

**Week goal:** `GET /api/portfolio` returns _some_ truthful JSON for Anna.

### Week 5 — target + indicator

| Person       | Focus                                    |
| ------------ | ---------------------------------------- |
| Rasha / Erik | E3-S2, E4-S2, E6-S3                      |
| Zaida        | Hook overview to live API                |
| Björn        | E5-S3                                    |
| Tomac        | Copy, disclaimer, 401 redirect           |
| Native       | Buffer / help Java with expected numbers |

**Week goal:** five-step flow works on compose, even if ugly.

### Week 6 — CTO week

| Person       | Focus                                                        |
| ------------ | ------------------------------------------------------------ |
| Pär / Henrik | Explain doc + optional E6-S4                                 |
| Erik / Rasha | Service-layer cleanliness, leftover v1 literals              |
| JS           | Hardening, empty states                                      |
| PL (Pär)     | CTO-underlag: architecture picture, risks, what we will show |

**Week goal:** written CTO notes; demo path listed.

### Week 7 — recorded demo

| Person        | Focus                         |
| ------------- | ----------------------------- |
| Björn (PL)    | Script + recording            |
| Tomac / Zaida | E5-S5 one-origin build        |
| Java          | Bug bash on demo script       |
| Native        | Live `ctest` in the recording |

**Week goal:** recording uploaded; fallback screenshots exist.

### Week 8 — MVP freeze + UX/DM films

| Person                                   | Focus                                            |
| ---------------------------------------- | ------------------------------------------------ |
| All                                      | Only P0 defects + feedforward decisions          |
| Henrik (PL)                              | 3–5 specialist points → do/defer in decision log |
| No new P1 unless core is boringly stable |                                                  |

**Week goal:** MVP accepted per PRD §10.

---

## 5. Visibility checklist (individual grade)

Each person should be able to point at **two** of:

- commits on a named story
- a test they wrote
- a paragraph in README / native README / decision log
- a spoken part of the demo (“I own FX as-of” / “I own the C ABI”)

Red flags for PL:

- Someone only “helped”
- Two people on every commit, no primary
- All docs written by one JS student
- Native pair invisible until week 6

---

## 6. Pairing rules

- Pair across languages only on **contract bugs** (wrong field, wrong status).
- Pair inside a language on first auth and first aggregation.
- Reviews: JS reviews JS, Java reviews Java, C++ reviews C++. Cross-lane review is for README and demo script.

---

## 7. Communication defaults

| Need                              | Place                                                 |
| --------------------------------- | ----------------------------------------------------- |
| “What does this JSON field mean?” | `04-api-contract.md` PR, not chat archaeology         |
| “Is 5% inclusive?”                | already yes; do not reopen without a decision-log row |
| “Who is PL?”                      | this file                                             |
| “Can I start X?”                  | DoR in `09`                                           |

---

## 8. Next document

`09-definition-of-ready-done.md` — your existing DoR/DoD plus course/v2 extras in one place.

---

## AI disclosure

Drafted with BMAD Fullstack Team assistance (Grok / BMad Orchestrator) on 2026-08-26. Reassign lanes if the team prefers different pairings.
