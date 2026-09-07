import styles from './AssetAllocation.module.css';

function AssetAllocation(): JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.percentage}>75%</div>
        <div className={styles.target}>/ mål 60%</div>
        <div className={styles.name}>Aktier</div>
      </div>
      <div className={styles.item}>
        <div className={styles.percentage}>25%</div>
        <div className={styles.target}>/ mål 40%</div>
        <div className={styles.name}>Fonder</div>
      </div>
    </div>
  );
}

export default AssetAllocation;
