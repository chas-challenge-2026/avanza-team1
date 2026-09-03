# Teamstandards & Agent-riktlinjer

Det här dokumentet definierar standards och konventioner för alla team i projektet. Använd det när du frågar AI-agenter (Claude, ChatGPT, etc.) om hjälp.

---

## 📚 DOKUMENTÖVERSIKT - Start här!

Det här projekt-repot innehåller tre viktiga filer för teamet:

| Fil | Innehål |
|-----|---------|
| **AGENT.md** | Teamstandards, commits, branches, kodstil |
| **PROJEKTKONTEXT.md** | Kundens problem, vad vi bygger, MVP-features |
| **DEFINITION_OF_DONE.md** | Godkänd-krav, checklista, vad som krävs |

**Använd denna länk när du delar med AI-agenter:**
```
https://github.com/chas-challenge-2026/avanza-team1/tree/docs/team-standards
```

**Instruera AI så här:**
```
"Läs från denna GitHub-branch (docs/team-standards) för kontext:
- AGENT.md (teamstandards)
- PROJEKTKONTEXT.md (vad vi bygger)  
- DEFINITION_OF_DONE.md (godkänd-krav)

Använd denna kontext när du ger vägledning om kod, arkitektur och prioriteringar."
```

---

## 1. Förstå commit-meddelanden

### Varför vi har ett standardformat

När flera personer arbetar på samma projekt blir commit-meddelanden "historien" om din kod. Ett välformat commit-meddelande:
- **Hjälper alla förstå** vad som ändrades och varför
- **Gör det enkelt att söka** efter specifika typer av ändringar
- **Automatiserar processer** (verktyg kan läsa commits för att generera ändringsloggar)
- **Bevarar kunskap** för framtida utvecklare (eller din framtida själv!)

### Formatet

```
type(scope): message
```

Låt oss bryta ned detta:

#### `type` - Vilken sorts ändring är detta?

Tänk på `type` som "kategorin" för ditt arbete. Det svarar på: "Vad gjorde jag precis?"

| Type | Betydelse | När använder man det |
|------|-----------|---------------------|
| `feat` | **Feature** - något nytt | Lägger till ny komponent, ny API-endpoint, ny funktionalitet |
| `fix` | **Fix** - buggfix | Reparerar bruten funktion, löser krasch, åtgärdar bug |
| `refactor` | **Refactoring** - förbättrar kod utan att ändra beteende | Reorganiserar kod, extraherar CSS, förbättrar prestanda |
| `docs` | **Dokumentation** - skriver eller uppdaterar docs | Uppdaterar README, lägger till kommentarer, skapar guider |
| `style` | **Stil** - CSS/visuella ändringar | Ändrar färger, layout, typsnitt, avstånd |
| `test` | **Tester** - lägger till eller reparerar tester | Skriver unit tests, reparerar felande tester |
| `build` | **Build/Config** - setup-ändringar | Uppdaterar build-verktyg, dependencies, konfiguration |
| `chore` | **Chore** - underhålls-uppgifter | Uppdaterar dependencies, städar upp oanvänd kod |

**Exempel:**
- `feat` - "Jag lade till en ny login-funktion"
- `fix` - "Jag fixade logout-knappens krasch"
- `refactor` - "Jag organiserade CSS i moduler"
- `docs` - "Jag skrev en API-guide"

#### `scope` - Vilken del av projektet?

`scope` begränsar *var* ändringen hände. Det hjälper dig snabbt hitta relaterade commits.

| Scope | Betyder |
|-------|---------|
| `frontend` | JavaScript/React/TypeScript frontend |
| `backend` | Java backend-tjänster |
| `native` | C/C++ native-kod |
| `docs` | Dokumentationsfiler |

**Varför detta spelar roll:**
- Du kan snabbt hitta all frontend-ändringar: `git log --grep="frontend"`
- Teammedlemmar kan fokusera på sitt område: "Visa alla native-ändringar"
- Det är lättare att se mönster: "Alla backend-ändringar misslyckas tests?"

#### `message` - Vad ändrades exakt?

Meddelandet ska vara **kort, tydligt och i imperativ form** (som ett kommando).

**Bra exempel:**
- `feat(frontend): add holdings table component` ✅
- `fix(backend): resolve null pointer exception in user service` ✅
- `refactor(native): optimize memory allocation` ✅

