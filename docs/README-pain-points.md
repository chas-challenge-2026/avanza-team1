# Vad fungerar (och vad som spricker vid skala)

## Det som fungerar i v1

- **Inloggning** med e-post och lösenord (MD5, funkar för demo)
- **Portfolioöversikt** — visar konton, innehav, totalvärde i SEK
- **Allokering vs mål** — visar faktisk vs målallokering per kontotyp
- **Notiser** — hämtar sparade notiser och beräknar live-avvikelser
- **Lägg till / ta bort innehav** — fungerar för enstaka operationer
- **Thymeleaf-vyer** renderas korrekt med Bootstrap 3

## Det som spricker vid realistisk last

### Minneshantering
Med 1 000 innehav per användare laddas all data till heapminnet per request.
Med 100 simultana användare: `100 * 1000 * ~500 bytes ≈ 50 MB` bara för holdings-data.
Vid 10 000 innehav börjar GC-pauser påverka svarstider märkbart.

### Sessionsskalning
`HttpSession` är in-memory per JVM-instans. Går inte att köra flera instanser utan sticky sessions
eller extern session store (Redis).

### FX-precision
USD/SEK hårdkodas till 10.45. Under en valutakris kan verkliga kursen skilja 15–20%.
Portföljvärden visas som exakta siffror men är systematiskt fel.

### Autentisering
MD5-hash utan salt. Alla användare med samma lösenord har samma hash i databasen.
En databas-läcka exponerar lösenorden via regnbågstabeller direkt.

### CSRF
Inga CSRF-tokens på formulär. En angripare kan lura en inloggad användare att ta bort innehav
via en skadlig länk på en annan webbplats.

## Flaskhalsar att demonstrera

```bash
# Generera 10 000 holdings för Anna (kör mot lokalt DB)
for i in $(seq 1 10000); do
  psql -U avanza avanza -c "INSERT INTO holdings (account_id, ticker, instrument_name, quantity, avg_buy_price)
  VALUES (1, 'FAKE$i', 'Test $i', 100, 100.00);"
done

# Mät svarstid för dashboard
curl -w "%{time_total}\n" -o /dev/null -s http://localhost:8082/
# Förväntat: 2–5 sekunder med 10 000 holdings
```
