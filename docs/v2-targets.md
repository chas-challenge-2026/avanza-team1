# v2 — Målarkitektur

## Bakgrund

v1 är en pedagogisk kodbas som demonstrerar vanliga antipatterns i Spring-applikationer.
v2 är en genomgripande refaktorering mot modern Java-arkitektur.

## Tekniska uppgraderingar

### Java & Spring

| Komponent | v1 | v2 |
|---|---|---|
| Java | 11 | 21 (Virtual Threads) |
| Spring Boot | 2.7.18 | 3.2.x |
| Data-lager | JdbcTemplate i controllers | Spring Data JPA + Hibernate |
| Migrations | Ingen | Flyway |
| Auth | MD5 + HttpSession | Spring Security + BCrypt + JWT |
| Vyer | Thymeleaf + Bootstrap 3 | React 18 + TypeScript + REST API |

### Arkitektur

```
React 18 (SPA)
    ↓ REST (JSON)
Spring Boot 3.2
    ├── @RestController
    ├── @Service (affärslogik)
    ├── @Repository (Spring Data JPA)
    └── Spring Security (JWT Bearer)
    ↓
PostgreSQL 15 (Flyway-hanterade migrations)
```

### Nativmoduler (C/C++ via JNA)

Beräkningstungt arbete som inte lämpar sig för JVM:

1. **Backtestmotor** (`native/backtest/`)
   - 5 år historisk data, upp till 500 instrument
   - Simulering av köp/sälj-strategier
   - JNA-brygga: `se.comerit.avanza.native.BacktestBridge`

2. **Rullande riskmått** (`native/risk/`)
   - Volatilitet (historisk, EWMA)
   - Sharpe-kvot (rullande 1-årsperiod, korrekt beräkning)
   - Max drawdown
   - Bearbetar tidsseriedata utan GC-press

3. **FX-pipeline** (`native/fx/`)
   - Historisk kursslookup (ECB-data)
   - Realtidshämtning via HTTP
   - Cachning med TTL

### API-design (v2 REST endpoints)

```
POST   /api/auth/login
DELETE /api/auth/logout
GET    /api/portfolio                          ← aggregerad vy
GET    /api/accounts
GET    /api/accounts/{id}/holdings?page=0&size=20
POST   /api/accounts/{id}/holdings
DELETE /api/holdings/{id}                     ← med ägarskapskontroll
GET    /api/alerts?dismissed=false
PUT    /api/alerts/{id}/dismiss
GET    /api/market/price/{ticker}             ← live-kurs
GET    /api/market/fx/{from}/{to}             ← live FX
```

## Vad studenter ska leverera

1. Migrera all affärslogik från controllers till `@Service`-klasser
2. Ersätt JdbcTemplate med JPA-entiteter och Spring Data repositories
3. Lägg till Flyway-migration för befintligt schema
4. Implementera Spring Security med BCrypt och JWT
5. Åtgärda alla IDOR-buggar med metodsäkerhet (`@PreAuthorize`)
6. Lägg till paginering på alla list-endpoints
7. Flytta till React 18-frontend med REST API
8. (Avancerat) Integrera minst ett nativt C/C++-riskmått via JNA

## Acceptanskriterier

- `mvn test` grönt med >80% kodtäckning på service-lagret
- OWASP ZAP-scan: inga High-severity fynd
- Lasttest med k6: P95 < 200ms vid 100 simultana användare med 10 000 holdings
- Flyway-migration kör utan manuella SQL-ändringar
