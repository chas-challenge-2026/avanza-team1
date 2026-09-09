import styles from "./AssetAllocation.module.css";
import type { Allocation } from "../../types/portfolio";

interface AssetAllocationProps {
  allocation: Allocation;
}

function AssetAllocation({ allocation }: AssetAllocationProps): JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.percentage}>{allocation.actualAktierPct}%</div>
        <div className={styles.target}>/ mål {allocation.targetAktierPct}%</div>
        <div className={styles.name}>Aktier</div>
      </div>
      <div className={styles.item}>
        <div className={styles.percentage}>{allocation.actualStabiltPct}%</div>
        <div className={styles.target}>
          / mål {allocation.targetStabiltPct}%
        </div>
        <div className={styles.name}>Fonder</div>
      </div>
    </div>
  );
}

export default AssetAllocation;
