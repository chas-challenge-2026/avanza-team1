# Projektkontext: Avanza Portföljhälsa

**"Hur hjälper vi kunder med växande och allt mer komplexa portföljer att förstå sitt sparande bättre – upptäcka när deras strategi förändras och få en tydlig helhetsbild utan att göra det allt för komplicerat?"**

---

## Kundens Problem

### Anna - vår målkund

Anna är 38 år och har sparat i 10 år. Hon har ~700 000 kr fördelat på:
- ISK
- Kapitalförsäkring  
- Tjänstepension
- Svenska aktier
- Amerikanska aktier
- Flera fonder

**Hennes problem:**
- Hon vet hur mycket pengar hon har
- Men hon vet INTE hur mycket risk hon tar
- Hon vet INTE hur pengarna är fördelade
- Hon vet INTE hur valutakurser påverkar hennes sparande
- Hennes plan var **60% aktier / 40% stabilt**, men marknaden har tyst dragit henne till **75/25** utan att hon märkt det

**Konsekvensen:** Annas verkliga risk är mycket högre än hennes målallokering säger – och hon vet det inte.

### Varför Avanza förlorar kunder

Många Avanza-kunder använder externa verktyg för att förstå sitt sparande:
- ✗ Exporterar data manuellt
- ✗ Använder Excel och manuella kalkyler  
- ✗ Byter till tredjepartsverktyg (konkurrenter!)
- ✗ Försöker svara på "what-if"-frågor själva

**Idag lämnar kunder Avanza för externa verktyg bara för att förstå sitt eget sparande.**

---

## Vad Vi Bygger: MVP v2

### Kärnflödet

1. Användare loggar in
2. Ser **samlad portföljvy** över ALLA sparformer
3. Allt värde är konverterat till **SEK med korrekt FX-justering**
4. Kan sätta en **målallokering** (t.ex. 60% aktier / 40% stabilt)
5. Får en **avvikelse-indikator** när portföljen driftar för mycket från målet

### Features v2 Ska Klara

#### Samlad Portföljvy
- Alla sparformer i en vy (ISK, KF, depå, pension, utländska värdepapper)
- Värden uppdateras via polling från real-time-data
- Användaren ser **sin totala portfölj i SEK**

#### Multivaluta-stöd
- Stöd för USD, EUR, GBP, JPY, etc.
- FX-konvertering till SEK med historisk lookup
- Användaren kan växla basvaluta

#### Allokering & Riskmått
- **Fördelning:** Hur mycket är i aktier, obligationer, kontanter?
- **Volatilitet:** Hur mycket svänger värdet?
- **Max Drawdown:** Största fall från topp till botten (risk-perspektiv)
- **Sharpe-ratio:** Avkastning i förhållande till risk

#### Målallokering med Avvikelse-indikator
- Användare sätter målallokering: "Jag vill 60/40"
- App visar: "Du är på 75/25 – du har driftat från ditt mål"
- Signal när driften överskrider tröskel (t.ex. >5%)

#### Back-testing-motor
- Testa strategier mot **5 års historik**
- Upp till **500 instrument**
- Svar på "What-if"-frågor: "Hur hade det gått om jag investerat 60/40?"

#### Rebalanseringsförslag
- "Du bör flytta X från aktier till obligationer för att återgå till 60/40"
- Konkreta rekommendationer

#### Alerts & Historik
- Varning när strategi förändras
- Historik över tidigare avvikelser
- Påminnelse om rebalansering

---

## Teknisk Stack

**Frontend:** React 18 + TypeScript + TanStack Query
- Moderna chart-bibliotek för visualisering
- Responsive design för mobil & desktop

**Backend:** Java 21 + Spring Boot 3.x
- JPA/Hibernate för datamodellering
- Flyway för databasmigrationer
- REST API för frontend

**Native (C/C++):** Prestandakritiska beräkningar
- Back-testing-motor (5 år × 500 instrument = massiva datamängder)
- Rullande riskmått (volatilitet, max drawdown)
- FX-konvertering över stora tidsserier
- Måste vara snabb – Java är för långsamt här

**Database:** PostgreSQL 12 + Flyway
- Datamodell: User → Account → Holding → Transaction → Instrument
- PriceHistory, FxRate, TargetAllocation, Alert, BacktestRun

---

## Vad Vi INTE Gör

Vi tar över en trög v1 och gör den **begriplig, snabb och användbar**. Vi prioriterar:

✅ MVP-flödet (gör det enkelt först)
✅ Back-testing (svar på "what-if"-frågor)
✅ Korrekt FX-justering (multivaluta-stöd)
✅ Tydlig riskkommunikation (Annas största behov)

❌ Personalriserad rådgivning (vi ger info, inte råd)
❌ Alla möjliga riskmått (bara de viktigaste)
❌ Perfekt UI/UX (fungerande är bättre än perfekt)
❌ Alla möjliga sparformer (fokusera på de vanligaste)

**En junior konsult förstår problemet, prioriterar vad som skapar störst kundvärde, och avgränsar resten.**

---

## Framgångskriterier

✅ Anna kan logga in och se sin portfölj i SEK
✅ Hon kan sätta en målallokering
✅ Hon får ett varning när hon driftat från målet
✅ Hon kan back-testa strategier och svara på "what-if"-frågor
✅ Hon behöver inte längre externa verktyg

---

## Använd denna kontext när du frågar AI

När du ber Claude, ChatGPT eller någon annan AI om hjälp:

```
"Vi bygger en portföljövervakningsapp för Avanza.
Kunden (Anna) har många sparformer men saknar överblick.
Huvudproblemet: Hon vet inte att hennes portfölj driftat från 60/40 till 75/25.
Vi behöver visa henne detta tydligt utan att göra det för komplicerat.

Använd denna kontext från docs/team-standards-branchen:
- PROJEKTKONTEXT.md (denna fil)
- DEFINITION_OF_DONE.md (vad som krävs)
- AGENT.md (teamstandards)"
```

Med denna kontext ger AI mycket bättre vägledning på:
- Arkitektur-val (varför C++ för back-testing)
- Prioriteringar (vad som är viktigast)
- Feature-design (hur man kommunicerar risk tydligt)
- Test-strategi (vad som måste fungera)
