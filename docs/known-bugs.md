# Kända problem — v1 (pedagogiska)

Dessa fel är **avsiktliga** och ska hittas och åtgärdas av studenter i v2.

## Säkerhetsproblem (kritiska)

### SQL-injektion i AuthController
**Fil:** `AuthController.java`, metod `doLogin`
**Problem:** Login-queryn byggs med strängkonkatenering:
```java
String sql = "SELECT id, name, email FROM users WHERE email = '" + email
           + "' AND password_md5 = '" + md5 + "'";
```
En angripare kan logga in som valfri användare med: `' OR '1'='1`

**Fix:** Använd `PreparedStatement` eller `jdbcTemplate.queryForList(sql, email, md5)`.

### MD5-lösenord
**Fil:** `AuthController.java`, metod `md5Hash`
**Problem:** MD5 är kryptografiskt brutet sedan 1996. Regnbågstabeller finns för vanliga lösenord.
**Fix:** Byt till BCrypt via Spring Security: `BCryptPasswordEncoder`.

### IDOR — Innehav (Insecure Direct Object Reference)
**Fil:** `HoldingController.java`, metod `deleteHolding`
**Problem:** `DELETE FROM holdings WHERE id = ?` utan att verifiera att inneget tillhör inloggad användare.
Valfri inloggad användare kan ta bort andras innehav.
**Fix:** Lägg till `AND account_id IN (SELECT id FROM accounts WHERE user_id = ?)`.

### IDOR — Notiser
**Fil:** `AlertController.java`, metod `dismissAlert`
**Problem:** Samma mönster som ovan — ingen ägarskapskontroll på `UPDATE alerts SET dismissed = true WHERE id = ?`.

## Logikfel

### Inkonsekvent drifttröskel
**Filer:** `DashboardController.java` (0.05) och `AlertController.java` (0.07)
**Problem:** Dashboard varnar vid 5% avvikelse, notissidan beräknar notiser vid 7%. Användaren ser
olika resultat beroende på vilken sida de tittar på.
**Fix:** Extrahera till en konstant i en delad konfigurationsklass.

### Hårdkodad USD/SEK-kurs
**Fil:** `DashboardController.java`
**Problem:** `private static final double USD_TO_SEK = 10.45;`
Kursen ändras kontinuerligt. Portföljvärden i SEK är alltid fel.
**Fix:** Integrera ett FX-API (t.ex. ECB, Riksbanken, eller en betaltjänst).

### Hårdkodade kurspriser
**Filer:** `DashboardController.java`, `HoldingController.java`, `AlertController.java`
**Problem:** Aktiekurser hårdkodas på tre ställen oberoende av varandra. Lägg till ett nytt innehav
och det syns inte i beräkningarna.
**Fix:** Marknadsdataservice med caching.

### Felaktig Sharpe-beräkning
**Fil:** `DashboardController.java`
**Problem:** Sharpe beräknas per innehav med hårdkodad volatilitet (0.15). Det är inte meningsfullt —
Sharpe är ett portföljmått, inte ett per-tillgångsmått. Volatiliteten ska beräknas från historisk data.

## Skalningsproblem

### Ingen pagination
**Filer:** Alla controllers
**Problem:** `SELECT * FROM holdings WHERE ...` utan `LIMIT`. Med 10 000+ innehav laddas all data
till heapminnet varje request.
**Fix:** Spring Data `Pageable` + `LIMIT`/`OFFSET` i SQL.

### N+1-liknande mönster
**Fil:** `DashboardController.java`
**Problem:** 4 separata queries istället för JOIN. Ineffektivt och svårt att följa.
**Fix:** En välskriven JOIN-query eller Spring Data JPA med relationer.

### Ingen session-timeout-konfiguration
**Problem:** Sessioner lever tills servern startas om. Ingen max-age konfigurerad.
