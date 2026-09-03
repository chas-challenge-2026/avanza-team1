# Definition of Done - v2 Godkänd-krav

En godkänd v2 måste uppfylla **alla** dessa kriterier för att kunna presenteras för Avanza.

---

## ⚠️ ALLRA VIKTIGASTE: TÄVLINGEN ≠ BETYGET

**Läs detta först!**

- **Tävlingsresultatet påverkar INTE ditt betyg**
- Finaldagen är INTE examinerande
- Du får betyg G eller VG baserat på slutleverans + kursmål
- Du får samma betyg oavsett om du går till final eller vinner

### Din Prioritering

1. **FÖRST:** Uppfylla alla 17 kursmål ← Din betyg
2. **SEDAN:** Lösa Annas problem + imponera på kund ← Kan ge finalplats
3. **BONUS:** Vinna tävlingen mot andra lag ← Coolt men inte avgörande

**Fokusera på kursmål, inte på att vinna tävlingen.**

---

---

## ✅ Kärnflödet Fungerar

Användaren kan gå igenom hela MVP-flödet från start till slut:

- [ ] Användare kan logga in
- [ ] Portföljöversikt visas med alla sparformer
- [ ] Värden är konverterade till SEK (FX-justering)
- [ ] Riskmått visas (allokering, volatilitet, Sharpe-ratio)
- [ ] Användare kan sätta målallokering
- [ ] Avvikelse-indikator visas tydligt
- [ ] Back-testing-motor kan köras
- [ ] Rebalanseringsförslag presenteras

**Acceptance Criteria:** Du kan köra genom hela flödet på ~5 minuter utan att något kraschar.

---

## 📖 Dokumentation

### README.md
Måste innehålla:

- [ ] **Projektbeskrivning** - Vad är Avanza Portföljhälsa?
- [ ] **Installationsinstruktioner** - Steg-för-steg setup
- [ ] **Hur man kör projektet** - Start backend, frontend, native
- [ ] **Hur man kör tester** - Testkommando för alla tre lager
- [ ] **Arkitektur-översikt** - Hur fungerar systemet?
- [ ] **Kända brister** - Vad fungerar inte än?
- [ ] **Avgränsningar** - Vad gjorde vi INTE?
- [ ] **Bransch-kontakt** - Länk till AGENT.md, PROJEKTKONTEXT.md

### Beslutslogg (DECISIONS.md eller i README)
Måste dokumentera:

- [ ] Varför C/C++ för back-testing (inte Java)
- [ ] Varför React + TypeScript (not Vue, Svelte, etc.)
- [ ] Varför Spring Boot 3.x (arkitektur-val)
- [ ] Varför dessa riskmått (volatilitet, Sharpe, max drawdown)
- [ ] Varför denna datamodell (User → Account → Holding)
- [ ] Varför dessa prioriteringar (vad gjorde vi först, vad skippade vi)

### Teststatus
Måste dokumentera:

- [ ] Unit tests täckning (% för varje lager)
- [ ] Integration tests status
- [ ] E2E tests (minst kärnflödet)
- [ ] Testresultat (vilka passar, vilka är TODO)
- [ ] Prestandatester (back-testing på 500 instrument)
- [ ] Kända testluckor (vad testar vi INTE än)

---

## 🔀 Git & Process

### Commits & Branches
- [ ] Alla commits följer format: `type(scope): message (#issue)`
- [ ] Alla branches följer namngivning: `type/#issue-description`
- [ ] Brancher länkas till GitHub issues
- [ ] Commits är små och logiska (inte "fixed stuff")

### Pull Requests
- [ ] Alla features/fixes är via PR
- [ ] PR:er är granskade av annan teammedlem
- [ ] Granskare kan INTE merga sitt eget godkännande
- [ ] PR-beskrivning refererar till issue och design-beslut

### Historia & Traceability
- [ ] `git log --graph --all --oneline` visar tydlig historia
- [ ] Individuella bidrag går att härleda (vem gjorde vad)
- [ ] Branches behålls för historik (tas INTE bort)

---

## 🎯 Kodkvalitet Per Lager