**Dåliga exempel:**
- `feat(frontend): added a component that displays holdings` ❌ (för långt)
- `feat(frontend): fixing the thing` ❌ (otydligt)
- `feat(frontend): Fixed the holdings table` ❌ (fel tempus - använd imperativ)

**Skrivtips:** Fyll i denna mening: "Den här commiten kommer att ___"
- "Den här commiten kommer att **lägga till holdings table-komponent**" ✅
- "Den här commiten kommer att **fixa null pointer exception**" ✅

### Riktiga exempel

```
feat(frontend): add holdings table component (#26)
fix(backend): resolve null pointer exception in user service (#47)
refactor(native): optimize memory allocation in data processor
docs: add team standards and agent guidelines
style(frontend): extract Dashboard component styles to CSS modules (#26)
test(backend): add unit tests for authentication service (#33)
```

---

## 2. Branch-namngivning

### Varför branch-namn spelar roll

En branch är som en "arbetsbänk" för en specifik uppgift. Bra branch-namn:
- Hjälper dig komma ihåg vad du jobbar på
- Gör det tydligt vad varje branch är till för
- Kopplar commits till spårning av issues
- Förhindrar att av misstag merga fel kod

### Formatet

```
type/issue-number-description
```

**Bryter ned det:**

- **`type`** - Samma som commits! (feature, fix, refactor, docs, etc.)
- **`issue-number`** - Länk till din issue-tracker
- **`description`** - Kebab-case kort beskrivning

### Exempel förklarat

```
feature/#26-dashboard-panels
```
- Type: `feature` - Det här är en ny feature
- Issue: `#26` - Relaterad till issue #26
- Description: `dashboard-panels` - Featuren handlar om dashboard-panels

```
fix/#47-readme-formatting
```
- Type: `fix` - Reparerar något
- Issue: `#47` - Relaterad till issue #47
- Description: `readme-formatting` - Fixet handlar om README-formatering

```
docs/team-standards
```
- Type: `docs` - Dokumentation
- Ingen issue-nummer (detta är allmänt dokumentationsarbete)
- Description: `team-standards` - Om team-standards

### Branch-arbetsflöde exempel

```bash
# 1. Skapa ny branch för ditt arbete
git checkout develop
git checkout -b feature/#26-dashboard-panels

# 2. Gör commits på denna branch
git commit -m "feat(frontend): create panel component"
git commit -m "feat(frontend): add styling for panels"

# 3. När du är klar, push och skapa pull request
git push origin feature/#26-dashboard-panels

# 4. Efter review/merge, behåll branchen - ta INTE bort den
# Vi behåller alla branches för historik
```

---

## 3. Frontend-standarder (JavaScript/TypeScript/React)

### Varför TypeScript?

**Problemet:** JavaScript är flexibelt men felbenäget.
```javascript
function getUserName(user) {
  return user.name;  // Vad om user är undefined? Krasch!
}
```

**TypeScript-lösning:** Typer fångar fel *innan* runtime.
```typescript
interface User {
  name: string;
  age: number;
}

function getUserName(user: User): string {
  return user.name;  // TypeScript vet exakt vad user innehåller
}
```

**Fördelar:**
- **IDE-stöd** - IntelliSense föreslår rätt properties
- **Fånga fel tidigt** - Misstag hittas innan testning
- **Själv-dokumenterande** - Kod visar vilka typer som förväntas
- **Refactoring-säkerhet** - Ändra något och se alla påverkade områden

### Komponentstruktur

**Regel:** En komponent per fil, med sin egen CSS-modul.

**Varför?**
- Lätt att hitta kod
- Återanvändbar i olika sammanhang
- CSS läcker inte till andra komponenter
- Tydlig separation av ansvar

```
src/components/
  Dashboard/
    Dashboard.tsx          ← Komponenten
    Dashboard.module.css   ← Dess stilar (isolerade)
    AccountsTable.tsx      ← En delkomponent
    AccountsTable.module.css
    PageHeader.tsx
    PageHeader.module.css
```

### Namngivningskonventioner

**Komponenter:** PascalCase (som klassnamn)
```typescript
// Bra
function UserProfile() { }
function AccountsTable() { }

// Dåligt
function userProfile() { }
function accounts_table() { }
```

