import { useState } from "react";
import PageHeader from "../components/Dashboard/PageHeader";
import WarningBanner from "../components/Dashboard/WarningBanner";
import AssetAllocation from "../components/Dashboard/AssetAllocation";
import GoalAllocation from "../components/Dashboard/GoalAllocation";
import AccountsTable from "../components/Dashboard/AccountsTable";
import NoticesEmpty from "../components/Dashboard/NoticesEmpty";
import HoldingsTable from "../components/Dashboard/HoldingsTable";
import "./Portfolio.css";
import { mockPortfolio } from "../types/portfolio";
import type { Alert, Allocation } from "../types/portfolio";
import { readStoredTarget } from "../lib/targetAllocation";
import { computeDrift } from "../lib/drift";

function withDrift(allocation: Allocation): Allocation {
  const { overThreshold } = computeDrift(allocation);
  return { ...allocation, overThreshold };
}

function driftAlerts(allocation: Allocation): Alert[] {
  const drift = computeDrift(allocation);
  if (!drift.overThreshold) return [];
  return [{ type: "DRIFT", message: drift.message }];
}

function Portfolio() {
  const storedTarget = readStoredTarget();
  const [allocation, setAllocation] = useState<Allocation>(() =>
    withDrift({
      ...mockPortfolio.allocation,
      targetAktierPct:
        storedTarget?.targetAktierPct ??
        mockPortfolio.allocation.targetAktierPct,
      targetStabiltPct:
        storedTarget?.targetStabiltPct ??
        mockPortfolio.allocation.targetStabiltPct,
    }),
  );

  const drift = computeDrift(allocation);

  function handleTargetSaved(
    targetAktierPct: number,
    targetStabiltPct: number,
  ) {
    setAllocation((prev) =>
      withDrift({
        ...prev,
        targetAktierPct,
        targetStabiltPct,
      }),
    );
  }

  return (
    <div className="portfolio-page">
      <PageHeader
        totalValueSek={mockPortfolio.totalValueSek}
        fx={mockPortfolio.fx}
      />
      {drift.overThreshold && <WarningBanner message={drift.message} />}
      <div className="dashboard-grid">
        <AssetAllocation allocation={allocation} />
        <GoalAllocation
          targetAktierPct={allocation.targetAktierPct}
          targetStabiltPct={allocation.targetStabiltPct}
          onTargetSaved={handleTargetSaved}
        />
        <AccountsTable
          accounts={mockPortfolio.accounts}
          allocation={allocation}
        />
        <NoticesEmpty alerts={driftAlerts(allocation)} />
        <HoldingsTable holdings={mockPortfolio.holdings} />
      </div>
    </div>
  );
}

export default Portfolio;
