# Lathund — docs/v2 (läs den här först)

**För vem:** hela teamet  
**När:** när du glömt vad en fil är till för  
**Regel:** du ska inte kunna paketet utantill. Du ska veta _vilken dörr_ du öppnar.

Det här paketet finns för att JS, Java och C++ ska kunna jobba utan att gissa.

---

## På 30 sekunder

Vi bygger **Portföljhälsa**: logga in → se hela portföljen i SEK → sätt mål 60/40 (aktier/fonder) → se om det glidit **5 procentenheter**.

Ingen rådgivning. Ingen auto-rebalans. Ingen pension i MVP. En C++-modul (eller Java-fallback). Klar kärna **slutet av vecka 8**.

---

## Vilken fil när?

| Jag vill…                                | Öppna                            |
| ---------------------------------------- | -------------------------------- |
| Fatta vad vi bygger                      | `01-project-brief.md`            |
| Se om en idé är med i MVP                | `02-prd.md` (P0 = ja, P2 = nej)  |
| Fatta hur tre språk möts                 | `03-architecture.md`             |
| Bygga frontend eller API mot samma JSON  | `04-api-contract.md`             |
| Bygga C++ eller Java-fallback            | `05-native-contract.md`          |
| Rita skärm / skriva svensk text          | `06-ux-spec.md`                  |
| Skapa eller ta en GitHub-issue           | `07-epics-and-stories.md`        |
| Se vem som gör vad den här veckan        | `08-team-board.md`               |
| Veta om en uppgift får startas / är klar | `09-definition-of-ready-done.md` |
| Komma ihåg _varför_ vi valde X           | `10-decision-log.md`             |
| Logga att jag använt AI                  | `11-ai-usage-log.md`             |
| Se vad som faktiskt är testat            | `12-test-status.md`              |
| Koppla mitt arbete till kursmål          | `13-course-goals-map.md`         |
| Se veckans mål till MVP                  | `14-sprint-plan-to-mvp.md`       |
| Hela kartan på engelska                  | `00-index.md`                    |

v1-skolfiler (`docs/known-bugs.md`, `v2-targets.md`, …) är **arv**, inte vår att-göra-lista.

---

## Låsta beslut (rita på tavlan)

1. Tröskel **5 %**, samma överallt, `>=` räknas som drift.
2. Mål = **aktier/fonder per person**, inte ISK/KF/Depå.
3. **Pension** är avgränsat.
4. **Inget investeringsråd** i UI.
5. **En** FX-källa med datum. Inte `10.45` på tre ställen.
6. **En** native-modul + fallback.
7. Betygssikte **G**. Skolans max-v2 är en meny.
8. **Fredag = inte projekt.**

---

## Vem gör vad (default)

| Person | Börja här                              |
| ------ | -------------------------------------- |
| Tomac  | lathund + issues + frontend-skal       |
| Zaida  | mock + översiktsskärm                  |
| Björn  | login + mål-formulär                   |
| Erik   | auth + att appen fortfarande startar   |
| Rasha  | priser, FX, aggregering, target-tabell |
| Pär    | C-funktionen                           |
| Henrik | C-tester + native README               |

---

## Tre kontrakt — det enda ni måste “kunna”

```
React  ←  04-api-contract.md  →  Spring
Spring ←  05-native-contract.md →  C/C++
Anna   ←  06-ux-spec.md         →  skärmarna
```

Ändrar ni ett fältnamn: ändra kontraktet **först**, koda sen.

---

## Veckan i en mening

| Vecka  | Mål                                                |
| ------ | -------------------------------------------------- |
| 2 (nu) | Dokument + issues + första rails                   |
| 3      | Inloggning + seed som klarar 60/40 + ctest på gång |
| 4      | `GET /api/portfolio` med riktiga SEK-siffror       |
| 5      | Hela Annas flöde funkar, fult är ok                |
| 6      | CTO-underlag, inte ny arkitektur                   |
| 7      | Inspelad demo                                      |
| 8      | Frys MVP                                           |

---

## Måndagsfrågor (5 min)

1. Vad är veckans _ett_ mål?
2. Vilken issue tar jag?
3. Blockerar jag någon annans kontrakt?
4. Vad kan en lärare se att _jag_ gjort på torsdag?

---

## Vad ni _inte_ ska göra i möten

- Läsa alla 15 filer högt.
- Debattera k6, ZAP, Java 21 eller tre native-moduler.
- Låta en person “äga dokumenten” så att resten slutar öppna dem.
