# Beslut — Native C/C++

## Modul-beslut

- **Beslut:** Vi delade inledningsvis upp arbetet till att Pär startade med att skapa en Risk-modul(C) medans Henrik startade med FX-modulen(C++).
- **Varför:** Så att vi har varsitt startprojekt att jobba på under inledningen av hela projektet, så att vi inte trampar varandra på tårna.

- **Beslut:** Vi valde att gemensamt sätta oss och spekulera kring hur Backtest-motorn(C++17) skulle byggas inledningsvis, så att vi båda är med på tåget.
- **Varför:** Så att vi kan stötta varandra och komma med input som man kanske lätt annars missar.

- **Beslut:** Vi valde att inledningsvis inte lägga alltför mycket tid och energi på t.ex. automatiska tester eller gitHub Actions, utan kolla på det i mån av tid.
- **Varför:** För att begränsa scopet lite grann inledningsvis.


## Tekniska-beslut

- **Beslut:** Hantering av dokumentation för funktioner i Doxygen-stil.
- **Varför:** För att underlätta genom att visa information kring en funktion när användaren hovrar över namnet i VSC (Visual Studio Code).

- **Beslut:** Henrik valde att använda libcurl för hämtning över HTTP.
- **Varför:** Mestadels för att det är standard, det rekommenderas överallt samt att vi känner oss bekanta med det.

- **Beslut:** Pär valde att hantera uträkningarna kring Bessels Korrektion, vilket innebär att stickprovsvariansen beräknas med N - 1 istället för N.
- **Varför:** För att historiska avkastningar betraktas som ett stickprov av möjliga framtida avkastningar, denna metoden ger en väntevärdesriktig skattning av variansen.

- **Beslut:** Pär valde att använda Welfords algoritm för att beräkna varians och mean(medelvärde).
- **Varför:** För att förbättra den numeriska stabiliteten vid beräkning av medelvärde och varians, som minskar risken för precisionsproblem jämfört med om man gör en direkt beräkning av varians från summor och kvadrerade summor.

- **Beslut:** Henrik valde att använda Jansson till FX-modulen för att hantera JSON-data som samlas in.
- **Varför:** För att det är nyttigt att lära sig ett nytt verktyg när vi tidigare arbetat med cJSON, var inte helt klara med om det faktiskt var ett krav att använda jansson. Beslutet blev att köra på jansson för att dels bredda ens eget scope, men även för att lära sig nytt.

- **Beslut:** Vi valde att skapa en testfil med bekräftelse-tester för Risk & FX-modulerna.
- **Varför:** För att se så att funktionerna hanterar gränsfall enligt som det är uttänkt att de ska fungera. Vissa tester är baserade på redan färdiga uträkningar för jämförelse.

- **Beslut:** Vi skapade en enkel CMakeLists för att kunna bygga projektet, som sedan har byggts på i efterhand.
- **Varför:** Så att Java snabbt kan få de filerna de behöver för att integrera våra delar i sitt program.