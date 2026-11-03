import type { ComponentType } from "react";
import Panel from "../Panel";
import { getDriftStatus } from "../../lib/drift";
import type { Allocation, DriftStatus } from "../../types/portfolio";
import { WithinThresholdContent } from "./WithinThresholdContent";
import { AktierAboveContent } from "./AktierAboveContent";
import { StabiltAboveContent } from "./StabiltAboveContent";

export interface DriftContentProps {
  allocation: Allocation;
}

const contentByStatus: Record<DriftStatus, ComponentType<DriftContentProps>> = {
  withinThreshold: WithinThresholdContent,
  aktierAbove: AktierAboveContent,
  stabiltAbove: StabiltAboveContent,
};

// interface DriftInterpretationPanelProps {
//   allocation: Allocation;
// }

function DriftInterpretationPanel({ allocation }: DriftContentProps) {
  const status = getDriftStatus(allocation);
  const Content = contentByStatus[status];

  return (
    <Panel title="Analys av riskallokeringen" size="medium">
      <Content allocation={allocation} />
    </Panel>
  );
}

export default DriftInterpretationPanel;
