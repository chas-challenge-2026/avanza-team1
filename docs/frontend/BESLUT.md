# Beslut — frontend

## 2026-09-02 — Mock före Java-API

- **Beslut:** UI läser `src/data/portfolio.json` via typen `Portfolio` och `mockPortfolio` tills `GET /api/portfolio` finns.
- **Varför:** Backend är inte redo. MVP-översikten ska kunna byggas ändå.
- **Avgränsning:** ingen fetch, ingen login, inga formulär i #24.
- **Konsekvens:** typen är kontraktet mot Java. Risk R-24 i registret.
- **Bevis:** issue #24, PR #46
- Tomac

## 2026-09-03 — Rot-README pekar ut frontend, casetexten får stå kvar

- **Beslut:** Inte skriva om hela rot-README. Lägga startkommando + `frontend/` i trädet. V1-casedelen (kända buggar, docker) lämnas.
- **Varför:** En produkt-README för hela MVP:n blir inaktuell innan flödet går att klicka.
- **Bevis:** issue #47
- Tomac
