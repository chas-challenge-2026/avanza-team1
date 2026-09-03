# Beslutskatalog (BMAD) - Avanza Team 1

**Levande dokument som dokumenterar alla architektur- och design-beslut projektets gång.**

Uppdatera denna när ett beslut tas. Se varför vi gjorde valen vi gjorde.

---

## Beslutsformat

```
### Beslut: [Vad beslöts?]
- **Datum:** YYYY-MM-DD
- **Sprint/Vecka:** VX
- **Beslutfattare:** [Namn eller "Team 1"]
- **Varför:** [Resonemang bakom beslutet]
- **Påverkan:** [Vad påverkas av detta beslut?]
- **Alternativ övervägda:** [Vad övervägdes men förkastades?]
- **Status:** ✅ Implementerat / 🔄 Pågående / ⏸️ Pausat / ❌ Omvärderat
```

---



## V1 - Uppstart (17-21 Augusti)

### Beslut: TypeScript för frontend
- **Datum:** 2026-08-17
- **Sprint/Vecka:** V1
- **Beslutfattare:** Team 1
- **Varför:** Type-safety och bättre developer experience. Reducerar runtime-fel.
- **Påverkan:** Alla komponenter skrivs i .tsx, kräver build-step, bättre IDE-stöd
- **Alternativ övervägda:** JavaScript (snabbare setup, mindre verbose)
- **Status:** ✅ Implementerat

### Beslut: React 18 + TanStack Query för state management
- **Datum:** 2026-08-17
- **Sprint/Vecka:** V1
- **Beslutfattare:** Team 1
- **Varför:** Modern React ecosystem, bra för async data fetching, stor community
- **Påverkan:** Dependency på externa bibliotek, men etablerad standard
- **Alternativ övervägda:** Redux (mer komplext), Zustand (enklare men mindre kraftfullt)
- **Status:** ✅ Implementerat

### Beslut: CSS Modules för styling (en per komponent)
- **Datum:** 2026-08-20
- **Sprint/Vecka:** V1
- **Beslutfattare:** Team 1
- **Varför:** Component-scoped styling, undviker global CSS-konflikt, enkelt att underhålla
- **Påverkan:** Varje .tsx-fil får en .module.css-fil, större filstruktur men bättre isolation
- **Alternativ övervägda:** Tailwind CSS (utility-first, snabbare), styled-components (CSS-in-JS)
- **Status:** ✅ Implementerat

### Beslut: Git workflow med develop + feature branches
- **Datum:** 2026-08-19
- **Sprint/Vecka:** V1
- **Beslutfattare:** Team 1
- **Varför:** Standard Git flow, klara regler för vilken branch man jobbar på, undviker merge-conflicts
- **Påverkan:** Alla PRs måste granskas innan merge, feature-branches är kortlivade
- **Alternativ övervägda:** trunk-based development (snabbare men svårare att granska)
- **Status:** ✅ Implementerat

### Beslut: Commit-format: type(scope): message (#issue)
- **Datum:** 2026-08-19
- **Sprint/Vecka:** V1
- **Beslutfattare:** Team 1
- **Varför:** Konventionell committering gör git-historia läsbar, issue-tracking är tydlig
- **Påverkan:** Alla commits måste följa format, men gör review och bisect enklare
- **Alternativ övervägda:** Fri commit-stil (enklare men oläslig historia)
- **Status:** ✅ Implementerat

### Beslut: Ansvarsfullt AI-bruk genom strukturerad instruktion

**Reflektion: Ansvarsfullt AI-bruk i Team 1**

#### Problem
Om vi promptar AI varje gång, riskerar vi:
- Inkonsistenta svar
- Upprepning av instruktioner
- Att AI missar teamstandards
- Att det ser ut som vi "fuskar"

#### Lösning: TEAMSTANDARDS.md
Vi skapade en central dokumentation som:
- Definierar commit-format, kodstil, Git-workflow
- Är länkbar så AI läser den automatiskt
- Möjliggör tydlig kommunikation: "Följ TEAMSTANDARDS.md"
- Visar att vi styr AI:n ansvarsfullt, inte blindt

