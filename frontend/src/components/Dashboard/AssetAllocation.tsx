import Panel from "../Panel";
import styles from "./AssetAllocation.module.css";
// import AllocationPieChart from "./AllocationPieChart";
import type { Allocation } from "../../types/portfolio";

interface AssetAllocationProps {
  allocation: Allocation;
}

function AssetAllocation({ allocation }: AssetAllocationProps): JSX.Element {
  return (
    <div className={styles.container}>
      <Panel title="Din riskallokering" size="large">
        <p>Hela portföljens fördelning av riskbetonade / stabila innehav</p>
        {/* Chart colors explained */}
        <div className={styles.colorExplanation}>
          <span className={styles.lightClrExpl}>Riskbetonade innehav</span>
          <span className={styles.darkClrExpl}>Stabila innehav med låg risk</span>
        </div>
        {/* Faktiskt allokering label */}
        <p className={styles.actualLabel}>Faktisk allokering</p>
        {/* Actual/Target BarChart */}
        <div data-procent={allocation.actualAktierPct}>BLA BLA</div><div data-procent={allocation.actualStabiltPct}>BLA BLA</div>
        <p>{allocation.targetAktierPct} / {allocation.targetStabiltPct}</p>
        {/* Målallokering label */}
        <p className={styles.targetLabel}>Målallokering</p>
        {/* <AllocationPieChart aktierPct={allocation.actualAktierPct} stabiltPct={allocation.actualStabiltPct} /> */}
        </Panel>
    </div>
  );
}

export default AssetAllocation;
