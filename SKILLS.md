# Skills - AI-instruktioner för Avanza Team 1

**Denna fil definierar exakt hur AI:n löser vanliga uppgifter för projektet.**

Använd denna tillsammans med README.md för maximal träffsäkerhet och kraft.

---

## 🚀 Skill 1: Ge mig en lämplig commit-besked

**Syfte:** AI genererar en commit-besked i rätt format  
**Filer:** TEAMSTANDARDS.md (Git Workflow-avsnitt)  
**Relevans:** ⭐⭐⭐⭐⭐ (Mycket vanlig)

### Steg-för-steg
1. Läs användarens fråga: "Vad gjorde du sedan senaste commit?"
2. Öppna TEAMSTANDARDS.md, leta efter avsnitt "Git Workflow" och "Commit Format"
3. Identifiera vilken **type** det är:
   - `build` = Ny feature eller större arbete
   - `refactor` = Omstrukturering utan nya features
   - `fix` = Bugfix
   - `docs` = Dokumentation
   - `test` = Tester
4. Identifiera **scope** (område): frontend, backend, native, ci, etc.
5. Skriv kort **message** (vad gjordes, inte hur)
6. Lägg till **issue-nummer** i parentes: `(#26)`
7. Svara: `type(scope): message (issue#)`

### Exempel
```
Användare: "Jag skapade en ny React-komponent för dashboard panels och la till CSS-modules"
AI:n svarar: "build(frontend): Create dashboard panel components with CSS modules (#26)"
```

### Kvalitets-krav
- ✅ Format följer: `type(scope): message (#issue)`
- ✅ Message är på engelska
- ✅ Message är konkret och kort (< 60 tecken)
- ✅ Issue-nummer är med

---

## 🚀 Skill 2: Varför gjorde vi detta arkitektur-val?

**Syfte:** AI förklarar resonemang bakom tekniska beslut  
**Filer:** DECISIONS.md, AGENT.md  
**Relevans:** ⭐⭐⭐⭐ (Viktigt för förståelse)

### Steg-för-steg
1. Läs användarens fråga: "Varför använder vi C++ för back-testing?"
2. Öppna DECISIONS.md
3. Sök efter relevanta beslut (använd Ctrl+F)
4. Hitta avsnittet som motsvarar frågan
5. Presentera:
   - **Beslutet** (vad)
   - **Varför** (resonemang)
   - **Påverkan** (konsekvenser)
   - **Alternativ övervägda** (vad vi inte valde)

### Exempel
```
Användare: "Varför C++ för back-testing?"
AI:n svarar:
"Beslut: C/C++ för back-testing-motor (V1, Pre-planning)
Varför: Prestanda-kritisk komponent. 500 instrument × 5 år = massiv datamängd. Java är för långsamt.
Påverkan: Behöver C/C++ expert, komplexare deployment, men nödvändigt för kravställning.
Alternativ: Java (enklare integration, för långsamt), Python (snabbare dev, runtime-prestandaproblem)"
```

### Kvalitets-krav
- ✅ Svar är från DECISIONS.md (inte gissningar)
- ✅ Presenterar resonemang, inte bara valet
- ✅ Nämner alternativ som övervägdes
- ✅ Förklarar påverkan

---

## 🚀 Skill 3: Är detta godkänt enligt regler?

**Syfte:** AI validerar arbete mot Definition of Done  
**Filer:** DEFINITION_OF_DONE.md  
**Relevans:** ⭐⭐⭐⭐⭐ (Kritiskt för kvalitet)

### Steg-för-steg
1. Läs användarens beskrivning av vad de gjort
2. Öppna DEFINITION_OF_DONE.md
3. Kolla relevant sektion (kärnflöde, git, kodkvalitet, testing, etc.)
4. Jämför användarens arbete mot checkboxarna
5. Svara med:
   - ✅ Vad som är bra
   - ⚠️ Vad som saknas
   - ❌ Vad som inte uppfyller krav

