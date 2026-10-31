import type { DriftContentProps } from "./DriftInterpretationPanel";

export function AktierAboveContent({ allocation }: DriftContentProps) {
  return (
    <>
      <h4>Analysrapport:</h4>
      <p>
        Fördelning mellan aktier och fonder i din portfölj har avvikit från din målallokering, och dina aktier ligger över målet. Det beror sannolikt på att något eller några av dina aktieinnehav har ökat i värde mer än beräknat, men notera att även en minskning av den stabila andelen kan ge samma effekt. 
      </p>
      <h4>Vad behöver du göra nu?</h4>
      <p>
        Överväg rebalansering av din portfölj för att återställa den till din målallokering, om du vill fortsätta med din investeringsplan. Läs gärna mer om rebalansering i Avanzas guide: <a href="https://www.avanza.se/lar-dig-mer/guider/rebalansering.html" target="_blank" rel="noopener noreferrer">Rebalansering</a>.   
        
        {/* Det kan innebära att sälja en del av dina aktier och/eller köpa mer av den stabila andelen. Avanza Portföljhälsa kan bara uppmärksamma dig på situationen, men inte ge några konkreta rekommendationer. Det är du som behöver ta ställning till om du vill agera på informationen, och hur. Avanzas andra verktyg för att hantera innehav finns redo i så fall.  */}
      </p>
      <p>Du kan också välja att <em>inte</em> agera nu, och låta situationen utvecklas. Din portfölj har ju trots allt vuxit mer i värde än vad du trodde. Men det har även riskexponeringen gjort, och du behöver vara medveten om att ... </p>
    </>
  );
}
