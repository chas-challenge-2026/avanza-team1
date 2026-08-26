# Decision Log

**Version:** 1.0  
**Date:** 2026-08-26  
**Owner:** rotating Project Lead  
**Rule:** if the team chose X over Y, write it here the same day.

---

## How to add a row

Copy the template. Do not rewrite history; add a new row if you change your mind.

```md
### D-NNN — short title

- Date:
- Status: accepted | superseded by D-NNN | proposed
- Deciders:
- Context:
- Decision:
- Alternatives considered:
- Consequences:
- Linked stories / files:
- Course relevance:
```

---

## Accepted decisions

### D-001 — Drift threshold is 5 percentage points

- **Date:** 2026-08-26
- **Status:** accepted
- **Deciders:** team (via planning pack)
- **Context:** v1 used 5% on the dashboard and 7% on alerts.
- **Decision:** one threshold, **5 pp**, inclusive (`>=`).
- **Alternatives:** keep 7%; make threshold user-editable.
- **Consequences:** API, UI, native, and fallback share config `5.0`.
- **Linked:** PRD FR-DR-\*, native fixtures F4/F6
- **Course relevance:** consistency, estimable rule, easy to demo

### D-002 — Target is asset-class mix, not account type

- **Date:** 2026-08-26
- **Status:** accepted
- **Deciders:** team
- **Context:** v1 seed stores ISK 60 / KF 25 / Depå 15. Customer pain is 60/40 style mix.
- **Decision:** one **user-level** target: EQUITY % + FUND %. Account-type targets are not used for the indicator.
- **Alternatives:** per-account targets; keep v1 model.
- **Consequences:** new table; seed must include a fund holding.
- **Linked:** architecture §8, E2-S1, E4-S1
- **Course relevance:** requirement interpretation (goal 1 / skill 10)

### D-003 — Pension is out of MVP

- **Date:** 2026-08-26
- **Status:** accepted
- **Deciders:** team
- **Context:** case mentions Pension; seed has none.
- **Decision:** do not show a fake Pension account. Document the cut.
- **Alternatives:** invent seed pension data now.
- **Consequences:** README boundary; UI has three account types.
- **Linked:** brief §6, PRD FR-PF-10

### D-004 — No personal advice

- **Date:** 2026-08-26
- **Status:** accepted
- **Deciders:** case + team
- **Decision:** UI/API describe drift with numbers. No buy/sell/rebalance commands.
- **Consequences:** banned-phrase list in UX spec; E7-S4 review.
- **Linked:** `06-ux-spec.md` §6

### D-005 — Single FX source, dated table allowed

- **Date:** 2026-08-26
- **Status:** accepted
- **Deciders:** team
- **Context:** v1 hardcodes USD/SEK = 10.45 in multiple controllers.
- **Decision:** one `FxService`. A dated internal table or one official fetch + cache is enough. Missing rate does not fall back to 10.45.
- **Alternatives:** live multi-provider FX; keep the literal.
- **Consequences:** overview shows source + as-of.
- **Linked:** FR-FX-\*, E2-S2

### D-006 — One native module + Java fallback

- **Date:** 2026-08-26
- **Status:** accepted
- **Deciders:** team
- **Context:** school stub lists backtest, risk, and FX native modules.
- **Decision:** only **drift** in C/C++. Same fixtures in Java fallback. JNA is P1.
- **Alternatives:** three modules; native-only path with no fallback.
- **Consequences:** demo can survive without `.so` load.
- **Linked:** `05-native-contract.md`, E6-\*

### D-007 — MVP deadline is end of week 8

- **Date:** 2026-08-26
- **Status:** accepted
- **Decision:** core flow frozen for 5–9 Oct 2026. Later weeks stabilize and demo.
- **Consequences:** P1 after P0; no Friday work.

### D-008 — Grade target is Pass (G)

- **Date:** 2026-08-26
- **Status:** accepted
- **Decision:** do not take scope to chase VG bullets or the heat win.
- **Consequences:** school max v2-targets are a menu.

### D-009 — Fridays are not project days

- **Date:** 2026-08-26
- **Status:** accepted
- **Decision:** LIA / professional dialogue only.
- **Consequences:** estimates must fit Mon–Thu.

### D-010 — Modular monolith, SPA + REST

- **Date:** 2026-08-26
- **Status:** accepted
- **Decision:** React SPA + Spring API in one Compose `app` image. No extra public frontend service.
- **Alternatives:** keep Thymeleaf; separate frontend container (forbidden by `DRIFT.md`).
- **Linked:** AD-1, AD-2, AD-3, E5-S5

### D-011 — Auth default is session cookie

- **Date:** 2026-08-26
- **Status:** accepted (revisit if Java pair objects)
- **Decision:** HTTP-only session cookie; SPA same-origin or Vite proxy.
- **Alternatives:** JWT Bearer.
- **Consequences:** CORS/proxy must be explicit in local dev. CSRF residual risk documented if not fully mitigated.
- **Linked:** AD-4a, E1-S2

### D-012 — UI copy in Swedish, docs in English

- **Date:** 2026-08-26
- **Status:** accepted
- **Decision:** product strings Swedish; `docs/v2` English.
- **Linked:** AD-12

### D-013 — OTHER excluded from 60/40 basis

- **Date:** 2026-08-26
- **Status:** accepted
- **Decision:** basis = EQUITY + FUND only. OTHER visible but not in live %.
- **Linked:** PRD definitions, API `allocationBasisSek`

### D-014 — School performance/security gates are not MVP release gates

- **Date:** 2026-08-26
- **Status:** accepted
- **Decision:** 80% coverage, k6, ZAP are P2.
- **Consequences:** still fix SQL injection, MD5, and IDOR on endpoints we ship.

---

## Proposed / to confirm this week

### D-015 — Flyway vs hand-run SQL

- **Status:** proposed
- **Question:** first schema change tool?
- **Recommendation:** Flyway if Java pair can add it in week 3; otherwise versioned SQL files in `infra/` plus a written apply order.
- **Deciders needed:** Erik, Rasha

### D-016 — JNA vs JNI

- **Status:** proposed
- **Recommendation:** JNA
- **Deciders needed:** Erik, Pär, Henrik

### D-017 — Where the built SPA is mounted

- **Status:** proposed
- **Recommendation:** Spring static resource path inside the existing image
- **Deciders needed:** Tomac, Erik (week 5–7, not week 2)

### D-018 — Price source label

- **Status:** proposed
- **Recommendation:** `internal-table` until a real feed exists
- **Deciders needed:** Rasha

---

## Feedforward rows (add when films arrive)

Use one row per specialist film:

### D-F-CTO — (date)

- Points heard:
- Do now:
- Defer:
- Why:

### D-F-UX — (date)

### D-F-DM — (date)

### D-F-CUSTOMER — (date, after qual demo)

---

## Next document

`11-ai-usage-log.md`

---

## AI disclosure

This log itself was drafted with BMAD Fullstack Team assistance (Grok / BMad Orchestrator) on 2026-08-26. That use is also recorded in `11-ai-usage-log.md`.