**Variabler/Funktioner:** camelCase
```typescript
// Bra
const userData = fetchUser();
function calculateTotal() { }

// Dåligt
const user_data = fetchUser();
function calculate_total() { }
```

**CSS-klasser:** camelCase i `.module.css`
```css
/* Bra */
.pageHeader { }
.accountsTable { }

/* Dåligt */
.page-header { }
.accounts_table { }
```

### TypeScript i komponenter

**Alltid typa dina props:**
```typescript
interface PageHeaderProps {
  title?: string;           // Valfri prop
  totalValue?: number;
  exchange?: string;
}

function PageHeader({ 
  title = 'Default Title',  // Standardvärde
  totalValue = 0,
  exchange = 'USD/SEK 10:45'
}: PageHeaderProps): JSX.Element {  // Explicit returtyp
  return <div>{title}</div>;
}
```

**Varför?**
- Komponenten är själv-dokumenterande
- TypeScript förhindrar felaktig prop-typ
- IDE visar exakt vilka props som är tillgängliga

### CSS-moduler

**En fil per komponent:**
```typescript
// PageHeader.tsx
import styles from './PageHeader.module.css';

function PageHeader() {
  return <h1 className={styles.title}>Min titel</h1>;
}
```

```css
/* PageHeader.module.css */
.title {
  font-size: 1.5rem;
  font-weight: bold;
}
```

**Fördelar:**
- CSS är begränsad till komponenten (ingen style-konflikt)
- Lätt att hitta styling för en komponent
- Stilar följer komponenten om den flyttas
- Ingen global CSS-röra

---

## 4. Backend-standarder (Java)

### Paketstruktur

```
src/main/java/com/company/
  service/        ← Affärslogik
  controller/     ← API-endpoints
  repository/     ← Databasåtkomst
  model/          ← Dataklasser
  exception/      ← Egna exceptions
```

**Varför denna struktur?**
- **Tydligt ansvar** - Alla vet var de ska leta
- **Lagrig arkitektur** - Varje lager har ett jobb
- **Testbarhet** - Lätt att testa varje lager separat
- **Skalbarhet** - Lätt att lägga till nya features

### Namngivning i Java

**Klasser:** PascalCase
```java
// Bra
public class UserService { }
public class AccountRepository { }

// Dåligt
public class userService { }
public class account_repository { }
```

**Metoder/Variabler:** camelCase
```java
// Bra
public User getUserById(int id) { }
private String formatUserName(User user) { }

// Dåligt
public User get_user_by_id(int id) { }
public String FormatUserName(User user) { }
```

**Konstanter:** UPPER_CASE
```java
// Bra
public static final int MAX_RETRY_ATTEMPTS = 3;
public static final String API_BASE_URL = "https://api.example.com";

// Dåligt
public static final int max_retry_attempts = 3;
```

### SOLID-principer (kort överblick)

**S - Single Responsibility**
- En klass ska göra EN sak
- `UserService` hanterar användare, inte betalningar
- `AuthController` hanterar autentisering, inte användarhämtning

**O - Open/Closed**
- Öppen för utökning, stängd för modifiering
- Lägg till nya features utan att ändra befintlig kod
- Använd arv och interfaces

**L - Liskov Substitution**
- Underklasser ska kunna ersätta sin föräldraklass
- Om `Dog extends Animal`, ska `Dog` fungera överallt `Animal` används

**I - Interface Segregation**
- Klienter ska inte bero på interfaces de inte använder
- Många specifika interfaces > En stor interface

**D - Dependency Injection**
- Skapa inte dependencies inuti en klass
- Få dem som konstruktor-parametrar
```java
// Bra - dependency injekterad
public class UserService {
  private UserRepository repository;
  
  public UserService(UserRepository repository) {
    this.repository = repository;
  }
}

// Dåligt - dependency skapad inuti
public class UserService {
  private UserRepository repository = new UserRepository();
}
```

---

## 5. Native-standarder (C/C++)

### Minneshantering

**Utmaningen:** C/C++ ger dig direkt minneåtkomst, vilket är kraftfullt men farligt.

**Problem:**
```cpp
int* data = new int[100];  // Allokera minne
// ... använd data ...
// Oops! Glömde att ta bort - minnesläcka!
```

