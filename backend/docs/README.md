# AvanzaPortal Backend

Backend för Avanza Team 1:s portföljapplikation. Den här README:n beskriver installation, körning, testning och kända begränsningar i backendprojektet.

Backend befinner sig i en övergång från äldre server-renderade MVC-flöden till REST API för frontend. Dokumentationen skiljer därför mellan funktioner som finns i koden och sådant som fortfarande är en begränsning eller målbild.

## Innehåll

- [Översikt och teknik](#översikt-och-teknik)
- [Installation](#installation)
- [Köra projektet](#köra-projektet)
- [API-översikt](#api-översikt)
- [Testning och teststatus](#testning-och-teststatus)
- [Beslutslogg](#beslutslogg)
- [Kända brister och avgränsningar](#kända-brister-och-avgränsningar)
- [Relaterad dokumentation](#relaterad-dokumentation)

## Översikt och teknik

Backend är en Spring Boot-applikation med både äldre MVC-flöden och nyare REST-endpoints. Den använder Java 21, Spring Boot 3.2.12 och PostgreSQL.

| Del | Teknik / status |
|---|---|
| Java | 21 |
| Spring Boot | 3.2.12 |
| Byggverktyg | Maven |
| Databas | PostgreSQL |
| Databasmigrationer | Flyway |
| Säkerhet | Spring Security, JWT och BCrypt-stöd |
| Dataåtkomst | Blandning av `JdbcTemplate` och JPA/repositories |
| Frontend | React/Vite i katalogen `frontend/` |
| Native integration | JNA-brygga till C++-backtestbibliotek |

Backend innehåller bland annat:

- REST-endpoints för login, portfolio och allocation
- MVC-vyer för äldre flöden
- service-klasser för affärslogik
- JPA-entiteter och repository-gränssnitt
- Flyway-migrationer
- en JNA-integration för backtest

Alla delar är inte fullt migrerade till målarkitekturen. Se [Kända brister och avgränsningar](#kända-brister-och-avgränsningar).

## Installation

### Förutsättningar

- Git
- Docker och Docker Compose
- Java 21 och Maven om backend ska köras direkt lokalt
- Node.js och npm om frontend ska köras

Klona repot och gå till projektroten:

```bash
git clone https://github.com/chas-challenge-2026/avanza-team1.git
cd avanza-team1
```

### Starta backend och databas med Docker Compose

Kör från katalogen `infra/`:

```bash
cd infra
docker compose up --build
```

Compose startar PostgreSQL och backend. Backend är tillgänglig på port `8082` lokalt. Flyway-migrationerna körs när applikationen startar.

Stoppa tjänsterna med `Ctrl+C`. Ta sedan bort containrarna med:

```bash
docker compose down
```

För att även ta bort den lokala databasvolymen och dess data:

```bash
docker compose down -v
```

> Compose-konfigurationen innehåller utvecklingsuppgifter för databasen. De är inte avsedda som produktionshemligheter.

## Köra projektet

### Backend med Maven

Starta PostgreSQL separat och kör sedan från backendkatalogen:

```bash
cd backend/AvanzaPortal
mvn spring-boot:run
```

Applikationen lyssnar på port `8082`.

Vid direktkörning behöver databasinställningarna passa din lokala miljö. Standard-URL:en i `application.properties` använder värdnamnet `db`, vilket normalt fungerar i Compose-nätverket men inte nödvändigtvis direkt från datorn. Konfigurera i så fall `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` och `SPRING_DATASOURCE_PASSWORD`.

### Frontend

Frontend körs separat från backend. Från repots rot:

```bash
cd frontend
npm install
npm run dev
```

Vite skriver ut adressen till utvecklingsservern, normalt `http://localhost:5173`.

I den aktuella repokonfigurationen används mockläge som standard:

```env
VITE_API_BASE_URL=http://localhost:8082
VITE_USE_MOCK=true
```

För att prova backendintegration behöver frontend konfigureras med `VITE_USE_MOCK=false`. Starta om Vite efter ändring av miljövariabler.

## API-översikt

Följande endpoints finns i backendkoden:

| Metod | Endpoint | Beskrivning | Åtkomst |
|---|---|---|---|
| `POST` | `/api/auth/login` | Autentiserar användaren och returnerar användardata samt JWT | Publik |
| `DELETE` | `/api/auth/logout` | Bekräftar utloggning med `204 No Content` | Publik |
| `GET` | `/api/portfolio` | Returnerar portföljdata för användaren från JWT | JWT krävs |
| `PUT` | `/api/allocation` | Sparar användarens målallokering | JWT krävs |
| `GET` | `/api/holdings` | Hämtar innehav för den autentiserade användaren | JWT krävs |
| `GET` | `/api/alerts` | Hämtar alerts för den autentiserade användaren | JWT krävs |
| `GET` | `/api/backtest/metrics` | Kör en batch av backtestanrop och returnerar metrics | Publik enligt säkerhetskonfigurationen |

Backend har även MVC-flöden, bland annat för dashboard, innehav och alerts. Alla MVC-funktioner har inte motsvarande REST-endpoint. Till exempel ska formulärflödet för att lägga till ett innehav inte tolkas som en färdig REST-endpoint för att skapa innehav.

### Login

Skicka login som JSON till `POST /api/auth/login`:

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "anna@example.com",
  "password": "password123"
}
```

Vid lyckad autentisering returneras användardata och en JWT. Skicka token i `Authorization`-headern för skyddade endpoints:

```http
Authorization: Bearer <token>
```

JWT är stateless. Logout-endpointen återkallar inte token på servern, så klienten behöver ta bort token.

## Testning och teststatus

Kör backendtester från `backend/AvanzaPortal/`:

```bash
mvn test
```

Kör hela Maven-verifieringen:

```bash
mvn clean verify
```

I den granskade backendkoden finns testklassen `PortfolioServiceTest`. Den innehåller tester för portföljberäkning, drift och valutaomvandling. Detta säger inte i sig att alla backendflöden är testade.


## Beslutslogg

Den här sammanfattningen beskriver beslut som framgår av implementationen. Lägg till eller länka till teamets fullständiga beslutslogg om den finns.

| Beslut | Skäl / riktning | Status |
|---|---|---|
| Uppgradera till Java 21 och Spring Boot 3.2.x | Flytta backend mot v2-målarkitekturen | Implementerat |
| Införa Spring Security och JWT | Skydda REST API med bearer-token | Implementerat, men se säkerhetsbegränsningarna nedan |
| Använda BCrypt för lösenord | Ersätta äldre lösenordshantering | BCrypt-stöd och migrationer finns |
| Införa DTO-kontrakt för REST | Ge frontend tydliga request- och responseformat | Används för bland annat login, portfolio och allocation |
| Införa Flyway och JPA | Versionshantera schema och etablera repository-baserad dataåtkomst | Delvis implementerat; `JdbcTemplate` används också |
| Behålla MVC-flöden under migreringen | Möjliggöra stegvis övergång till REST | MVC-flöden finns fortfarande kvar |
| Anropa C++-backtest från Java via JNA | Integrera native backtestfunktionalitet | JNA-brygga finns; körning kräver native-biblioteket |

## Kända brister och avgränsningar

Följande brister framgår av den granskade koden. Listan är inte en fullständig säkerhetsgranskning.

- **Hybridarkitektur:** MVC-vyer och REST-endpoints finns parallellt. Alla MVC-funktioner har inte ett motsvarande REST-flöde.
- **Blandad dataåtkomst:** JPA-entiteter och repositories finns, men flera services använder fortfarande `JdbcTemplate` och returnerar data som mappar.
- **Hårdkodade marknadsdata:** Portföljberäkningar använder exempelpriser och en fast USD/SEK-kurs. Värdena är inte live-data och ska inte användas som underlag för finansiella beslut.
- **Olika drift- och alertlogik:** Beräkningar finns på flera ställen och kan använda olika kategorier eller trösklar. Resultaten kan därför skilja sig mellan vyer och API.
- **SQL och pagination:** Det finns queries som bygger SQL med strängkonkatenering, bland annat i holdings- och alertflöden. Listor saknar genomgående pagination. Queries bör parametriseras konsekvent och stora listor begränsas.
- **Ägarskapskontroll vid skapande av innehav:** Metoden som lägger till innehav tar emot ett `accountId`. Ägarskapet till kontot behöver verifieras mot den autentiserade användaren innan operationen används i ett externt API-flöde.
- **JWT-nyckel:** `JwtService` skapar en ny signeringsnyckel vid applikationsstart. Token fungerar därför inte efter omstart och flera appinstanser kan inte validera varandras token. Använd en stabil och säkert konfigurerad nyckel utanför lokal demo.
- **Logout:** Logout-endpointen returnerar `204`, men återkallar inte token på servern. Klienten behöver ta bort token.
- **Databasuppgifter:** Utvecklingsuppgifter finns i versionshanterad konfiguration. Använd inte dessa som produktionsuppgifter.
- **Backtest och native-bibliotek:** Backtestintegrationen laddar ett native-bibliotek via JNA. Biblioteket måste vara byggt för rätt plattform och vara tillgängligt för JVM-processen.
- **Publikt backtest-endpoint:** `/api/backtest/metrics` är undantaget från autentisering i säkerhetskonfigurationen. Kontrollera att det är avsiktligt för den miljö där applikationen körs.
- **CORS:** CORS tillåter utvecklingsorigin `http://localhost:5173`. Andra miljöer kräver en avsiktlig konfigurationsändring.
- **Begränsad backendtestning:** Den synliga backendtestningen är begränsad. Läs inte in täckning för integration, autentisering eller säkerhet utan separata tester och körresultat.

en rekommenderad reservplan, inte en automatisk funktion i projektet.

## Relaterad dokumentation

- [architecture-v2.md](../../backend/docs/architecture-v2.md)
- [Arkitekturöversikt](../../docs/architecture.md) – beskriver den ursprungliga v1-arkitekturen och bör läsas som historisk bakgrund.
- [Kända v1-problem](../../docs/known-bugs.md) – pedagogiska problem från utgångskoden; alla punkter ska inte antas vara kvar oförändrade.


## Sammanfattning

Backend är en hybridlösning på väg från v1 till v2. JWT, REST-endpoints, DTO:er, Flyway och JPA finns i koden, men legacy MVC och `JdbcTemplate` används fortfarande. Läs därför dokumentationen som en beskrivning av nuläget och dess begränsningar, inte som ett påstående om att hela v2-målarkitekturen är färdig.