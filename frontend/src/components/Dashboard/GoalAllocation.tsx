import Panel from '../Panel';
import styles from './GoalAllocation.module.css';

function GoalAllocation(): JSX.Element {
  return (
    <Panel title="Målallokering" size="large">
      <p className={styles.description}>
        Ange hur du vill att aktier och fonder ska fördelats. Summan ska vara 100 %.
      </p>

      <div className={styles.inputsContainer}>
        <div className={styles.inputRow}>
          <div className={styles.icon}>📊</div>
          <div className={styles.label}>
            <div className={styles.labelTitle}>Aktier (%)</div>
            <div className={styles.labelSubtitle}>Andel aktier i din portfölj</div>
          </div>
          <input type="number" placeholder="60" className={styles.input} disabled />
          <span className={styles.unit}>%</span>
        </div>

        <div className={styles.inputRow}>
          <div className={styles.icon}>🟢</div>
          <div className={styles.label}>
            <div className={styles.labelTitle}>Fonder (%)</div>
            <div className={styles.labelSubtitle}>Andel fonder i din portfölj</div>
          </div>
          <input type="number" placeholder="40" className={styles.input} disabled />
          <span className={styles.unit}>%</span>
        </div>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryText}>
          Summa: <span className={styles.summarySum}>100</span> %
        </div>
        <button className={styles.button}>Spara mål ✓</button>
      </div>

      <div className={styles.infoBox}>
        <span className={styles.infoIcon}>ℹ️</span>
        <span className={styles.infoText}>Ett vanligt exempel är 60 / 40. Det är inte ett råd.</span>
      </div>
    </Panel>
  );
}

export default GoalAllocation;
