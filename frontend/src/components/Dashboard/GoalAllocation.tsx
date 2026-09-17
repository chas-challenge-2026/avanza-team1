import { useState } from "react";
import Panel from "../Panel";
import styles from "./GoalAllocation.module.css";
import { useSaveAllocation } from "../../hooks/useSaveAllocation";

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

  const { saveAllocation, isPending, isError } = useSaveAllocation();

  const sum = equities + funds;
  const isValid = sum === 100;

  async function handleSave() {
    if (!isValid) return;

    try {
      await saveAllocation({
        targetAktierPct: equities,
        targetStabiltPct: funds,
      });
      onTargetSaved(equities, funds);
      setSaved(true);
    } catch {
      // isError becomes true through hook
    }
  }
  // TODO: Ändra description så det står "i din portfölj" i den. Ändra label till att bara innehålla orden "aktier" respektive "fonder"
  // TODO: ta bort label subtitle .
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
              if (Number(e.target.value) < 0) e.target.value = "0";
              if (Number(e.target.value) > 100) e.target.value = "100";
              setEquities(Number(e.target.value));
              setFunds(100 - Number(e.target.value));
              setSaved(false);
            }}
          />
          %
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
              if (Number(e.target.value) < 0) e.target.value = "0";
              if (Number(e.target.value) > 100) e.target.value = "100";
              setFunds(Number(e.target.value));
              setEquities(100 - Number(e.target.value));
              setSaved(false);
            }}
          />
          %
        </div>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryText}>
          {/* Summa:{" "}
          <span
            className={styles.summarySum}
            style={{ color: isValid ? undefined : "#c0392b" }}
          >
            {sum}
          </span>{" "}
          %{!isValid && " — Summan måste vara 100 %."}
          {saved && isValid && " — Mål sparat."} */}
          {/* {saved && "Mål sparat"} */}
        </div>
        <button
          className={styles.button}
          type="button"
          disabled={saved || isPending}
          onClick={handleSave}
        >
          {saved ? "Mål sparat" : "Spara mål"}
        </button>
        {isError && <p>Kunde inte spara målet.</p>}
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
