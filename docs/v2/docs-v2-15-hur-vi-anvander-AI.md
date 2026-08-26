# Hur vi använder AI i det här projektet

**Version:** 1.0  
**Datum:** 2026-08-26  
**För vem:** hela Team 1  
**Läs när:** du kört fast, eller innan du klistrar in AI-kod i en PR  
**Kopplat till:** kursmål 7–8 och färdighet 17, `11-ai-usage-log.md`

Det här är inte ett förbud. Det är en arbetsordning så att AI hjälper _ert_ projekt och inte ett påhittat.

---

## 1. Grundregeln

AI är en kollega som inte var på mötet.

Den kan inte era beslut förrän ni **visar dokumenten**.  
Den får inte byta API, tröskel eller scope bara för att svaret låter självsäkert.

**Kontraktet vinner över chatten.**  
`docs/v2/04-api-contract.md` och `docs/v2/05-native-contract.md` gäller tills teamet ändrar dem i beslutsloggen.

---

## 2. När AI är bra

- Du förstår ungefär _vad_ som ska hända, men inte _varför koden faller_
- Du vill ha en testidé eller en förklaring av v1-kod
- Du vill ha en formulering till README som du sen redigerar
- Du kör fast i CORS, CMake, BCrypt, eller “var ska den här procentsatsen räknas?”

## 3. När AI är farlig

- Den föreslår Pension, auto-rebalans, “sälj AAPL”, 7 % tröskel eller `USD_TO_SEK = 10.45`
- Den hittar på nya JSON-fält som inte finns i `04`
- Den skriver en lösning du inte kan rita på tavlan
- Du klistrar in resultatet utan att köra det
- Du låter den läsa skolans `docs/v2-targets.md` och tror att det är vår MVP

Skolans `v2-targets.md` är en **meny**. Vår sanning ligger i `docs/v2/` och lathunden.

---

## 4. Vilka filer du skickar med (inte hela mappen)

Hela `docs/v2` på en gång gör modellen slö och splittrad. Ta 1–3 filer.

| Jag har fastnat i…                  | Skicka med                                            |
| ----------------------------------- | ----------------------------------------------------- |
| Översikt / “vilken fil öppnar jag?” | `LATHUND-sv.md`                                       |
| Login, 401, fel JSON, CORS          | `04-api-contract.md` (+ ev. `03` avsnittet om flöden) |
| Driftberäkning, C-test, JNA         | `05-native-contract.md`                               |
| Text på skärmen, indikatorns lägen  | `06-ux-spec.md`                                       |
| “Ska vi bygga X?”                   | `02-prd.md` eller `10-decision-log.md`                |
| Vem som äger storyn                 | `07` + `08`                                           |
| Kursmål / examination               | `13-course-goals-map.md`                              |

Klistra också in **felet och den relevanta koden**. Dokument utan stack trace är halva bilden.

---

## 5. Mini-prompt (kopiera)

```text
Projekt: Avanza Portföljhälsa, Chas Academy Team 1, brownfield v1 → MVP.

Jag är [namn], lane [js / java / cpp], story [t.ex. E5-S2].

Sanning finns i docs/v2/. Läs särskilt:
- [fil 1]
- [fil 2]

Använd INTE docs/v2-targets.md som kravlista.

Låst i projektet:
- drifttröskel 5 procentenheter, >= räknas som drift
- målallokering = aktier/fonder på användarnivå, inte kontotyp
- pension är utanför MVP
- ingen investeringsrådgivning i UI eller API-texter
- en FX-källa med källa + datum; inte hårdkodat 10.45
- en C/C++-modul för drift + Java-fallback; JNA är bonus

Problem:
[1–4 meningar om vad som händer och vad du förväntade dig]

Kod och/eller felmeddelande:
[klistra in]

Gör så här:
1. Förklara trolig orsak.
2. Föreslå minsta möjliga ändring.
3. Hitta inte på nya API-fält eller nya features.
4. Om kontraktet måste ändras: säg det först, koda det inte tyst.
5. Skriv inget jag inte kan förklara för teamet imorgon.
```

Byt bara det som står i hakparenteser.

---

## 6. Efter att AI svarat — innan du committar

Kryssa för dig själv:

- [ ] Jag kan förklara ändringen utan att öppna chatten
- [ ] Fältnamn matchar `04` eller `05`
- [ ] Ingen ny 10.45 / MD5 / 7 % / säljknapp
- [ ] Tester eller manuell klick enligt storyn är körda
- [ ] En rad i `11-ai-usage-log.md` om AI faktiskt påverkade beslut, kod eller analys

Om du inte kan förklara det: merga inte. Be en lagkamrat i samma lane, eller ställ en bättre fråga.

---

## 7. Logga användningen

Kursen vill se att du _använder_ AI och _äger_ resultatet.

En rad i `11-ai-usage-log.md` räcker:

- vad du frågade
- vad du behöll
- vad du slängde
- hur du verifierade

Tommas rad **A-001** är redan ifylld för själva dokumentationspaketet. Era rader kommer när ni kodar.

---

## 8. Fördelning per lane (så ni inte frågar om allt)

| Lane | AI får gärna                      | AI ska inte                                    |
| ---- | --------------------------------- | ---------------------------------------------- |
| JS   | komponenter, fixtures, fetch/CORS | hitta på backend-JSON                          |
| Java | service-tester, BCrypt, queries   | släppa IDOR “tills vidare” utan att skriva det |
| C++  | CMake, fixturer, header           | läsa databasen från C                          |

Tvärspråkiga frågor (“hur ska React prata med Spring?”) ska hänvisa till **`04`**, inte till tre olika chattar med tre olika fältnamn.

---

## 9. En mening att komma ihåg

Dokumenten är minnet. Du är omdömet. AI är snabbheten däremellan.
