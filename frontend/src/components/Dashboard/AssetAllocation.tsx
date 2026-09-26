import styles from "./AssetAllocation.module.css";
import AllocationPieChart from "./AllocationPieChart";
import type { Allocation } from "../../types/portfolio";

interface AssetAllocationProps {
  allocation: Allocation;
}

function AssetAllocation({ allocation }: AssetAllocationProps): JSX.Element {
  return (
    <div className={styles.container}>
      <AllocationPieChart
        aktierPct={allocation.actualAktierPct}
        stabiltPct={allocation.actualStabiltPct}
      />
    </div>
  );
}

export default AssetAllocation;
