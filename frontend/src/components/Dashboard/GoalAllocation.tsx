import { useState } from "react";
import Panel from "../Panel";
import styles from "./GoalAllocation.module.css";
import { saveStoredTarget } from "../../lib/targetAllocation";

interface GoalAllocationProps {
  targetAktierPct: number;
  targetStabiltPct: number;
  onTargetSaved: (equities: number, funds: number) => void;
}

function GoalAllocation({
  targetAktierPct,
  targetStabiltPct,
  onTargetSaved,
}: GoalAllocationProps): JSX.Element {
  const [equities, setEquities] = useState(targetAktierPct);
  const [funds, setFunds] = useState(targetStabiltPct);
  const [saved, setSaved] = useState(false);

  const sum = equities + funds;
  const isValid = sum === 100;

  function handleSave() {
    if (!isValid) return;

    saveStoredTarget({
      targetAktierPct: equities,
      targetStabiltPct: funds,
    });
    onTargetSaved(equities, funds);
    setSaved(true);
  }

  return (
    <Panel title="Målallokering" size="large">
      <p className={styles.description}>
        Ange hur du vill att aktier och fonder ska fördelas. Summan ska vara 100
        %.
      </p>

      <div className={styles.inputsContainer}>
        <div className={styles.inputRow}>
          <div className={styles.icon}>📊</div>
          <div className={styles.label}>
            <div className={styles.labelTitle}>Aktier (%)</div>
            <div className={styles.labelSubtitle}>
              Andel aktier i din portfölj
            </div>
          </div>
          <input
            type="number"
            className={styles.input}
            value={equities}
            onChange={(e) => {
              setEquities(Number(e.target.value));
              setSaved(false);
            }}
          />
          <span className={styles.unit}>%</span>
        </div>

        <div className={styles.inputRow}>
          <div className={styles.icon}>🟢</div>
          <div className={styles.label}>
            <div className={styles.labelTitle}>Fonder (%)</div>
            <div className={styles.labelSubtitle}>
              Andel fonder i din portfölj
            </div>
          </div>
          <input
            type="number"
            className={styles.input}
            value={funds}
            onChange={(e) => {
              setFunds(Number(e.target.value));
              setSaved(false);
            }}
          />
          <span className={styles.unit}>%</span>
        </div>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryText}>
          Summa: <span className={styles.summarySum}>{sum}</span> %
          {!isValid && " — Summan måste vara 100 %."}
          {saved && isValid && " — Mål sparat."}
        </div>
        <button
          className={styles.button}
          type="button"
          disabled={!isValid}
          onClick={handleSave}
        >
          Spara mål ✓
        </button>
      </div>

      <div className={styles.infoBox}>
        <span className={styles.infoIcon}>ℹ️</span>
        <span className={styles.infoText}>
          Ett vanligt exempel är 60 / 40. Det är inte ett råd.
        </span>
      </div>
    </Panel>
  );
}

export default GoalAllocation;
