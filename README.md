# Avanza Portföljhälsa

Pedagogisk kodbas för kursen "Java Backend-utveckling med Spring Boot".
v1 innehåller avsiktliga antipatterns — er uppgift är att refaktorera till v2.

**v2-frontend (React) ligger i [frontend/](frontend/README.md).** Den körs separat från Spring.

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
├── backend/
│   └── AvanzaPortal/          ← Spring Boot 2.7 Maven-projekt
│       ├── pom.xml
│       ├── Dockerfile
│       └── src/main/java/se/comerit/avanza/
│           ├── AvanzaPortalApplication.java
│           └── controller/
│               ├── AuthController.java
│               ├── DashboardController.java
│               ├── HoldingController.java
│               └── AlertController.java
├── frontend/                  ← React 18 + Vite + TypeScript (v2)
│   └── README.md
├── infra/
│   ├── docker-compose.yml
│   └── seed.sql
├── docs/
│   ├── architecture.md        ← Systembeskrivning
│   ├── known-bugs.md          ← Kända fel (er uppgiftslista)
│   ├── README-pain-points.md  ← Vad som spricker vid skala
│   └── v2-targets.md          ← Målarkitektur för v2
└── native/
    └── README.md              ← Planerade C/C++-moduler för v2
```

## Kända problem

Se [`docs/known-bugs.md`](docs/known-bugs.md) för fullständig lista. Höjdpunkter:

- **SQL-injektion** i login-formuläret (`AuthController.java`)
- **MD5-lösenord** utan salt
- **IDOR** — valfri inloggad användare kan ta bort andras innehav
- **Hårdkodad FX-kurs** USD/SEK = 10.45 (tre ställen i koden)
- **Inkonsekvent drifttröskel** — 5% i dashboard, 7% i notissidan
- **Ingen pagination** — alla innehav laddas till minnet varje request
- **Affärslogik direkt i controllers** — inget servicelager

## Vad ska ni bygga

Se [`docs/v2-targets.md`](docs/v2-targets.md) för fullständig kravspec och acceptanskriterier.

Sammanfattning: Spring Boot 3.2, Java 21, Spring Data JPA, Flyway, Spring Security + JWT,
React 18-frontend, och minst ett nativt C/C++-riskmått via JNA.
