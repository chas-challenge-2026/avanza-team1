# Bidrag — Native C/C++

En rad per leverans. Kolumnen **AI** är `—` om ingen modell användes.
Om AI användes: verktyg + vad som behölls. Fel från AI hör hemma i samma cell,
inte i en separat logg.

| Datum      | Vem   | Vad                                                          | AI                                                                                                                                                         | Bevis                      |
| ---------- | ----- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| 2026-09-01 | Henrik | Skapade en snabb libcurl installation. | - | - |
| 2026-09-01 | Pär | Skapade en basic risk-modul och funktionalitet för Volatilitetsuträkningar. | - | #13 |
| 2026-09-01 | Pär | Skapade en primär README för Native. | - | - |
| 2026-09-02 | Pär | Skapade funktionalitet för Sharpe-uträkningar, samt en test-fil för att testa funktionalitet inom förväntade gränser. | Claude: Tog hjälp till att skapa ett ramverk för grundtest. | #13 #15 |
| 2026-09-02 | Henrik | La till funktionalitet för Jansson i FX-modulen. | - | #17 |
| 2026-09-03 | Henrik | Små uppdateringar till Native README för FX-modulen. | - | - |
| 2026-09-03 | Henrik | Påbörjade uppdelning av FX-modulen till fler små funktioner. | - | #17 |
| 2026-09-07 | Pär | Stor uppdatering i testfilen för att täcka hela risk-motorn, med 18 assertion-tester. | - | #55 |
| 2026-09-07 | Pär | Uppdaterade hela risk-motorn med utförlig dokumentation, utökad funktionalitet på befintliga funktioner och en ny funktion för att hantera max drawdown-beräkningar. Anpassats även i test-filen. | - | #11 #13 #14 #15 |
| 2026-09-07 | Pär | Uppdaterade Native README så att den får information kring Risk-modulen. | - | - |
| 2026-09-07 | Henrik | Slutfört en basic version av FX-modulen. Behöver finslipas, men grundfunktionaliteten är på plats. | - | #17 |
| 2026-09-07 | Henrik | La till en missad curl_easy_cleanup i FX-modulen. | - | #17 |
| 2026-09-07 | Pär & Henrik | Mergade in våra ändringar i develop | - | #11 #13 #14 #15 #17 #55 |
| 2026-09-08 | Henrik | Började jobba på en testfil för FX-modulen. Inledningsvis testar den enbart curl. | - | #61 |
| 2026-09-08 | Henrik | La till en missad free i test_fx.cpp | - | #61 |
| 2026-09-08 | Pär | Slutfört den första versionen av Risk-modulen, lagt till en ny funktion för att hantera EWMA i Volatilitetsberäkningarna. Ändrade om min hela dokumentation kring filerna och städade upp mycket. | Chat GPT: AI hjälpte mig att snygga till kommentarerna till Doxygen | #11 #13 #14 #15 |
| 2026-09-08 | Pär | La till fler tester i testfilen för att täcka de nya funktionerna, samt för att täcka fler eventuella fel. Snyggade till dokumentationen i filen också. | - | #55 |
| 2026-09-09 | Pär | Skapade ett dokument för att hantera våra bidrag till projektet, utgår direkt från våra commits inledningsvis. | - | - |
| 2026-09-09 | Pär | Mergade in develop-branchen in i våran branch för att försäkra om oss att vi har senaste uppdateringen. | - | - |
| 2026-09-09 | Pär | Uppdaterade BIDRAG.md och mergade in de senaste uppdateringarna från develop då det hänt lite där. | - | - |
| 2026-09-09 | Pär | Uppdaterade variabelnamn, städade upp några kommentarer och uppdaterade Natives README. | - | #65 #74 |
| 2026-09-10 | Pär | Konstruerat helt nya funktioner för att kunna räkna ut de rullande värdena över specifika tidsserier, men behåller de gamla funktionerna för att använda inne i de nya funktionerna. | - | #75 #77 #78 |
| 2026-09-10 | Henrik | Småfixat genom att lägga till en anteckning kring användandet av free på en funktion. Lagt till fler tester till FX-tests | - | #61 |
| 2026-09-16 | Henrik | Lagt till intervaller till Riksbanks API:et. Behöver fortfarande parsa JSON-datan ordentligt. La till ett test för intervall och fixade till en felaktig API-sträng. | - | #98 |
| 2026-09-16 | Pär | Städade upp lite i risk.c och tog bort en del hjälpfunktioner och la i en separat helpers.c/h så att det blir lite mer städat. | - | #73 |
| 2026-09-17 | Pär | Mergade in develop i våran branch | - | - |
| 2026-09-17 | Pär | Skapade ett skelett till en backtest-motor | - | #6 |
| 2026-09-17 | Pär | En preliminär CMakeLists för att kunna bygga en fil till Java | - | #6 |
| 2026-09-17 | Pär | La till en basic test.cpp för att kunna testa backtest-motorn | - | #6 |
| 2026-09-17 | Pär | Snyggade till lite kommentarer och satte in ett skydd mot c++ name mangling i risk.h | - | #73 |
| 2026-09-17 | Pär | Uppdaterade våran existerande backtest-fil med delar av det Erik skickade in som förslag. | - | #6 |
| 2026-09-24 | Henrik | Börjat arbeta på historik lookup and förändrat lite av de redan befintliga funktionerna. Uppdaterad testfil för att korrigera ändringarna. | - | #98 |
| 2026-09-24 | Pär | Ändrade en del saker i backtest, bytte tillbaka struct-namnet till BacktestResult så att man vet vad den ska skicka för något | - | #6 #16 |
| 2026-09-28 | Pär | Lite cleanup, städade bort det gigantiska pris-arrayet jag skickade in tidigare bland annat. | - | #6 #16 |
| 2026-09-30 | Henrik | Historisk lookup för FX | - | #98 |
| 2026-10-01 | Henrik | Gjort klart intervall-konversion så gott det går innan brygga mellan native och backend är på plats. | - | #98 |
| 2026-10-01 | Pär | Städat upp en hel del i risk.c/h men även lagt till funktionalitet i helpers.c/h för att underlätta vissa uträkningar och upprepade anrop. | - | #73 |
| 2026-10-01 | Pär | Uppdaterade BIDRAG.md. Fixade så att en folder bytte namn och den ursprungliga togs bort för att det kan krocka med eventuella funktioner i CMakeLists. Uppdaterade flertalet kommentarer i risk-filerna. | - | #73 |
| 2026-10-01 | Henrik | Uppdaterade fx.hpp med Doxygen kommentarer för varje funktion. Städade även upp några onödiga print-outs. | - | #98 |
| 2026-10-05 | Henrik | Uppdaterade fx_convert_current så att den förhoppningsvis kan vara mer intuitiv att använda. Kanske behöver mer arbete vid ett senare tillfälle. | - | #98 |
| 2026-10-05 | Pär | Ytterligare städning bland risk-filerna och i helpers bland kommentarerna, samt att i risk så skyddas rolling_sharpe nu av en NAN-koll på platta fönster av volatilitet (att priset inte ändras), för att undvika att programmet skickar 0 som svar och sedan avslutar uträkningen, nu skickar den istället NAN för det fönstret och går vidare. Förhoppningsvis fungerar det korrekt, blir ytterligare test när backtest-motorn kopplas in. | - | #73 |