#### Ansvarsfullt för att:
✅ **Transparens** — Alla kan se AI:ns instruktioner
✅ **Konsistens** — AI följer samma regler som människor
✅ **Kontroll** — Vi styr AI:n, inte tvärtum
✅ **Lärande** — AI hjälper oss förstå, inte ersätta

- **Status:** ✅ Implementerat - Demonstrerar kursmål om ansvarsfullt AI-bruk

---

## V2 - MVP & Backlog (24-28 Augusti)

*Lägg till beslut här när de tas*

---

## V3-V5 - Produktion Sprint 1-3 (31 Aug - 18 Sep)

*Lägg till beslut här när de tas*

---

## V6 - CTO-Underlag (21-25 September)

*Lägg till beslut här när de tas*

---

## V7 - CTO-Feedforward (28 Sep - 2 Okt)

*Lägg till beslut här när de tas*

---

## V8 - UX & DM-Feedforward (5-9 Oktober)

*Lägg till beslut här när de tas*

---

## V9 - Förbered Kvaldemo (12-16 Oktober)

*Lägg till beslut här när de tas*

---

## V10 - Kvaldemo (19-23 Oktober)

*Lägg till beslut här när de tas*

---

## V11 - Omtag (26-30 Oktober)

*Lägg till beslut här när de tas*

---

## V12 - Slutleverans & Final (2-6 November)

*Lägg till beslut här när de tas*

---

## Arkitektur-Beslut (Långsiktiga)

### Beslut: Java 21 + Spring Boot 3.x för backend
- **Datum:** 2026-08-17
- **Sprint/Vecka:** V1 (Pre-planning)
- **Beslutfattare:** Team 1
- **Varför:** Modern Java, LTS-version, Spring Boot 3.x stöder Jakarta EE
- **Påverkan:** Kräver Java 21 installerad, etablerad standard i branschen
- **Alternativ övervägda:** Node.js (snabbare setup), Go (enklare deployment)
- **Status:** ✅ Implementerat

### Beslut: C/C++ för back-testing-motor
- **Datum:** 2026-08-17
- **Sprint/Vecka:** V1 (Pre-planning)
- **Beslutfattare:** Team 1
- **Varför:** Prestanda-kritisk komponent (500 instrument × 5 år historik). Java är för långsamt.
- **Påverkan:** Behöver C/C++ expert, komplexare deployment, men nödvändigt för kravställning
- **Alternativ övervägda:** Java (enklare integration men för långsamt), Python (snabbare dev men runtime-prestandaproblem)
- **Status:** ✅ Implementerat

### Beslut: PostgreSQL för databas
- **Datum:** 2026-08-17
- **Sprint/Vecka:** V1 (Pre-planning)
- **Beslutfattare:** Team 1
- **Varför:** Open-source, robust, bra för finansiell data, stöd för komplexa queries
- **Påverkan:** Behöver PostgreSQL installerad, migrationer med Flyway
- **Alternativ övervägda:** MySQL (enklare setup), Oracle (dyrare, overkill för denna skala)
- **Status:** ✅ Implementerat

### Beslut: Flyway för databasmigrationer
- **Datum:** 2026-08-17
- **Sprint/Vecka:** V1 (Pre-planning)
- **Beslutfattare:** Team 1
- **Varför:** Versionkontroll av databas-schema, reproducible deployments, enkel integration med Spring Boot
- **Påverkan:** Alla schema-ändringar går via migrationsfiler, tydlig historia
- **Alternativ övervägda:** Liquibase (mer komplext), manual SQL (ingen versionkontroll)
- **Status:** ✅ Implementerat

---

## Hur Man Använder Denna Beslutslogg

1. **När ett beslut tas:** Lägg till det här med datum, resonemang och påverkan
2. **Vid review:** Referera till detta dokument för att förstå **varför** vi gjorde valen
3. **Vid omvärdering:** Uppdatera status om ett beslut ändras eller förkastas
4. **För AI-agenter:** Läs detta för att förstå arkitektur-rationale bakom projektet

---

**Senast uppdaterad:** 2026-09-03
**Ansvarig:** Team 1 - Avanza Portföljhälsa