### Frontend (React + TypeScript)
- [ ] Alla komponenter har TypeScript-interfaces för props
- [ ] Alla funktioner har explicit return types (`JSX.Element`, `string`, etc.)
- [ ] CSS är i `.module.css`-filer (en per komponent)
- [ ] Ingen inline-styles (förutom helt enkla fall)
- [ ] Component-namngivning: PascalCase
- [ ] Variabler: camelCase
- [ ] CSS-klasser: camelCase
- [ ] Linting passerar (ESLint + Prettier)

### Backend (Java + Spring Boot)
- [ ] SOLID-principer följs
- [ ] Dependency injection används
- [ ] SQL-injections förhindras (JPA/Hibernate)
- [ ] Klasser: PascalCase
- [ ] Metoder/variabler: camelCase
- [ ] Konstanter: UPPER_CASE
- [ ] Exceptions hanteras ordentligt

### Native (C/C++)
- [ ] Minneshantering är säker (ingen minnesläcka)
- [ ] Destruktorer städar upp
- [ ] Back-testing-motor är snabb (< 2 sekunder för 500 instrument)
- [ ] Funktioner: snake_case
- [ ] Variabler: snake_case
- [ ] Konstanter: UPPER_CASE
- [ ] Defensive coding (nil checks, error handling)

---

## 🧪 Testing

Måste ha tester för:

### Frontend
- [ ] Unit tests för komponenter (Vitest/Jest)
- [ ] Test för varje kritisk user-interaction
- [ ] E2E test för kärnflödet (Cypress/Playwright)

### Backend
- [ ] Unit tests för service-lager (JUnit)
- [ ] Integration tests för repository (använder testdatabase)
- [ ] API tests för endpoints (REST endpoints testad)
- [ ] Test för FX-konvertering (edge cases)

### Native
- [ ] Unit tests för back-testing-motor
- [ ] Benchmark tests (prestanda)
- [ ] Test för edge cases (tom portfölj, negativa värden)

### Täckning
- [ ] Minst 70% kodtäckning på backend
- [ ] Minst 60% på frontend
- [ ] Kritiska paths täckade 100%

---

## 🚀 Prestanda & Skalning

- [ ] Back-testing på 500 instrument < 2 sekunder
- [ ] Portföljöversikt laddar < 1 sekund
- [ ] FX-konvertering på 10 år × 500 instrument är snabb
- [ ] Database-queries är optimerade (inga N+1 problem)

---

## 🤝 Feedback & Iterering

- [ ] Specialistfeedback från Avanza är hanterad
- [ ] Feedback-logg visar vad vi ändrade baserat på feedback
- [ ] Alla större ändringar är documenterade

---

## 🛟 Fallback-plan

Om livedemo kraschar:

- [ ] Vi har en fallback-demo (screencast eller slides)
- [ ] Vi kan visa statistik/resultat utan live-system
- [ ] Vi kan förklara arkitekturen på en whiteboard

---

## 📋 Slutlig Checklista Innan Inlämning

- [ ] `README.md` är komplett och testbar
- [ ] Alla tests passerar lokalt
- [ ] Ingen `console.log()` eller debug-kod
- [ ] Inga `TODO` eller `FIXME` kommentarer (eller de är dokumenterade)
- [ ] `.env`-filer är i `.gitignore` (inga secrets i git)
- [ ] Build-processen fungerar: `mvn clean build`, `npm run build`, etc.
- [ ] Databasen kan initieras från scratch (migrations fungerar)
- [ ] Hela flödet kan köras lokalt utan externa tjänster (om möjligt)
- [ ] Ingen dead code (oanvänd kod är borttagen)
- [ ] Branch är push:ad och uppdaterad mot `develop`

---

## 🎬 Definition of Ready (Innan vi börjar på en feature)

Innan vi börjar på något nytt:

- [ ] Issue är tydligt definierat
- [ ] Acceptance criteria är klara
- [ ] Vilka team arbetar på det? (frontend, backend, native)
- [ ] Beroenden är klara (t.ex. "backend måste göra X först")
- [ ] Estimat är gjort
- [ ] Branch är skapad: `feature/#ISSUE-description`

---

## Godkänd = Allt Ovan + Ett Fungerande System

**En godkänd v2 är INTE:**
- En perfekt UI/UX (bra är nog)
- Alla möjliga features (MVP räcker)
- 100% kodtäckning (70%+ är tillräckligt)
- Helt utan buggar (men kritiska flödet fungerar)

