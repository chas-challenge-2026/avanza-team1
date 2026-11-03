// When functionality for more data analysis is implemented, this prop below will likely be used in this component. See next comment with the commented out function signature for a hint of what that might look like. For now, this component is just a static information panel.

// import type { DriftContentProps } from "./DriftInterpretationPanel";

export function StabiltAboveContent() {
// export function StabiltAboveContent({ allocation }: DriftContentProps) {
  return (
    <>
      <h4>Analysrapport:</h4>
      <p>
        Fördelning mellan aktier och fonder i din portfölj har avvikit från din målallokering, och den stabila andelen ligger över målet. Det beror sannolikt på att något eller några av dina aktieinnehav har minskat i värde, men notera att även en ökning av fondandelen kan ge samma effekt. 
      </p>
      <h4>Vad behöver du göra nu?</h4>
      <p>
        Det finns olika sätt att agera i det här läget, och orsaken till förskjutningen kan spela stor roll. <em>Om dina fonder har ökat i värde</em> mer än beräknat, kan det vara önskvärt med en rebalansering av portföljen för att återställa den till din målallokering. Du bör vara medveten om att en större andel av den stabila delen innebär en lägre riskexponering, men också en lägre potentiell avkastning. Läs gärna mer om rebalansering i Avanzas guide: <a href="https://www.avanza.se/lar-dig-mer/guider/rebalansering.html" target="_blank" rel="noopener noreferrer">Rebalansering</a>. 
      </p>
      <p>
        Om det istället är så att <em>aktieandelen av din portfölj har minskat i värde</em>, kan det bero både på enskilda innehavs nedgångar och på valutakursförändringar. Du kan välja att agera genom att göra förändringar bland dina innehav, men det är också möjligt att avvakta och låta situationen utvecklas. Någon av Avanza rådgivare kan vägleda dig ytterligare om du känner dig osäker.
      </p>
    </>
  );
}