### Exempel
```
Användare: "Jag har skrivit en ny React-komponent"
AI:n svarar:
"✅ Kodkvalitet:
- TypeScript-interfaces för props: behöver jag kolla
- CSS i .module.css: JA
- Ingen inline-styles: JA

⚠️ Saknas:
- Testar för komponenten
- TypeScript explicit return-type

❌ Krav som inte uppfyllts:
- Komponenten är inte testad"
```

### Kvalitets-krav
- ✅ Referera till DEFINITION_OF_DONE.md-sektioner
- ✅ Var konkret (visa vilka checkboxar som saknas)
- ✅ Ge actionable feedback (hur man fixar det)
- ✅ Var konstruktiv, inte kritiserande

---

## 🚀 Skill 4: Vad fokuserar vi på denna vecka?

**Syfte:** AI säger vad som är prioriterat denna vecka  
**Filer:** SCHEDULE.md, DEFINITION_OF_DONE.md (Vad som måste vara klart NÄR)  
**Relevans:** ⭐⭐⭐⭐ (Viktigt för prioritering)

### Steg-för-steg
1. Läs användarens fråga: "Vad fokuserar vi på vecka 3?"
2. Öppna SCHEDULE.md, leta efter V3
3. Se vad PL-mötet fokuserar på denna vecka (t.ex. "Fungerande delar, teststatus, README")
4. Öppna DEFINITION_OF_DONE.md, se "Prioritering Före CTO-Feedback"
5. Svara med:
   - **Vecka:** VX
   - **PL-fokus:** Vad granskas på mötet
   - **Deadlines:** Något som måste in denna vecka?
   - **Tips:** Vad bör prioriteras baserat på tidigare sprints

### Exempel
```
Användare: "Vad fokuserar vi på V3?"
AI:n svarar:
"V3 (31 aug - 4 sep) - Produktion Sprint 1
PL-fokus: Fungerande delar, teststatus, README

Prioritera:
1. Kärnflödet fungerar (MVP)
2. Tester skrivna för kritiska paths
3. README-struktur på plats

Deadline: Ingen Canvas-inlämning V3, men allt ska vara förberetat för CTO-underlag V6"
```

### Kvalitets-krav
- ✅ Använd SCHEDULE.md som källa
- ✅ Nämn vad PL fokuserar på
- ✅ Nämn eventuella deadlines
- ✅ Ge konkreta prioriteringar

---

## 🚀 Skill 5: Vad är kundproblem och MVP?

**Syfte:** AI förklarar varför vi bygger detta  
**Filer:** PROJEKTKONTEXT.md  
**Relevans:** ⭐⭐⭐⭐⭐ (Kritiskt för förståelse)

### Steg-för-steg
1. Läs användarens fråga: "Vad är kundproblem?"
2. Öppna PROJEKTKONTEXT.md
3. Presentera:
   - **Kunden** (Anna, 38 år, ~700k kr)
   - **Problemet** (Hon vet inte att hon driftat från 60/40 till 75/25)
   - **MVP-features** (Vad löser det?)
   - **Framgångskriterier** (Hur vet vi att vi löst det?)

### Exempel
```
Användare: "Varför bygger vi detta?"
AI:n svarar:
"Anna, 38 år, har ~700k kr sparat men saknar överblick.
Hennes plan: 60% aktier / 40% stabilt
Verkligheten: 75% aktier / 25% stabilt (hon märkte det inte!)

Vi bygger: En app som visar hennes samlad portfölj, riskmått, målallokering, och varnar när hon driftar.

Framgång: Anna kan logga in, se sin portfölj i SEK, och få varning när hon driftar från sitt mål."
```

### Kvalitets-krav
- ✅ Nämn kundens problem (inte bara features)
- ✅ Förklara varför det är ett problem
- ✅ Koppla till MVP-features
- ✅ Var konkret, inte abstrakt

---

## 🚀 Skill 6: Vilka tider har vi möten?

**Syfte:** AI säger när Team 1 har möten  
**Filer:** SCHEDULE.md  
**Relevans:** ⭐⭐⭐ (Viktigt för planering)

