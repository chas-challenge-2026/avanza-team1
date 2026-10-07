# Beslut — frontend

## 2026-09-01 — CSS-struktur

- Beslut: Placerar resets och globala CSS-variabler i `src/index.css` och grundläggande styles som styr den grova sidlayouten i `App.css`.
- Varför: `index.css` är den som läses in i `<HEAD>` så den mentala modellen hjälper till att förstå strukturen, dessutom säkerställer man att värden som ska vara globala och kunna kommas åt var som helst verkligen finns med ända "uppifrån toppen". `App.tsx` renderar själva sidstrukturen och de största semantiska avdelningarna så att dess css-fil får innehålla alla style rules som kontrollerar världen utanför komponenterna är det mest logiska.
- Avgränsning: Gäller resets för marginaler i `<BODY>` och box-sizing för samtliga element, globala `--variabler` för spacing, färger och font-storlekar, regler för `<HEADER>`, `<NAV>` och `<MAIN>`
- Konsekvens: Det blir lätt att avgöra vad nya deklarationer ska placeras.
- Bevis: issue #44, PR #79
- Björn

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

## 2026-09-03 — CSS naming convention för klasser och id:n

- Beslut: Naming convention att använda `kebab-case` vid namngivning av klasser och id:n i CSS.
- Varför: Det är en vanlig standard, och AI modeller brukar oftast använda det i sin genererade kod. Annars föredrar jag själv `camelCase` just när man jobbar i React eftersom det blir mer lättläst kod i JSX-komponenten, men då skulle man eventuellt behöva ändra till det i efterhand i kod-snuttar som kommer från AI.
- Avgränsning: `STYLING.md`
- Konsekvens: Vi följer den vanliga standarden i branschen, och vi behöver inte instruera AI-verktyg om att följa en annan konvention.
- Bevis: issue #44, commit: a1a3f436a762e28ae4f2600f901ccf630b5996f9
- Björn

## 2026-09-09 — Målallokering mot mock + localStorage

