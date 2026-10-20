import styles from "./AssetAllocation.module.css";
import type { Allocation } from "../../types/portfolio";

interface AssetAllocationProps {
  allocation: Allocation;
}

function AssetAllocation({ allocation }: AssetAllocationProps): JSX.Element {
  return (
    <>
      <h2>Din riskallokering</h2>
      <div className={styles.container}>
      <p>Hela portföljens fördelning av riskbetonade / stabila innehav</p>
      {/* Chart colors explained */}
      <div className={styles.colorExplanation}>
        <span className={styles.lightClrExpl}>Riskbetonade innehav</span>
        <span className={styles.darkClrExpl}>Stabila innehav med låg risk</span>
      </div>

        {/* Actual/Target BarChart */}
        <div className={styles.barChartContainer}>
      
          {/* "Faktiskt allokering" label */}
          <p className={styles.actualLabel}>Faktisk allokering</p>
      
          {/* Bars container */}
          <div className={styles.barsContainer}>
      
            {/* Actual allocation bar */}
            <div className={styles.bar}>
              <div className={styles.lightColor} data-percent={`${allocation.actualAktierPct}%`}>
                <p>{allocation.actualAktierPct}%</p>
              </div>
              <div className={styles.darkColor} data-percent={`${allocation.actualStabiltPct}%`}>
                <p className={styles.right}>{allocation.actualStabiltPct}%</p>
              </div>
            </div>
      
            {/* Target allocation bar */}
            <div className={styles.bar}>
              <div className={styles.targetLightColor} data-percent={`${allocation.targetAktierPct}%`}>
                <p>{allocation.targetAktierPct}%</p>
              </div>
              <div className={styles.targetDarkColor} data-percent={`${allocation.targetStabiltPct}%`}>
                <p className={styles.right}>{allocation.targetStabiltPct}%</p>
              </div>
            </div>
          </div>
      
          {/* "Målallokering" label */}
          <p className={styles.targetLabel}>Målallokering</p>
        </div>
      </div>
    </>
  );
}

export default AssetAllocation;