**Lösning - Tydligt ägande:**
```cpp
class DataBuffer {
  private:
    int* data;
  public:
    DataBuffer(int size) {
      data = new int[size];
    }
    ~DataBuffer() {  // Destruktor - städning sker här
      delete[] data;
    }
};
```

**Varför detta spelar roll:**
- **Förhindrar minnesläckor** - Förlorat minne = långsammare program
- **Förhindrar krascher** - Använder befritt minne = odefinierad beteende
- **Förutsägbar** - Alla vet när minne frigörs

### Namngivningskonventioner

**Funktioner/Variabler:** snake_case (C-tradition)
```cpp
// Bra
void calculate_total_balance() { }
int max_user_count = 100;

// Dåligt
void calculateTotalBalance() { }
int MaxUserCount = 100;
```

**Konstanter:** UPPER_CASE
```cpp
// Bra
const int MAX_BUFFER_SIZE = 1024;
const float PI_APPROXIMATION = 3.14159;

// Dåligt
const int max_buffer_size = 1024;
```

### Defensiv kodning

Antag alltid att något kan gå fel:

```cpp
// Bra - hanterar fel
int* buffer = allocate_memory(size);
if (buffer == nullptr) {
  log_error("Memory allocation failed");
  return ERROR_CODE;
}

// Dåligt - antar framgång
int* buffer = allocate_memory(size);
// ... använd buffer direkt, ingen kontroll ...
```

---

## 6. Git-arbetsflöde

### Branch-strategi

Vårt projekt använder en **två-branch-strategi** med feature-branches:

```
main ← develop ← feature/#26-dashboard-panels
↑       ↑
|       └─ Standardbranch (integration)
└── Production (stabil, testad, releaad kod)
```

**Branch-syften:**
- **`main`** - Produktionskod bara. Stabil, testad, releaad.
- **`develop`** - Integrationsbranch. Standardbranch. Nästa release-kandidat.
- **`feature/#X-*`**, **`fix/#X-*`**, etc. - Arbetsbranches. Brancha från `develop`, merga tillbaka till `develop`.

### Lokalt arbete

```bash
# 1. Säkerställ att du är på develop och den är uppdaterad
git checkout develop
git pull origin develop

# 2. Skapa och byt till din feature-branch
git checkout -b feature/#26-dashboard-panels

# 3. Gör ändringar och commita regelbundet
git add src/components/Dashboard.tsx
git commit -m "feat(frontend): add dashboard component (#26)"
git add src/components/Dashboard.module.css
git commit -m "style(frontend): add dashboard styling (#26)"

# 4. Push till remote
git push origin feature/#26-dashboard-panels
```

### Kodgranskning & Merge-process

**Regel: Varje merge till `develop` kräver en Pull Request godkänd av en annan teammedlem.**

```
1. Push din branch (feature/#26-dashboard-panels)
2. Skapa Pull Request till develop
3. En annan teammedlem granskar
4. Granskaren godkänner PR:en
5. ⚠️ VIKTIGT: Granskaren kan INTE merga sitt eget godkännande
6. En tredje teammedlem (eller original-autor efter granskning) mergar till develop
7. Behåll branchen - ta INTE bort den
```

**Varför denna regel?**
- **Kvalitetsöppning** - Kod granskas innan integration
- **Delat ansvar** - Flera personer förstår varje ändring
- **Förhindrar överseenden** - Olika personer fångar olika fel
- **Kunskapsdistribution** - Alla lär sig från varandras kod

### Till produktion (develop → main)

När en release är klar:

```bash
# 1. Säkerställ att develop är stabil och testad
# 2. Skapa en PR från develop till main
# 3. Granskning (samma regler gäller)
# 4. Merga develop till main
# 5. Tagga releasen: git tag v1.0.0
```

### Branch-bevarande

**Vi behåller alla branches. Ta INTE bort branches efter merge.**

**Varför?**
- **Historisk journalföring** - Se exakt vad som var i feature/#26
- **Spårbarhet** - Länka commits till deras ursprungliga branches
- **Rollback-referens** - Om main behöver reverteras, branches visar vad som ändrades
- **Nya teammedlemmar** - Kan utforska projekthistorik genom branches

