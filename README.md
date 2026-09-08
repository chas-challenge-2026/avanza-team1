# Avanza Portföljhälsa

Pedagogisk kodbas för kursen "Java Backend-utveckling med Spring Boot". v1 innehåller avsiktliga antipatterns — er uppgift är att refaktorera till v2.

v2-frontend (React) ligger i [frontend/](frontend/). Den körs separat från Spring. Deploy och drift beskrivs i [DRIFT.md](DRIFT.md).

## Status v2

Se [docs/v2-targets.md](docs/v2-targets.md) för fullständig målarkitektur och acceptanskriterier.

| Mål | Status | Detaljer |
|-----|--------|---------|
| Spring Boot 3.2 / Java 21 | ✅ klart | Uppgraderat från 2.7 / Java 11 |
| Servicelager (affärslogik ur controllers) | 🚧 påbörjat | AuthService, HoldingService, PortfolioService, AlertService finns — affärslogiken flyttas från controllers |
| Spring Data JPA + Hibernate | ⬜ ej påbörjat | |
| Flyway-migrationer | ⬜ ej påbörjat | |
| Spring Security + JWT (BCrypt) | ⬜ ej påbörjat | |
| Paginering på list-endpoints | ⬜ ej påbörjat | |
| IDOR-åtgärder (`@PreAuthorize`) | ⬜ ej påbörjat | |
| React 18-frontend (SPA) | 🚧 påbörjat | Dashboard shell med mockad portföljdata, se [frontend/README.md](frontend/README.md) |
| Native FX-modul (C++) | 🚧 påbörjat | Valutaomvandling, se `native/fx/` |
| Native Backtest-motor | ⬜ ej påbörjat | Planerad, se [native/README.md](native/README.md) |
| Native Risk-mått (BLAS) | 🚧 påbörjat | Planerad, se [native/README.md](native/README.md) |

## Snabbstart

Backend (v1):

```bash
cd infra && docker compose up
```

Öppna: http://localhost:8082

Frontend (mockad data, ingen Java krävs):

```bash
cd frontend && npm install && npm run dev
```

Öppna: http://localhost:5173

**Testanvändare:**

- `anna@example.com` / `password123`
- `erik@example.com` / `password123`

## Mappstruktur

```
chas-avanza/
├── DRIFT.md                   ← Drift, deploy och plattformskontrakt
├── backend/
│   └── AvanzaPortal/          ← Spring Boot 3.2 / Java 21 Maven-projekt
│       ├── pom.xml
│       ├── Dockerfile
│       └── src/main/java/se/comerit/avanza/
│           ├── AvanzaPortalApplication.java
│           ├── controller/
│           │   ├── AuthController.java
│           │   ├── DashboardController.java
│           │   ├── HoldingController.java
│           │   └── AlertController.java
│           └── service/               ← Påbörjad utflyttning av affärslogik
│               ├── AuthService.java
│               ├── PortfolioService.java
│               ├── HoldingService.java
│               └── AlertService.java
├── frontend/                  ← React 18 + Vite + TypeScript (v2)
│   ├── README.md
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── STYLING.md
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── Panel.tsx
│       │   └── Dashboard/
│       │       ├── PageHeader.tsx
│       │       ├── AccountsTable.tsx
│       │       ├── GoalAllocation.tsx
│       │       ├── AssetAllocation.tsx
│       │       ├── HoldingsTable.tsx
│       │       ├── WarningBanner.tsx
│       │       └── NoticesEmpty.tsx
│       ├── pages/
│       │   ├── Portfolio.tsx
│       │   ├── Holdings.tsx
│       │   └── Alerts.tsx
│       ├── types/
│       │   └── portfolio.ts
│       └── data/
│           └── portfolio.json              ← Mockad portföljdata
├── infra/
│   ├── docker-compose.yml
│   └── seed.sql
├── docs/
│   ├── architecture.md        ← Systembeskrivning
│   ├── known-bugs.md          ← Kända fel (er uppgiftslista)
│   ├── README-pain-points.md  ← Vad som spricker vid skala
│   └── v2-targets.md          ← Målarkitektur för v2
└── native/
    └── docs/
        └── README.md
    └── fx/
        └── fx.cpp
    └── risk/
        └── risk.c
        └── test/
            └── test_risk.c
    └── README.md              ← Planerade C/C++-moduler för v2
```

## Kända problem

Se [docs/known-bugs.md](docs/known-bugs.md) för fullständig lista. Höjdpunkter (kvarstående i v1-controllerna):

- **SQL-injektion** i login-formuläret (`AuthController.java`)
- **MD5-lösenord** utan salt
- **IDOR** — valfri inloggad användare kan ta bort andras innehav
- **Hårdkodad FX-kurs** USD/SEK = 10.45 (tre ställen i koden)
- **Inkonsekvent drifttröskel** — 5% i dashboard, 7% i notissidan
- **Ingen pagination** — alla innehav laddas till minnet varje request

Ett servicelager är tillagt (se `service/`), men affärslogiken — inklusive buggarna ovan — är ännu inte fullt utflyttad ur controllers.

## Vad ska ni bygga

Se [docs/v2-targets.md](docs/v2-targets.md) för fullständig kravspec och acceptanskriterier.

Sammanfattning: Spring Boot 3.2, Java 21, Spring Data JPA, Flyway, Spring Security + JWT, React 18-frontend, och minst ett nativt C/C++-riskmått via JNA.
