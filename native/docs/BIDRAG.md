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