**En godkänd v2 ÄR:**
- Kärnflödet fungerar från start till slut
- Användaren kan back-testa strategier
- Allt är dokumenterat
- Git-historia är tydlig
- Kan köras lokalt och demoas
- Svarar på Annas behov: "Förklara min portfölj utan att göra det för komplicerat"

---

## 📅 Tidsplan & Milestones

**Kursen löper 12 veckor: 17 aug – 6 nov 2026**

Varje vecka har sprintmål, PL-tid (2,5 h/team) och fredagsdialoger.

### Kritiska Deadlines

| Vecka | Datum | Mileston | Din Deadline |
|-------|-------|----------|--------------|
| V1 | 17-21 aug | Kursstart + första dialogfredag | Miljö installerad |
| V2 | 24 aug | Sprintstart: planering | Backlog + MVP klara |
| V3-V5 | 31 aug-18 sep | Produktion med veckovisa checkpoints | README-struktur, tester, beslutslogg |
| **V6** | **24 sep, 16:00** | **CTO-underlag deadline** | **Kod, arkitektur, beslut klara** |
| V7 | 28 sep & 1 okt | CTO-feedforward + inspelad demo | Bearbeta feedback, demo-plan |
| V8 | 5 okt | UX & DM-feedforward | Omsätta feedback till prioritering |
| **V9** | **15 okt, 17:00** | **Kvaldemo-plan deadline** | **Stabilisering + presentation klara** |
| V10 | 22 okt | **KVALDEMO** - livedemo för kund | Live-demo, finalistval |
| **V11** | **26 okt, 16:00** | **Omtagsplan deadline** | **Bearbeta kundfeedback** |
| **V12** | **4 nov, 15:00** | **SLUTLEVERANS deadline** | **Allt inlämnat** |
| V12 | 5 nov, 09:00 | **FINALDAG** - livedemo för juryn | De 4 finalistteamen presenterar |
| - | 6 nov | Betyg sätts | **Individuell bedömning** |

### Fredagar = Dialogdag (Obligatoriskt)

- Inget projektarbete på fredagar
- Professionella dialoger med branschen
- Career workshops
- Skyddad tid för att bygga nätverk

**Fredagarna är också betygsgrundande** – detta är Färdighet 8: "Initiera och driva professionella dialoger inom IT"

### Vad Som Måste Vara Klart NÄR

**Före V6 (24 sep):**
- ✅ Kärnflödet fungerar
- ✅ README-struktur på plats
- ✅ Veckovisa checkpoints genomförda
- ✅ Teststatus dokumenterad
- ✅ Beslutslogg igång
- ✅ Git-historia är tydlig
- ⚠️ Inte perfekt – men visar riktning

**Före V9 (15 okt):**
- ✅ Kundfeedback från V7-V8 implementerad
- ✅ Demo-plan + fallback klar
- ✅ Stabilisering påbörjad
- ✅ Presentation-material förberett

**Före V12 (4 nov):**
- ✅ ALLT är godkänt enligt Definition of Done
- ✅ Kundfeedback från V10 implementerad
- ✅ Slutleverans är körbar
- ✅ README är komplett
- ✅ Teststatus dokumenterad
- ✅ Fallback på plats

### Prioritering Före CTO-Feedback

**Focus V3-V6 (31 aug - 24 sep):**
1. **Kärnflödet fungerar** - MVP-flödet måste gå igenom
2. **Riskmått & allokering** - Annas huvudbehov
3. **Back-testing-motor** - Prestandakritisk
4. **FX-justering** - Multivaluta-stöd
5. **Tester & dokumentation** - Visar kvalitet

**Skipp V3-V6:**
- Perfekt UI/UX (bra räcker)
- Alla möjliga features (MVP räcker)
- Polering (gör senare)

### Vad Examinatorn Tittar På

**Slutleverans bedöms på:**
- Funktionalitet (kursmål 1-4)
- Dokumentation (Git, README, beslut)
- Kodkvalitet (tester, granskning)
- Din individuella insats (Git-historia)
- Kursmål-uppfyllelse (alla 17)

**Finalplats bedöms INTE enligt kursmål** – betyget bygger på slutleveransen, inte på tävlingsresultatet.

---

**Klar? Då är vi klara!** 🎉
