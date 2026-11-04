# Kända problem – v1 och status i v2

## Syfte

v1-kodbasen innehöll avsiktliga problem som skulle identifieras och åtgärdas under arbetet med v2. Dokumentet beskriver problemen och deras status i backend på `develop`.

**Statusen nedan bygger på kod och dokumentation i repot. Den ersätter inte en säkerhetsgranskning eller en aktuell testkörning.** Ett problem från v1 markeras inte som löst om motsvarande v2-funktion fortfarande har en liknande brist.

## Säkerhetsproblem

### SQL-injektion i login

**v1-problem:** Login-queryn byggdes med strängkonkatenering av e-postadress och lösenord. Det kunde göra det möjligt att påverka SQL-frågan med användarinput.

**Status i v2: Åtgärdat i loginflödet.** Login ändrades till parametriserad databasåtkomst. Lösenordshanteringen har också migrerats från MD5 till BCrypt.

**Viktigt:** Detta innebär inte att all SQL i backend är parametriserad. Strängkonkatenering förekommer fortfarande i vissa dataåtkomstflöden, bland annat i holdings- och alertlogik. Granska och parametrisera varje query separat.

### MD5-lösenord

**v1-problem:** Lösenord lagrades eller verifierades med MD5, vilket inte är lämpligt för lösenordshashning.

**Status i v2: Åtgärdat enligt implementationen.** Backend har BCrypt-stöd och Flyway-migrationer för BCrypt-lösenord. Login använder lösenordshashning i stället för den gamla MD5-lösningen.

### IDOR – borttagning av innehav

**v1-problem:** Borttagning av innehav kontrollerade inte att innehavet tillhörde den inloggade användaren.

**Status i v2: Borttagningen kontrollerar ägarskap.** Delete-queryn begränsar borttagningen till innehav vars konto tillhör användaren.

**Kvarstående kontroll:** Skapande av innehav tar emot ett `accountId`. Ägarskapet till kontot behöver också kontrolleras mot den autentiserade användaren innan innehavet skapas.

### IDOR – avfärdande av alerts

**v1-problem:** En användare kunde försöka avfärda en alert genom att ange dess ID utan att ägarskapet kontrollerades.

**Status i v2: Ägarskapsvillkor finns i avfärdandeflödet.** Uppdateringen begränsas med användar-ID.

## Logik och marknadsdata

### Olika drifttrösklar

**v1-problem:** Dashboarden och alerts använde olika drifttrösklar.

**Status i v2: Kvarstår.** Den granskade koden använder fortfarande olika tröskelvärden i portfölj- och alertlogiken. Samla tröskel och beräkning på ett gemensamt ställe och verifiera att vyerna ger samma resultat.

### Hårdkodad USD/SEK-kurs

**v1-problem:** Valutakonvertering använde ett fast USD/SEK-värde.

**Status i v2: Kvarstår.** Den granskade portfölj- och alertlogiken använder fortfarande fasta exempelvärden. Dessa är inte livekurser och ska inte användas som finansiellt beslutsunderlag.

### Hårdkodade aktiekurser

**v1-problem:** Aktiekurser var hårdkodade på flera ställen och kunde skilja sig mellan beräkningar.

**Status i v2: Kvarstår delvis.** Portfölj- och holdingslogik använder fortfarande fördefinierade priser. En gemensam marknadsdatatjänst med lämplig cache skulle minska risken för inkonsekventa värden.

### Sharpe-beräkning

**v1-problem:** Sharpe-kvoten beräknades per innehav med hårdkodade antaganden i stället för att baseras på relevant historisk avkastning och risk.

**Status i v2: Kvarstår i portföljlogiken.** Den granskade `PortfolioService` beräknar fortfarande ett värde per innehav med hårdkodad volatilitet. Native riskfunktioner finns i repot, men deras existens innebär inte att den här beräkningen har ersatts.

## Skalning och dataåtkomst

### Ingen pagination

**v1-problem:** Innehavslistor kunde hämtas utan begränsning.

**Status i v2: Kvarstår.** Den granskade holdingslogiken hämtar listor utan genomgående pagination. Lägg till sidindelning eller annan tydlig storleksbegränsning innan större datamängder används.

### Flera separata databasfrågor

**v1-problem:** Dashboarddata byggdes genom flera separata frågor.

**Status i v2: Flera separata frågor används fortfarande.** Portföljlogiken hämtar bland annat konton, innehav, målallokeringar och alerts genom separata queries. Det är inte automatiskt ett N+1-problem, men frågorna bör mätas och ses över när datamängden växer.

## Sessioner och JWT

### Session-timeout

**v1-problem:** Sessioner saknade tydlig timeout-konfiguration.

**Status i v2: Den gamla sessionsmodellen har ersatts för API-autentisering.** Backend använder stateless JWT och token har en utgångstid. Session-timeout är därför inte samma mekanism för JWT-skyddade API-anrop.

**Kvarstående begränsning:** Den granskade `JwtService` skapar signeringsnyckeln vid applikationsstart. Token kan därför sluta fungera efter omstart, och flera instanser kan få olika nycklar. Använd en stabil nyckel som hanteras säkert via miljökonfiguration eller secrets.

## Sammanfattning

Följande v1-problem har åtgärdats eller fått en tydlig lösning i backend på `develop`:

- SQL-injektion i loginflödet har åtgärdats med parametriserad dataåtkomst.
- MD5 har ersatts med BCrypt.
- Ägarskapskontroll finns vid borttagning av innehav och avfärdande av alerts.
- API-autentisering använder stateless JWT i stället för den gamla sessionsmodellen.

Följande begränsningar kvarstår eller behöver verifieras vidare:

- SQL-frågor är inte parametriserade konsekvent i alla services.
- Ägarskap behöver kontrolleras även när innehav skapas.
- Drifttrösklar och alertlogik är inte helt enhetliga.
- Marknadspriser och valutakurser är fortfarande exempelvärden.
- Sharpe-beräkningen använder fortfarande förenklade, hårdkodade antaganden.
- Pagination saknas i vissa listflöden.
- JWT-nyckeln behöver konfigureras stabilt och säkert.

Se även [backendens README](../../backend//docs/README.md) och  [architecture-v2.md](../../backend/docs/architecture-v2.md).