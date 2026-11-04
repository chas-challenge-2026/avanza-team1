# Avanza Portföljhälsa

## Innehållsförteckning
- [Avanza Portföljhälsa](#avanza-portföljhälsa)
  - [Innehållsförteckning](#innehållsförteckning)
  - [Snabbstart](#snabbstart)
  - [Mappstruktur](#mappstruktur)
  - [README för varje enskilt team.](#readme-för-varje-enskilt-team)
  - [Bearbetning av Specialisternas Feed-Forward](#bearbetning-av-specialisternas-feed-forward)

## Snabbstart

Backend (v1):

```bash
cd infra && docker compose up --build
```

Öppna: http://localhost:8082

Frontend:

```bash
cd frontend && npm install && npm run dev
```

Öppna: http://localhost:5173

**Testanvändare:**

- `anna@example.com` / `password123`
- `erik@example.com` / `password123`

## Mappstruktur
* Vi valde att lägga detta som ett separat dokument:
[Mappstruktur](docs/Mappstruktur.md)

## README för varje enskilt team.
* I följande dokument går vi igenom på djupet kring varje dels funktionalitet, körning, tester och teststatus, beslutsloggar, kända brister och avgränsningar. Bredvid länkarna framgår det huruvida dokumentationen är på svenska eller engelska.

[Frontend README](frontend/docs/README-frontend.md) ← All dokumentation på svenska.

[Backend README](backend/docs/README.md) ← All dokumentation på svenska.

[Native README](native/docs/README_NATIVE.md) ← README skriven på engelska enligt branchstandard, medans BIDRAG och BESLUT är skrivet på svenska.

## Bearbetning av Specialisternas Feed-Forward
* Vi fick feed-forward på att dashboarden kunde vara tydligare och förklara för användaren genom att lägga till textblock som förklarar vad t.ex. målallokering innebär utifrån hur situationen för användaren ser ut just nu.
* Vi adresserade de synpunkter på UI som framkom tidigare såsom beteendet på stängknappen i dialogrutan bland annat.

## Fallback
Länkar till demo-backup:
https://drive.google.com/file/d/1iSRV4S1MrRSVSN5F8Nbwjksni0ayd8Sm
https://drive.google.com/file/d/1eifqneo_NWVMQB18e4OKb3BJFED2-poT
https://drive.google.com/file/d/1CBVa26ygXk6T8MDEq76ehm_TnVT3vtHe