### Steg-för-steg
1. Läs användarens fråga: "När är PL-möte?"
2. Öppna SCHEDULE.md, avsnitt "Återkommande Moment"
3. Svara med:
   - **Tid** för mötet
   - **Vad som fokuseras** denna vecka
   - **Lunch** innan mötet
   - **Plats** (Slack Huddle)

### Exempel
```
Användare: "När har vi PL-möte?"
AI:n svarar:
"Team 1 möter PL:
Tisdag: 12:30-14:00 (Lunch innan 11:15-12:15)
Onsdag: 08:00-09:00 (efter behov, för individuell uppföljning)

Denna vecka fokuseras: [Läs från SCHEDULE.md för aktuell vecka]"
```

### Kvalitets-krav
- ✅ Exakta tider från SCHEDULE.md
- ✅ Nämn lunch-tid
- ✅ Nämn vad som fokuseras denna vecka
- ✅ Påminn om Slack Huddle som plats

---

## 🚀 Skill 7: Vilka beslut är tagna?

**Syfte:** AI visar besluts-historiken  
**Filer:** DECISIONS.md  
**Relevans:** ⭐⭐⭐ (Viktigt för kontext)

### Steg-för-steg
1. Läs användarens fråga: "Vilka arkitektur-beslut är tagna?"
2. Öppna DECISIONS.md
3. Visa relevanta beslut med:
   - **Beslutet** (vad)
   - **Datum** (när)
   - **Varför** (resonemang)
   - **Status** (✅ Implementerat, etc.)

### Exempel
```
Användare: "Vilka frontend-beslut är tagna?"
AI:n svarar:
"TypeScript för frontend (V1) - ✅ Implementerat
Varför: Type-safety, bättre DX, reducerar runtime-fel

React 18 + TanStack Query (V1) - ✅ Implementerat
Varför: Modern ecosystem, bra för async data fetching

CSS Modules (V1) - ✅ Implementerat
Varför: Component-scoped styling, undviker global CSS-konflikt"
```

### Kvalitets-krav
- ✅ Hämta från DECISIONS.md (inte gissningar)
- ✅ Visa resonemang, inte bara beslutet
- ✅ Nämn status
- ✅ Organisera efter område (frontend, backend, etc.)

---

## 🚀 Skill 8: Hjälp mig planera en sprint

**Syfte:** AI guidar sprintplanering baserat på schema och fokus  
**Filer:** SCHEDULE.md, DEFINITION_OF_DONE.md, PROJEKTKONTEXT.md  
**Relevans:** ⭐⭐⭐⭐ (Kritiskt för framgång)

### Steg-för-steg
1. Läs användarens fråga: "Planera V3-sprint för mig"
2. Öppna SCHEDULE.md, hitta V3
3. Se vad PL fokuserar på denna vecka
4. Öppna DEFINITION_OF_DONE.md, se vad som måste vara klart före CTO-underlag (V6)
5. Föreslå sprint-plan:
   - **Vecka:** VX
   - **PL-fokus:** Vad granskas på mötet
   - **Estimerad arbetsbelastning:** 40h/vecka
   - **Prioritering:** 1. Kärnflöde 2. Tester 3. Dokumentation
   - **Risker:** Vad kan gå fel?

### Exempel
```
Användare: "Planera V3 för mig"
AI:n svarar:
"V3 Sprint Plan (31 aug - 4 sep)
Tid: 40h/vecka

PL-fokus på tisdag: Fungerande delar, teststatus, README

Rekommenderad prioritering:
1. [16h] Kärnflödet fungerar end-to-end
   - Login, portfolio view, FX-justering
2. [14h] Unit tests för kritiska paths
   - Backend: FX-konvertering, riskmått
   - Frontend: Komponenter, data-hämtning
3. [10h] README-struktur, dokumentation

Risker:
- FX-konvertering kan vara komplex (låt C/C++ specialisten titta på det)
- Testing tar längre än beräknat (prioritera MVP-flödet först)"
```

