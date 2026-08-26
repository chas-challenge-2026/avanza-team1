# UX Specification — Portfolio Health MVP

**Version:** 1.0  
**Date:** 2026-08-26  
**Status:** Draft for team approval  
**Author:** BMAD UX Expert, on behalf of Chas Academy Team 1  
**Based on:** `02-prd.md`, `04-api-contract.md`  
**UI language:** Swedish (AD-12)  
**Primary screen width:** 1280px laptop. Mobile is not an MVP target.

---

## 1. Job the UI must do

After login, Anna should answer three questions without help:

1. **Vad har jag?** — total in SEK, split by account and by asset class.
2. **Vad ville jag ha?** — her target mix, or a clear prompt to set one.
3. **Har det glidit?** — on track or drifted, with a number, not a lecture.

If the UI needs a fourth widget to make sense, the widget is probably out of scope.

---

## 2. Design principles

1. Numbers before charts. A bar is optional; the percents are mandatory.
2. One primary action per screen.
3. The 5% rule is never a surprise. Show the threshold next to the indicator.
4. Information ≠ advice. See banned phrases.
5. Trust extras are small and factual: FX source, as-of, “computed how”.
6. Empty and error states are designed, not leftover white pages.
7. Do not impersonate avanza.se. A calm student-product look is enough.

Visual tone: light background, clear typography, generous spacing, one accent colour for the warn state. No stock-ticker fireworks.

---

## 3. Information architecture

```
/login
/overview          default after login
/target            set / edit allocation
/holdings          optional P1, linked from overview as “Innehav”
```

No marketing landing page. No settings app. Logout lives in a simple header.

Header (authenticated):

- Product name: **Portföljhälsa**
- User first name
- Links: Översikt · Målallokering
- Logga ut

---

## 4. Screens

### 4.1 Login — `/login`

**Purpose:** get a session.

**Contains:**

- Email
- Password
- Button: **Logga in**
- Generic error: **Fel e-post eller lösenord**
- No “forgot password”

**States:** default, submitting, error, success → route to `/overview`.

**Not on this screen:** market commentary, seed-password hints in the UI. Credentials belong in README only.

---

### 4.2 Overview — `/overview`

**Purpose:** the demo screen.

**Layout, top to bottom:**

1. Title: **Din portfölj**
2. Total: **Totalt värde** + amount + **SEK**
3. Trust line: `Priser: {pricesSource.source}, {date}. Valuta: USD/SEK {rate} ({fx.source}, {date}).`
4. Indicator card (section 5)
5. Two breakdowns side by side if space allows, stacked if not:
   - **Per kontotyp** — ISK / KF / Depå + SEK
   - **Per tillgångsslag** — Aktier / Fonder / Övrigt + SEK
6. Live vs target row: `Aktier {live}% / mål {target}%` and same for funds
7. Disclaimer from API (`disclaimer`)
8. Text link: **Ändra målallokering**
9. Optional text link: **Visa innehav**

If `unvaluedHoldings` is not empty: yellow notice  
**Vissa innehav saknar pris eller valutakurs och ingår inte i totalen.**

If Pension comes up in conversation: do **not** add a zero Pension card. Out of scope stays out of the layout.

---

### 4.3 Target — `/target`

**Purpose:** save one portfolio-level mix.

**Contains:**

- Short intro: **Ange hur du vill att aktier och fonder ska fördelas. Summan ska vara 100 %.**
- Field **Aktier (%)**
- Field **Fonder (%)**
- Live sum. If sum ≠ 100, disable submit and show **Summan måste vara 100 %.**
- Hint under fields, only when no target exists: **Ett vanligt exempel är 60 / 40. Det är inte ett råd.**
- Button: **Spara mål**
- Success: toast or banner **Målet är sparat**, then back to overview (or stay and show saved values)

**Defaults:**

- If target exists: fill API values.
- If not: empty fields, not pre-posted 60/40. Placeholder text `60` / `40` is allowed.

No per-account sliders in MVP.

---

### 4.4 Holdings — `/holdings` (P1)

Table: ticker, name, class, account, qty, currency, value SEK.  
Enough for “where did the number come from?”. Not a trading ticket.

---

## 5. Indicator states

Drive the card from `drift.status`. Do not recompute the threshold in the client.

### `NO_TARGET`

- Title: **Ingen målallokering**
- Body: **Sätt ett mål för aktier och fonder så att du kan se när portföljen glider.**
- Action: button **Sätt mål**
- Visual: neutral, not green, not red

