# Beslut — Native C/C++

## Avgränsningar

- **Beslut:** Vi valde efter mycket diskussioner att skippa både BLAS och SIMD i Risk-modulen.
- **Varför:** För att i det stadie vi nu befinner oss i för projektet, så hade det inneburit en alldeles för stor tidsåtgång till att behöva sätta oss in i de två teknikerna och med tanke på hur kopplingen till Backend har gått så kommer inte det hinnas med, när vi har mer vitala delar som behöver prioriteras. Det är en sak vi lämnar som vidare utvecklingspotential om projektet hade jobbats vidare på.

- **Beslut:** Efter diskussion med Java-teamet valde vi att skala ner backtest-modulen samt risk-uträkningarna på enskilda aktier.
- **Varför:** För att Java inte skulle hinna implementera de delarna på sitt håll och för att minska stressen för dem så valde vi att ta bort strategier helt från anropet, vi kör på en fast implementerad grund-strategi med Buy & Hold.
Sen tack vare att det drog ut på tiden att få synkningen korrekt med JNA-bryggan så fick vi skrota idén om att visa riskmått på sidan, för att det inte skulle bli överbelastning av arbete på alla tre delarna inför slutleverans.


## Modul-beslut inledningsvis

- **Beslut:** Vi delade upp arbetet till att Pär startade med att skapa en Risk-modul(C) medans Henrik startade med FX-modulen(C++).
- **Varför:** Så att vi har varsitt startprojekt att jobba på under inledningen av hela projektet, så att vi inte trampar varandra på tårna.

- **Beslut:** Vi valde att gemensamt sätta oss och spekulera kring hur Backtest-motorn(C++17) skulle byggas, så att vi båda har samma bild när bygget sätts igång.
- **Varför:** Så att vi kan stötta varandra och komma med input som man kanske lätt annars missar.

- **Beslut:** Vi valde att inledningsvis inte lägga alltför mycket tid och energi på t.ex. automatiska tester eller gitHub Actions, utan kolla på det i mån av tid.
- **Varför:** För att begränsa scopet lite grann.


## Tekniska-beslut

- **Beslut:** Hantering av dokumentation för funktioner i Doxygen-stil.
- **Varför:** För att underlätta genom att visa information kring en funktion när användaren "hovrar" över namnet i VSC (Visual Studio Code).

- **Beslut:** Henrik valde att använda libcurl för hämtning över HTTP.
- **Varför:** Mestadels för att det är standard, det rekommenderas överallt samt att vi känner oss bekanta med det.

- **Beslut:** Henrik valde att använda Jansson till FX-modulen för att hantera JSON-data som samlas in.
- **Varför:** För att det är nyttigt att lära sig ett nytt verktyg när vi tidigare arbetat med cJSON, var inte helt klara med om det faktiskt var ett krav att använda jansson. Beslutet blev att köra på jansson för att lära sig nytt.

- **Beslut:** Pär valde att hantera uträkningarna kring Bessels Korrektion, vilket innebär att stickprovsvariansen beräknas med N - 1 istället för N.
- **Varför:** För att historiska avkastningar betraktas som ett stickprov av möjliga framtida avkastningar, denna metoden ger en väntevärdesriktig skattning av variansen.

- **Beslut:** Pär valde att använda Welfords algoritm för att beräkna varians och mean(medelvärde).
- **Varför:** För att förbättra den numeriska stabiliteten vid beräkning av medelvärde och varians, som minskar risken för precisionsproblem jämfört med om man gör en direkt beräkning av varians från summor och kvadrerade summor.

- **Beslut:** Vi valde att skapa en testfil med bekräftelse-tester för Risk, Backtest & FX-modulerna.
- **Varför:** För att se så att funktionerna hanterar gränsfall enligt som det är uttänkt att de ska fungera. Vissa tester är baserade på redan färdiga uträkningar för jämförelse.

- **Beslut:** Vi skapade en enkel CMakeLists för att kunna bygga projektet, som sedan har byggts på i efterhand.
- **Varför:** Så att Java snabbt kan få de filerna de behöver för att integrera våra delar i sitt program, där har senare Erik uppdaterat filen för att få den helt att synka med JAVA.