Exempel:
```bash
git log feature/#26-dashboard-panels  # Se alla commits från denna feature
git branch -a                         # Se alla branches någonsin skapade
```

### Varför denna process?

- **Säkerhet** - Flera granskare fångar fel
- **Kunskapsdeling** - Teamet lär sig från varandras ändringar
- **Kvalitet** - Säkerställer att kod uppfyller standarder före integration
- **Spårbarhet** - Tydlig historia med bevarade branches
- **Ansvar** - Alla är ansvariga för kod de mergar

---

## 7. Fråga AI-agenter om hjälp

### När du ska dela detta dokument

**GÖR-det när du frågar om:**
- Kodgranskning eller stilförslag
- Nya features eller komponenter
- Hjälp med commits eller branch-namn
- Arkitektur-beslut
- Lärande om bästa praxis

**Exempel-förfrågan:**
```
Jag behöver skapa en ny React-komponent kallad "TransactionTable".
Följ standarderna i AGENT.md från branch docs/team-standards.
Komponenten ska visa transaktioner och tillåta filtrering.
```

### Vad att inkludera i förfrågningar

1. **Exakt uppgift** - "Skapa en komponent som gör X"
2. **Filvägar** - Var ska detta hamna?
3. **Begränsningar** - Några specifika krav?
4. **Kontext** - Vad relaterar detta till?
5. **Referens** - "Följ AGENT.md-standarder"

### Förväntad svarsformat

- Koden följer detta dokuments standarder
- Commit-meddelanden använder det format som anges här
- Komponenter har TypeScript-interfaces
- Commits är korrekt formaterade

---

## 8. Framtida lärområden

Det här dokumentet kommer växa när vi lär oss tillsammans. Ämnen att lägga till:

- **API-design** - Hur man strukturerar API-endpoints
- **Prestanda** - Optimera kod och databaser
- **Säkerhet** - Skydda användardata och system
- **Testning** - Skriva effektiva tester
- **Driftsättning** - Få kod till produktion
- **Övervakning** - Spåra programkörningens hälsa
- **Databasdesign** - Schema och frågeoptimerering

Varje sektion följer samma pedagogiska tillvägagångssätt: förklara "varför" och visa exempel.

---

## 7. Roller & Eskalering

### Teamet I Mitten - Börja Alltid Här

**Ditt team hjälper varandra först.** Ni är varandras första linje.

**Roller i teamet:**
- **Utvecklare** (alla) - Bygg, testa, dokumentera, presentera
- **Team Lead** (roterande) - Samordning, möten, hinder, kontakt med PL
- **C/C++-specialist** - Native-modulen (back-testing)
- **Frontend/Backend** - Lösningen (gränssnitt, logik, API)

**Viktigt:** Din insats måste vara synlig!
- Dokumentera i Git (commits, branches)
- Bidra till tester och dokumentation
- Förklara dina val i beslutslogg
- Presentera din del

### Eskalering När Det Krånglar

**Steg 1: Felsök i teamet**
- Läs felmeddelandet tillsammans
- Sök i README och beslutslogg
- Fråga varandra

**Steg 2: Ta det till PL (Projektledare)**
- PL är din närmaste support
- PL hjälper er strukturera problemet
- PL avgör nästa steg

**Steg 3: Techsupport (om PL säger det)**
- Endast avgränsade tekniska blockerare
- Beskriv: problema, vad ni testat, felmeddelande, repo/branch

**Steg 4: Arkitekt (endast strukturella miljöproblem)**
- Via PL
- Inte för kodproblem – bara miljö/infrastruktur

### Specialister & Feedback

**CTO (Teknisk)**
- Live-workshop v1 (17 aug)
- Feedback via inspelad film (28 sep)
- Baserat på ert CTO-underlag

**UX-specialist (Användarupplevelse)**
- Live-workshop v1 (17 aug)
- Feedback via inspelad film (5 okt)
- Baserat på er inspelad demo

**Delivery Manager (Leveransprocess)**
- Live-workshop v1 (17 aug)
- Feedback via inspelad film (5 okt)
- Baserat på scope, planering, dokumentation

### Extern Bedömning

**Programansvarig**
- Följer upp kursmål om professionella dialoger (fredagar)
- Godkänner dokumentation
- Sätter betyget tillsammans med PL

