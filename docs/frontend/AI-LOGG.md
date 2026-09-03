# AI-logg — frontend

## 2026-09-02 — #24 mock + typer (Tomac, Grok)

- **Användning:** utkast till `Portfolio`-typ och JSON, förklaring av `tsc`-fel.
- **Vad AI hade fel:** två `export const mockPortfolio` i samma fil; import från `./tsportfolio` som inte finns.
- **Vad jag ändrade:** en fil, en export, `as Portfolio`, JSON ifylld enligt issue #24. Verifierat med `npx tsc -b`.
- **Ägarskap:** jag kan koppla varje fält till MVP (totalt SEK, FX, konton, 60/40, tröskel 5 %, AAPL i USD, Pension tom).

## 2026-09-03 — README-staket (Tomac, Grok)

- **Användning:** förslag på rot-README-tillägg.
- **Vad som gick fel:** kodstaket i markdown bröts vid inklistring; mappträdet såg ut att tappa controller-filer.
- **Vad jag ändrade:** hela `README.md` ersatt med en sluten version. Review på PR #47 fångade felet.
- **Lärdom:** inte klistra README ur chatt; använd en nedladdad fil eller skriv rutan själv.