- **Beslut:** Mål (targetAktierPct / targetStabiltPct) redigeras i UI och sparas i `localStorage` under `ph_target_allocation`. Actual kommer kvar från mocken.
- **Varför:** MVP kräver att användaren sätter 60/40 innan Java har POST.
- **Avgränsning:** ingen backend, ingen drift-beräkning (#42).
- **Kontrakt:** fältnamn i `Portfolio` förblir som i #24. Ny UI-kod använder engelska identifierare.
- **Bevis:** issue #41

## 2026-09-09 — CSS naming convention för klasser och id:n

- Beslut: Ändrade naming convention till `camelCase` vid namngivning av klasser och id:n i CSS.
- Varför: I React blir det mer lättläst kod i JSX-komponenterna när man inte använder "-" i klassnamnen, och det visade sig att AI gärna rättar sig efter etablerade konventioner om den får context och redan färdiga exempel att gå efter.
- Avgränsning: `STYLING.md`
- Konsekvens: Mer överblicklig kod och mindre risk att skriva fel (enklare syntax)
- Bevis: issue #44, commit: 63555390fdb05781faed2622985e62ae286c6f45
- Björn

## 2026-09-10 — Drift räknas i frontend mot mock + sparat mål

- **Beslut:** `overThreshold` och varningstext kommer från `computeDrift` i `frontend/src/lib/drift.ts`, inte från den förberäknade flaggan i `portfolio.json`.
- **Formel:** `|actualAktierPct - targetAktierPct| > thresholdPct` (tröskel 5 % i mocken).
- **Varför:** MVP kräver att bannern följer det mål användaren precis sparat (#41 / localStorage).
- **Avgränsning:** ingen backend, ingen ändring av `Allocation`-kontraktet, ingen automatisk spegling av de två målfälten.
- **Bevis:** issue #42
- Tomac

## 2026-09-10 — Mock-auth format speglar framtida REST-kontrakt

- **Beslut:** `login()` i `auth.ts` returnerar `AuthResult { user: User, token: string }` istället för bara `boolean`. Mock-kontona (Anna, Erik) och lösenordet `password123` speglar `infra/seed.sql`. Token och user sparas separat i `localStorage` under `ph_token` / `ph_user`.
- **Varför:** `SessionSecurityFilter.java` (branch `Add/security-filter`) undantar `/api/*` explicit från backendens sessionsbaserade auth ("open-ended for other teams") — det riktiga REST-API:et frontend ska prata med blir alltså troligen token-baserat, inte session-baserat. Genom att forma mocken efter detta redan nu blir bytet till riktig backend en mindre omskrivning, samma princip som #24: "typen är kontraktet mot Java".
- **Avgränsning:** Ingen riktig JWT-verifiering (mock only, enligt issue #40). Ingen koppling till `/api`-API:et ännu — det finns inte än.
- **Kontrakt:** `User { id: string, name: string, email: string }` i `types/auth.ts`. Obs: riktiga `User`-entityn i backend har `id: Long` (numeriskt) — kan behöva bli `number` när riktigt API kopplas in.
- **Bevis:** issue #40, `frontend/src/auth/`
- Zaida

## 2026-09-14 — Vitest + RTL som teststack för frontend

- **Beslut:** Vitest + React Testing Library + jsdom sätts upp i #87. Ett smoke-test verifierar att en komponent kan renderas och att DOM-assertions fungerar. Kommando: `npm run test`.
- **Varför:** Projektet är redan ESM (`"type": "module"` i package.json) och kör Vite. Vitest återanvänder `vite.config.ts` och samma esbuild-transform som appen redan bygger med, så ESM hanteras utan extra steg. Jest bygger på CommonJS-antaganden och hade krävt separat transform + specialhantering av `import.meta` för samma resultat.
- **Avgränsning:** Ingen E2E (Playwright/Cypress) i #87 — täcker bara unit/component-nivå. Ingen täckningsgrad krävs, inga feature-specifika tester — de hör till separata issues (enligt #87:s scope).
- **Konsekvens:** Testrunnern blir kopplad till Vite som bundler. Byter teamet bort Vite senare måste testuppsättningen migreras samtidigt (Vitest är inte bundler-agnostisk som Jest).
- **Bevis:** issue #87
- Zaida

## 2026-09-14 — Portfolio-UI via `portfolioApi` (mock default)

- **Beslut:** UI hämtar Portfolio via `portfolioApi`. Default är mock-adapter. Http-adapter finns som skal. `VITE_USE_MOCK=false` byter senare.
- **Varför:** Sidan ska inte veta att datan är JSON. Samma kontrakt som Java (`GET /api/portfolio`).
- **Avgränsning:** ingen riktig fetch, ingen JWT-verify, ingen PUT för mål. Topbar-namn kommer från `useAuth()`, inte portföljen.
- **Kontrakt:** `GET /api/portfolio` — UI pratar mot `portfolioApi`, inte mot mockens filformat.
- **Bevis:** issue #43
- Tomac

## 2026-09-16 — Portföljläsning via `usePortfolio`

- **Beslut:** UI läser portföljen bara genom `usePortfolio()`. Hooken anropar `portfolioApi.getPortfolio()` via TanStack Query (`queryKey: ["portfolio"]`). Sidan pratar inte med `portfolioApi`, `useQuery` eller `portfolio.json`.
- **Varför:** Samma läsväg oavsett mock eller Java. Komponenterna ska inte skrivas om när HTTP slås på.
- **Avgränsning:** ingen `saveAllocation` (#83). Ingen riktig fetch. Drift och sparat mål stannar i sidan (`localStorage` + `computeDrift`).
- **Kontrakt:** samma `Portfolio`-typ som #24 / #43. Ingen ny dataform.
- **Bevis:** issue #82, PR #109
- Tomac

## 2026-09-17 — Målallokering sparas via `saveAllocation`

- **Beslut:** UI sparar mål genom `useSaveAllocation()` → `portfolioApi.saveAllocation()`. Mock-adaptern skriver `localStorage` (`ph_target_allocation`). HTTP-adaptern är stubbe (`PUT /api/allocation`).
- **Varför:** Spara-knappen ska inte äga persistence. Samma strömbrytare som läsning (`VITE_USE_MOCK`).
- **Avgränsning:** ingen riktig fetch. Fältnamn oförändrade (`targetAktierPct` / `targetStabiltPct`). Formulärets 100 %-länkning orörd (#81).
- **Kontrakt:** `StoredTarget` från #41. Query-nyckel `["portfolio"]` ogiltigförklaras efter lyckat spar.
- **Bevis:** issue #83
- Tomac