**Kund (Avanza)**
- Ger caset
- Live feedforward vid kvaldemo (22 okt)
- **Påverkar INTE ditt betyg**

**Jury (Finaldagen)**
- Bedömer de 4 finalistteamen
- Avgör tävlingen
- **Påverkar INTE ditt betyg**

---

## 7. Instruktioner för AI-agenter (När gruppen frågar dig)

**Du är inte bara en kodgenerator – du är en pedagogisk guide för ett professionellt utvecklingsprojekt.**

### Din Roll

Du hjälper gruppen att:
- ✅ Uppfylla **kursmålen** (17 stycken)
- ✅ Nå **VG på de fyra kritiska målen**
- ✅ Arbeta **agilt och professionellt**
- ✅ **Dokumentera allt** för examination
- ✅ Förstå **varför** vi gör saker, inte bara hur

### När Gruppen Frågar Dig - Gör ALLTID Detta

1. **Koppla till kursmål** - "Detta uppfyller kurmål Färdighet 5..."
2. **Förklara pedagogiskt** - Varför gör vi det här? Vad lär vi oss?
3. **Fokusera på VG-målen** - Särskilt dessa fyra:
   - Tolka kundbehov och bryta ned dem
   - Göra välgrundade estimeringar och riskbedömningar
   - Bidra till utveckling, QA och dokumentation
   - Ta ansvar för planering, genomförande, uppföljning

4. **Dokumentera för examinatorn** - Allt ska kunna spåras i Git
5. **Be gruppen förklara** - "Kan du förklara varför du valde detta?"

### Exempel: Rätt vs Fel Vägledning

**❌ FEL (bara kod):**
```
"Här är React-komponenten. Kopiera den och ändra X."
```

**✅ RÄTT (pedagogisk + kursmål):**
```
"Vi behöver denna komponent för att uppfylla:
1. Kursmål Färdighet 5 - Bidra till utveckling
2. VG-mål: Kvalitetssäkring - TypeScript-interfaces

Här är komponenten:
- Varför denna arkitektur?
- Hur testar vi den?
- Hur dokumenterar vi den i Git?

Kan du förklara varför denna komponent är viktig för Annas portföljöversikt?"
```

### Fokus på De Fyra VG-Målen

**1. Tolka kundbehov och bryta ned dem**
- Är vi klara på vad Anna behöver?
- Är features prioriterade rätt?
- Finns det i DEFINITION_OF_DONE.md?

**2. Göra välgrundade estimeringar och riskbedömningar**
- Hur lång tid tar denna feature?
- Vilka risker finns? (Back-testing = högrisk)
- Vilka beroenden finns?
- Är detta dokumenterat?

**3. Bidra till utveckling, QA och dokumentation**
- Är det testbar kod?
- Är det dokumenterat?
- Är det kodgranskad?
- Är Git-historiken tydlig?

**4. Ta ansvar för planering, genomförande, uppföljning**
- Vem gör vad?
- Deadline för varje sprint?
- Status-uppdateringar?
- Dokumenterade beslut?

### Använd Dessa Dokument ALLTID

- `PROJEKTKONTEXT.md` - "Det här uppfyller Annas behov av..."
- `DEFINITION_OF_DONE.md` - "Checklist innan vi är klara..."
- `AGENT.md` (denna fil) - "Enligt våra standards..."

### Granska Gruppens Förförståelse

**Fråga alltid:**
- "Varför gör vi detta?"
- "Hur kopplar detta till Annas problem?"
- "Vad är risken om vi inte gör detta rätt?"
- "Hur dokumenterar vi detta för examinatorn?"

Om de inte kan förklara det = de förstår det inte ännu = lära dem först.

---

## Nyckelpoänger

1. **Commit-meddelanden berättar en historia** - Gör dem tydliga och konsekventa
2. **Branches organiserar arbete** - Använd namngivning för att visa vad du gör
3. **Typer spelar roll** - TypeScript, C++ bästa praxis, Java-mönster
4. **Lagarbete är lättare** med standarder - Alla vet reglerna
5. **Lära tillsammans** - Det här dokumentet växer med vår erfarenhet

---

**Frågor?** Fråga teamet eller en AI-agent med referens till det här dokumentet.
