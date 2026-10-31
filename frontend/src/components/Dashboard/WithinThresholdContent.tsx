import type { DriftContentProps } from "./DriftInterpretationPanel";

export function WithinThresholdContent({ allocation }: DriftContentProps) {
  return (
    <>
      <h4>Analysrapport:</h4>
      <p>
        Fördelning mellan aktier och fonder i din portfölj har följt din målallokering - <em>din plan håller!</em> Avanza Portföljhälsa accepterar en avvikelse på upp till {allocation.thresholdPct}% från målallokeringen, det ger marginal för marknadens naturliga svängningar samtidigt som en avvikande trend upptäcks i tid. 
      </p>
      <h4>Vad behöver du göra nu?</h4>
      <p>
        <em>Ingenting!</em> Om du känner dig bekväm med den nuvarande risknivån för din portflölj kan du fortsätta med din investeringsplan. Avanza Portföljhälsa kommer att meddela dig om något förändras som kräver din uppmärksamhet.
      </p>
      <p>Om du däremot önskar ändra målet för din risknivå - antingen öka din riskexponering för att skapa möjlighet till högre avkastning eller minska den för att hålla en mer stabil linje, kan du här börja med att ändra din målallokering. Du behöver sannolikt då även justera dina innehav för att uppnå den önskade allokeringen (rebalansering).</p>
    </>
  );
}
