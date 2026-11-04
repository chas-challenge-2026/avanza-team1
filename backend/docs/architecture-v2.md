# AvanzaPortal Backend – v2-målarkitektur

## Bakgrund

v1 är en pedagogisk kodbas som visar vanliga antipatterns i Spring-applikationer. v2 är en refaktorering mot en modernare och mer hållbar Java-arkitektur med tydligare separation mellan presentation, affärslogik, dataåtkomst och säkerhet.

Backend befinner sig i en övergångsfas. Den innehåller både äldre MVC-flöden och nyare REST-funktionalitet för frontend-integration.

## Nuvarande läge

Backend använder bland annat:

- Java 21 och Spring Boot 3.2.x
- Spring Security och JWT-baserad autentisering
- BCrypt för lösenordshantering
- DTO-kontrakt för REST API
- Spring Data JPA och repositories
- Flyway för databasmigrationer
- Service-lager för affärslogik

REST API:t innehåller dokumenterade endpoints för autentisering, portfolio och allocation. Legacy MVC-kontrollers finns fortfarande kvar. Kontrollera den aktuella koden innan en funktion eller endpoint beskrivs som färdigimplementerad.

## Arkitektur

Målarkitekturen separerar ansvar mellan lagren:

```text
React frontend
    ↓ REST / JSON
Spring Boot backend
    ├── REST controllers       HTTP och API-kontrakt
    ├── Services               affärslogik
    ├── Repositories           dataåtkomst
    ├── Entities               persistensmodell
    └── Spring Security + JWT  autentisering och auktorisering
    ↓
Databas, hanterad med Flyway
```

Legacy MVC-kontrollers kan finnas kvar under migreringen, men ny frontend-funktionalitet bör utformas som REST API.

## Målbild

### 1. Tydlig ansvarsfördelning

- Controllers hanterar HTTP och anropar services.
- Services innehåller affärslogik och samordnar operationer.
- Repositories ansvarar för dataåtkomst.
- DTOs definierar API:ts in- och utdata.
- Säkerhetsregler hålls centrala och ska inte dupliceras i controllers.

### 2. Datamodell

Huvuddomänen omfattar:

- User
- Account
- Holding
- TargetAllocation
- Alert

Domändata ska hanteras genom JPA-entiteter och repository-gränssnitt. Databasändringar ska versionshanteras med Flyway.

### 3. Säkerhet och användarägarskap

Målprinciper:

- Lösenord lagras aldrig i klartext.
- BCrypt används för lösenordshashning och verifiering.
- JWT används för autentisering av skyddade API-anrop.
- Användaridentitet hämtas från den autentiserade säkerhetskontexten, baserad på token.
- Åtgärder på användarspecifika resurser kontrollerar att resursen tillhör den autentiserade användaren.
- Controllers ska inte innehålla egna sessionbaserade autentiseringskontroller.
- Hemligheter och miljöspecifik konfiguration ska inte hårdkodas i källkoden.

Ägarskapskontroller behövs även när en användare kan ange ett resurs-ID i en URL eller request. Att en användare är inloggad är inte i sig tillräckligt för att ge åtkomst till alla resurser.

### 4. REST API

API:t ska erbjuda tydliga, typade och frontend-anpassade endpoints. Följande är exempel på målbilden; de är inte ett påstående om att samtliga redan är implementerade:

```text
POST   /api/auth/login
DELETE /api/auth/logout
GET    /api/portfolio
PUT    /api/allocation
GET    /api/holdings
POST   /api/holdings
DELETE /api/holdings/{id}
GET    /api/alerts
PUT    /api/alerts/{id}/dismiss
```

Nya endpoints bör använda DTOs och följa samma autentiserings- och ägarskapsprinciper.

## Migreringsriktning

Arbetet från hybridarkitektur mot målbilden kan genomföras stegvis:

1. Inventera legacy MVC-flöden och dokumentera vilka som fortfarande används.
2. Säkerställ att affärslogik ligger i services, inte i controllers.
3. Flytta dataåtkomst till JPA-repositories där det är lämpligt.
4. Inför eller komplettera DTOs för API-anrop.
5. Migrera funktioner till REST endpoints när frontend behöver dem.
6. Lägg till autentisering och ägarskapskontroller för användarspecifika resurser.
7. Lägg alla schemaändringar i Flyway-migrationer.
8. Avveckla legacy-flöden först när de inte längre används och motsvarande funktionalitet är verifierad.

## Acceptanskriterier

Backendens v2-mål är uppnått när:

- Java 21 och Spring Boot 3.x används.
- Lösenord hanteras med BCrypt.
- JWT och Spring Security skyddar skyddade API-flöden.
- Åtkomst till användarspecifika resurser kontrolleras mot den autentiserade användaren.
- Databasschemat hanteras med Flyway.
- Affärslogik ligger i service-lagret.
- Controllers huvudsakligen hanterar HTTP och delegerar arbete till services.
- REST API-kontrakt är typade med DTOs.
- Databasåtkomst hanteras via repositories i stället för ad hoc SQL i controllers.
- Frontend kan använda JSON API för de funktioner som har migrerats.
- Legacy MVC-flöden som inte längre behövs har avvecklats.

## Kända skillnader mot målbilden

I den aktuella backendkoden finns fortfarande begränsningar som behöver hanteras innan målbilden är helt uppnådd:

- Dataåtkomst använder både `JdbcTemplate` och JPA-repositories.
- Legacy MVC-kontrollers och server-renderade vyer finns kvar.
- Vissa marknadspriser och valutakurser är exempelvärden, inte live-data.
- JWT-nyckeln genereras vid applikationsstart och behöver ersättas med en stabil, säkert konfigurerad nyckel.
- Ägarskapskontroll behöver verifieras för alla operationer på användarspecifika data, inklusive skapande av innehav.

Se [backendens README](../../backend//docs/README.md) för installationsinstruktioner, teststatus och fler kända begränsningar.
## Sammanfattning

AvanzaPortal Backend är på väg från en hybridlösning med legacy MVC och nyare REST-funktionalitet mot en tydligare lagerindelad backend. Dokumentera alltid skillnaden mellan funktioner som finns i den aktuella koden och funktioner som ingår i målbilden.