// When functionality for more data analysis is implemented, this prop below will likely be used in this component. See next comment with the commented out function signature for a hint of what that might look like. For now, this component is just a static information panel.

// import type { DriftContentProps } from "./DriftInterpretationPanel";

export function AktierAboveContent() {
// export function AktierAboveContent({ allocation }: DriftContentProps) {
  return (
    <>
      <h4>Analysrapport:</h4>
      <p>
        Fördelning mellan aktier och fonder i din portfölj har avvikit från din målallokering, och dina aktier ligger över målet. Det kan bero  på att något eller några av dina aktieinnehav har ökat i värde mer än beräknat, men det kan även orsakas av en minskning av den stabila andelen. Notera också att det här inte nödvändigtvis betyder att <em>hela portföljens värde</em> har ökat.
      </p>
      <h4>Vad behöver du göra nu?</h4>
      <p>
        Överväg rebalansering av din portfölj för att återställa den till din målallokering, om du vill fortsätta med din investeringsplan. Läs gärna mer om rebalansering i Avanzas guide: <a href="https://www.avanza.se/lar-dig-mer/guider/rebalansering.html" target="_blank" rel="noopener noreferrer">Rebalansering</a>. Håll ett öga på din portföljs samlade utveckling.
        
        {/* Nedanstående text var tidigare en del av ovanstående stycke, men jag överväger att lägga den som del av informationen i högerkolumnens informationstext istället. I den här komponenten vill vi bara ge en kortfattad information om att det kan vara lämpligt att rebalansera portföljen.
        
        "Det kan innebära att sälja en del av dina aktier och/eller köpa mer av den stabila andelen. Avanza Portföljhälsa kan bara uppmärksamma dig på situationen, men inte ge några konkreta rekommendationer. Det är du som behöver ta ställning till om du vill agera på informationen, och hur. Avanzas andra verktyg för att hantera innehav finns redo i så fall."  */}
      </p>
      <p>Du kan också välja att <em>inte</em> agera nu, och följa utvecklingen. Tänk på att en högre aktieandel än planerat kan innebära att portföljens riskexponering har förändrats. Om en av dina aktier har gått upp nu och du nu alltå har mer pengar placerade där, så kommer de att följa med ner om aktien senare går ner.</p>
    </>
  );
}
