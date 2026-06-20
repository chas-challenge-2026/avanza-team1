# Arkitektur — Avanza Portföljhälsa v1

## Övergripande design

Spring Boot 2.7 monolith med Thymeleaf-vyer och JdbcTemplate direkt i controllers.

```
Browser → HTTP → Spring Boot (port 8082)
                    ↓
              @Controller (AuthController, DashboardController,
                           HoldingController, AlertController)
                    ↓
              JdbcTemplate (injicerat direkt i controllers)
                    ↓
              PostgreSQL 12 (via Docker)
```

## Teknikstack

| Lager | Teknik |
|---|---|
| Ramverk | Spring Boot 2.7.18 |
| Vy-motor | Thymeleaf 3 + Bootstrap 3 CDN |
| Datbaslager | Spring JdbcTemplate (direkt i controllers) |
| Databas | PostgreSQL 12 |
| Auth | HttpSession + MD5-lösenord |
| Bygg | Maven 3.8, Java 11 |
| Deploy | Docker Compose |

## Vad som saknas (avsiktligt)

- **Inget servicelager** — affärslogik ligger inline i controller-metoder
- **Ingen repository-abstraktion** — SQL-strängar direkt i controllers
- **Ingen säkerhetsfilter** — session-kontroll copy-pastad i varje metod
- **Ingen pagination** — alla rader laddas alltid
- **Ingen FX-integration** — USD/SEK hårdkodat till 10.45
- **Inga tester** — varken unit- eller integrationstester

## Kända designbeslut (medvetna fel för pedagogisk refaktorering)

Se `known-bugs.md` för fullständig lista.
