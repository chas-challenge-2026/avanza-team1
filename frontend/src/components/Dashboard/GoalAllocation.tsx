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
  return (
    <Panel title="Sätt ny målallokering" size="large">
      <p className={styles.description}>
        Ange hur du vill att andelen riskbetonade respektive stabila innehav ska fördelas i din portfölj.
      </p>
      <div className={styles.inputsContainer}>
        <div className={styles.inputRow}>
          <div className={styles.label}>
            <div className={styles.labelTitle}>Aktier (%)</div>
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
          <div className={styles.label}>
            <div className={styles.labelTitle}>Fonder (%)</div>
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
        <button
          className={"green"}
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
          Detta förändrar inte innehållet i din portfölj! Du anger här endast hur du önskar att fördelningen i din samlade portfölj ska se ut mellan innehav som kan förändras mycket och mer stabila innehav med låg risk. 
        </span>
      </div>
    </Panel>
  );
}

export default GoalAllocation;