### Kvalitets-krav
- ✅ Använd SCHEDULE.md för vecka-info
- ✅ Använd DEFINITION_OF_DONE.md för prioritering
- ✅ Dela 40h på realistiska uppgifter
- ✅ Identifiera risker från tidigare sprints

---

## 🚀 Skill 9: Är detta ett bra issue-description?

**Syfte:** AI validerar GitHub issues  
**Filer:** TEAMSTANDARDS.md (DoR-avsnitt), DEFINITION_OF_DONE.md  
**Relevans:** ⭐⭐⭐ (Viktigt för kvalitet)

### Steg-för-steg
1. Läs användarens issue-text
2. Öppna TEAMSTANDARDS.md, leta efter "Definition of Ready"
3. Kolla:
   - ✅ Issue är tydligt definierat
   - ✅ Acceptance criteria är klara
   - ✅ Vilka team arbetar på det?
   - ✅ Beroenden är dokumenterade
   - ✅ Estimat är gjort
4. Ge feedback

### Exempel
```
Användare: "Är detta issue bra? [issue-text]"
AI:n svarar:
"✅ Tydligt definierat: JA
✅ Acceptance criteria: JA (3 kriterier)
⚠️ Vilka team: Saknas - är det frontend/backend/native?
❌ Estimat: Saknas

Förslag: Lägg till 'Teams: Frontend + Backend' och 'Estimat: 8h'"
```

### Kvalitets-krav
- ✅ Referera till DoR-checkboxar
- ✅ Var konkret
- ✅ Ge actionable feedback

---

## 🚀 Skill 10: Kan jag commita detta till main?

**Syfte:** AI validerar att branchen är redo för merge  
**Filer:** TEAMSTANDARDS.md (Git Workflow), DEFINITION_OF_DONE.md  
**Relevans:** ⭐⭐⭐⭐ (Kritiskt för stabilitet)

### Steg-för-steg
1. Läs användarens branch-namn och commits
2. Öppna TEAMSTANDARDS.md, se "PR Requirements"
3. Verifiera:
   - ✅ Branch är från `develop`, inte från `main`
   - ✅ Commits följer format: `type(scope): message (#issue)`
   - ✅ PR är granskad av annan teammedlem
   - ✅ Granskaren kan INTE merga sitt eget godkännande
   - ✅ All kod följer DoD (tester, dokumentation, etc.)
4. Svara: OK att merge eller inte

### Exempel
```
Användare: "Kan jag merga denna branch till main?"
AI:n svarar:
"❌ INTE ÄNNU:
- Branch är från `develop` ✅
- Commits följer format ✅
- PR är granskad ✅
- ⚠️ Saknas: Tester för nya komponenten (zie DEFINITION_OF_DONE.md)
- ⚠️ Saknas: Uppdatering av README

Åtgärd: Lägg till tester, updatera README, sedan push och be om re-review"
```

### Kvalitets-krav
- ✅ Kolla ACTUAL branch-namn och commits
- ✅ Var strikt (inte för permissiv)
- ✅ Nämn exakt vad som saknas
- ✅ Ge nästa steg

---

## 🎯 Fallback-instruktion

**Om AI:n inte hittar något i dokumentationen:**

1. Säg till användaren: "Jag hittade inget i dokumentationen för denna fråga"
2. Föreslå närmaste relevant fil
3. Säg: "Lägg gärna till detta i DECISIONS.md eller SKILLS.md för framtiden"

---

## 📋 Kvalitets-checklist för alla Skills

Innan AI:n svarar, kolla:
- ✅ Är svaret från dokumentationen (inte gissning)?
- ✅ Är svaret konkret, inte abstrakt?
- ✅ Är svaret actionable (kan användaren göra något med det)?
- ✅ Är svaret i rätt format/stil för uppgiften?
- ✅ Refererar jag till relevanta filer?

---

**Uppdaterad:** 2026-09-03  
**Ansvarig:** Team 1 - Avanza Portföljhälsa  
**TAGS:** AI, instruktioner, skills, prompt, automation, commits, decisions, planning