### `NO_BASIS`

- Title: **Ingen värderad aktie- eller fondportfölj**
- Body: **Vi kan inte räkna fördelningen ännu.**
- No warn colour

### `ON_TRACK`

- Title: **Nära din plan**
- Body: **Aktier är {live}% mot mål {target}%. Avvikelsen är {drift} procentenheter (gräns {threshold}).**
- Visual: calm positive (green or blue). Avoid celebration copy.

### `DRIFTED`

- Title: **Portföljen har glidit från målet**
- Body: **Aktier är {live}% mot mål {target}%. Avvikelsen är {drift} procentenheter, vilket är över gränsen på {threshold}.**
- Visual: warn (amber). Not emergency red unless accessibility contrast needs a stronger token.
- No instrument names in this card.

### OTHER present (P1)

One muted line:  
**Övriga innehav ingår inte i 60/40-beräkningen.**

---

## 6. Copy rules (advice boundary)

### Allowed

- Portföljen har glidit från målet
- Avvikelsen är 8 procentenheter
- Siffrorna är information, inte råd
- Valutakursen är hämtad från {källa}
- Sätt mål / Ändra målallokering

### Banned

- Du borde sälja / köpa
- Rebalansera nu
- Sälj AAPL / köp fonder
- Rekommenderad åtgärd
- Vi tycker att du ska…
- “Rätt” fördelning är 60/40
- Risken är för hög för dig

If a teammate wants stronger language for the competition pitch, put it in the **spoken demo**, not in the product chrome — and even then stay on the information side.

Disclaimer (API-owned, Swedish):  
**Siffrorna är information, inte råd. Vi rekommenderar inte köp eller sälj.**

---

## 7. Content inventory (minimum strings)

Keep a small `copy.ts` or equivalent so Swedish is not scattered in random JSX.

| Key               | Text                      |
| ----------------- | ------------------------- |
| `appName`         | Portföljhälsa             |
| `login.action`    | Logga in                  |
| `login.error`     | Fel e-post eller lösenord |
| `overview.title`  | Din portfölj              |
| `overview.total`  | Totalt värde              |
| `target.title`    | Målallokering             |
| `target.save`     | Spara mål                 |
| `target.sumError` | Summan måste vara 100 %.  |
| `nav.overview`    | Översikt                  |
| `nav.target`      | Målallokering             |
| `nav.logout`      | Logga ut                  |
| `asset.EQUITY`    | Aktier                    |
| `asset.FUND`      | Fonder                    |
| `asset.OTHER`     | Övrigt                    |
| `account.ISK`     | ISK                       |
| `account.KF`      | KF                        |
| `account.DEPA`    | Depå                      |

---

## 8. Interaction details

| Topic              | Rule                                     |
| ------------------ | ---------------------------------------- |
| Session lost (401) | Redirect to `/login`. Do not loop.       |
| Save target        | Disable double submit                    |
| Number inputs      | Numeric only, 0–100                      |
| Loading overview   | Skeleton or “Hämtar portfölj…”           |
| API 500            | **Något gick fel. Försök igen.** + retry |
| Logout             | Always available in header               |

Keyboard: login and target usable without a mouse. Not a full a11y audit for MVP, but labels must exist on inputs.

---

## 9. What we will not design now

- Dark mode
- Sparklines / candlesticks
- “What if I had 70/30” sliders
- Push notifications
- Mobile nav patterns
- Brand-copy of Avanza’s production app
- Onboarding carousel

A simple bar comparing live vs target is allowed if it ships after the numbers are correct.

---

## 10. Feedforward posture (UX specialist)

When the UX film arrives (week 8 in the course calendar):

1. Watch together
2. List 3–5 points
3. Decide do / defer
4. Log in `10-decision-log.md`

Do not rebuild the IA unless the specialist shows that Anna still cannot answer the three questions.

---

## 11. Acceptance (UX)

- Anna path works in a 1280px browser
- Four indicator states can be shown with fixtures
- Banned phrases do not appear in UI strings
- FX/as-of line is visible on overview
- Target form blocks sum ≠ 100
- Empty/error/loading are explicit

---

## 12. Next document

`07-epics-and-stories.md` — backlog rows that can become GitHub issues, with owners and acceptance criteria.

---

## 13. AI disclosure

Drafted with BMAD Fullstack Team assistance (Grok / BMad Orchestrator) on 2026-08-26.
