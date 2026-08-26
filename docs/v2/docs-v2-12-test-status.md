# Test Status

**Version:** 1.0  
**Last updated:** 2026-08-26  
**Owner:** rotating Project Lead (ask the named story owner for facts)  
**Honesty rule:** if it is not run on a dated build, it is not green.

---

## 1. Snapshot

| Date       | Build                       | Automated  | Manual Anna path  | Native `ctest`   | Notes                                  |
| ---------- | --------------------------- | ---------- | ----------------- | ---------------- | -------------------------------------- |
| 2026-08-26 | v1 `main` / planning branch | None in v1 | Not re-run for v2 | N/A (no sources) | Baseline: school codebase has no tests |

Update this table every checkpoint week, not every commit.

---

## 2. What v1 gives us

- No unit tests, no API tests, no frontend tests.
- Manual click-through of Thymeleaf pages is possible (`README.md` users).
- Known defects in `docs/known-bugs.md` are **intentional**. Several must be gone before we call MVP tested (SQL injection, MD5, dual threshold, IDOR if writes stay exposed).

We do not claim coverage percentages. We claim **named checks**.

---

## 3. Target checks for MVP (P0)

### 3.1 Native (C/C++)

| ID   | Check                                    | Status      | Owner lane |
| ---- | ---------------------------------------- | ----------- | ---------- |
| T-N1 | Fixtures F1–F10                          | not started | Native     |
| T-N2 | Error fixtures E1–E4 + NULL out          | not started | Native     |
| T-N3 | `ctest` documented in `native/README.md` | not started | Native     |

### 3.2 Java domain / API

| ID    | Check                                                    | Status            | Owner lane |
| ----- | -------------------------------------------------------- | ----------------- | ---------- |
| T-J1  | Wrong password → 401                                     | not started       | Java       |
| T-J2  | Anna login → 200 + `GET /me`                             | not started       | Java       |
| T-J3  | Erik session cannot read Anna holdings/totals            | not started       | Java       |
| T-J4  | PUT target 60/30 → 400                                   | not started       | Java       |
| T-J5  | PUT 60/40 then GET portfolio shows target 60             | not started       | Java       |
| T-J6  | `drift.thresholdPercent === 5`                           | not started       | Java       |
| T-J7  | Java fallback fixtures match F1–F10                      | not started       | Java       |
| T-J8  | USD holding converted with table rate, not 10.45 literal | not started       | Java       |
| T-J9  | Missing price → unvalued list, not silent 0              | not started       | Java       |
| T-J10 | If any delete endpoint exists: IDOR test                 | n/a until exposed | Java       |

### 3.3 JavaScript

| ID   | Check                                                                     | Status      | Owner lane |
| ---- | ------------------------------------------------------------------------- | ----------- | ---------- |
| T-F1 | Login does not write password to localStorage                             | not started | JS         |
| T-F2 | Indicator renders NO_TARGET / ON_TRACK / DRIFTED / NO_BASIS from fixtures | not started | JS         |
| T-F3 | Target form blocks sum ≠ 100                                              | not started | JS         |
| T-F4 | 401 redirects to login                                                    | not started | JS         |

### 3.4 Manual (whole team)

| ID   | Check                                              | Status      |
| ---- | -------------------------------------------------- | ----------- |
| T-M1 | Anna five-step path on `docker compose`            | not started |
| T-M2 | FX source + as-of visible                          | not started |
| T-M3 | Disclaimer visible; no banned phrases              | not started |
| T-M4 | Fallback recording or screenshots exist            | not started |
| T-M5 | Fresh clone README path works on one extra machine | not started |

---

## 4. Manual demo script (Anna)

Run against the build you will show. Tick and date when executed.

Environment: **\_\_\_\_**  
Date: **\_\_\_\_**  
Driver: **\_\_\_\_**

1. Open the app URL from README.
2. Log in as `anna@example.com` with the password in README.
3. Confirm header shows Anna and **Översikt**.
4. Confirm **Totalt värde** is in SEK and not empty.
5. Confirm FX/price trust line is visible.
6. Confirm ISK / KF / Depå breakdown (Depå may be small).
7. Confirm Aktier / Fonder are both present (seed fund required).
8. If no target: status **Ingen målallokering**. Open **Sätt mål**.
9. Set 60 / 40, save. Return to overview.
10. Read live vs target and the indicator.
11. If live equity is ≥ 5 pp from 60, card must be drifted; otherwise on track.
12. Log out. Hitting overview again requires login.

**Fail the script if** any step needs a hidden SQL update or a hardcoded `10.45` explanation.

Optional native beat: run `ctest` in `native/drift/build` and say whether the API used `NATIVE` or `JAVA_FALLBACK`.

---

## 5. How to demonstrate drift both ways

Seed may already be drifted after we add a fund and real prices. If it is always on-track or always drifted, add a **fixture user** or a README snippet:

- Target 60/40 with live ~60 → on track
- Target 90/10 (temporary, demo only) → drifted, then set back

Do not “fix” live % in the UI.

---

## 6. Out of test scope (for now)

- k6 100 users / 10 000 holdings
- OWASP ZAP as a gate
- 80% service coverage
- Full RTL suite
- Pension
- Alerts product
- Multi-browser matrix

If someone runs ZAP for learning, park findings here as notes, not as Done criteria.

---

## 7. Defects we still accept (update as you go)

| ID  | Defect                                      | Why accepted                 | Until             |
| --- | ------------------------------------------- | ---------------------------- | ----------------- |
| G1  | Thymeleaf v1 pages may still exist          | Not the demo path            | week 8            |
| G2  | CSRF token may be incomplete on cookie auth | Documented residual          | after MVP if time |
| G3  | Prices are a dated table                    | Honest FX/price labels       | post-MVP          |
| G4  | Native not loaded on Windows                | Fallback + `ctest` on one OS | P1 E6-S4          |

Remove a row when the defect is gone.

---

## 8. Commands (fill when they exist)

```text
# API / Java
cd backend/AvanzaPortal && mvn test

# Frontend
cd frontend && npm test

# Native
cd native/drift && ctest --test-dir build --output-on-failure

# App
cd infra && docker compose up --build
```

Replace with real commands when E0 stories land.

---

## Next document

`13-course-goals-map.md`

---

## AI disclosure

Drafted with BMAD Fullstack Team assistance (Grok / BMad Orchestrator) on 2026-08-26.
