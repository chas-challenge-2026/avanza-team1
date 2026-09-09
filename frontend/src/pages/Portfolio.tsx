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
import type { Allocation } from "../types/portfolio";
import { readStoredTarget } from "../lib/targetAllocation";

function Portfolio() {
  const storedTarget = readStoredTarget();
  const [allocation, setAllocation] = useState<Allocation>({
    ...mockPortfolio.allocation,
    targetAktierPct:
      storedTarget?.targetAktierPct ?? mockPortfolio.allocation.targetAktierPct,
    targetStabiltPct:
      storedTarget?.targetStabiltPct ??
      mockPortfolio.allocation.targetStabiltPct,
  });

  function handleTargetSaved(
    targetAktierPct: number,
    targetStabiltPct: number,
  ) {
    setAllocation((prev) => ({
      ...prev,
      targetAktierPct,
      targetStabiltPct,
    }));
  }

  return (
    <div className="portfolio-page">
      <PageHeader
        totalValueSek={mockPortfolio.totalValueSek}
        fx={mockPortfolio.fx}
      />
      {mockPortfolio.allocation.overThreshold && (
        <WarningBanner
          message={
            mockPortfolio.alerts[0]?.message ??
            "Portföljen har glidit från målet."
          }
        />
      )}
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
        <NoticesEmpty alerts={mockPortfolio.alerts} />
        <HoldingsTable holdings={mockPortfolio.holdings} />
      </div>
    </div>
  );
}

export default Portfolio;
