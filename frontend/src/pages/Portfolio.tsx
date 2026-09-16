import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/Dashboard/PageHeader";
import WarningBanner from "../components/Dashboard/WarningBanner";
import AssetAllocation from "../components/Dashboard/AssetAllocation";
import GoalAllocation from "../components/Dashboard/GoalAllocation";
import AccountsTable from "../components/Dashboard/AccountsTable";
import NoticesEmpty from "../components/Dashboard/NoticesEmpty";
import HoldingsTable from "../components/Dashboard/HoldingsTable";
import "./Portfolio.css";
import type { Alert, Allocation } from "../types/portfolio";
import { portfolioApi } from "../api/portfolioApi";
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
  const { data, isPending, isError } = useQuery({
    queryKey: ["portfolio"],
    queryFn: () => portfolioApi.getPortfolio(),
  });

  const [allocation, setAllocation] = useState<Allocation | null>(null);

  useEffect(() => {
    if (!data) return;

    const storedTarget = readStoredTarget();

    setAllocation(
      withDrift({
        ...data.allocation,
        targetAktierPct:
          storedTarget?.targetAktierPct ?? data.allocation.targetAktierPct,
        targetStabiltPct:
          storedTarget?.targetStabiltPct ?? data.allocation.targetStabiltPct,
      }),
    );
  }, [data]);

  if (isPending || allocation === null) {
    return <p>Laddar portfölj…</p>;
  }

  if (isError || !data) {
    return <p>Kunde inte hämta portföljen.</p>;
  }

  const portfolio = data;

  const drift = computeDrift(allocation);

  function handleTargetSaved(
    targetAktierPct: number,
    targetStabiltPct: number,
  ) {
    setAllocation((prev) => {
      if (!prev) return prev;

      return withDrift({
        ...prev,
        targetAktierPct,
        targetStabiltPct,
      });
    });
  }

  return (
    <>
      <PageHeader totalValueSek={portfolio.totalValueSek} fx={portfolio.fx} />
      {drift.overThreshold && <WarningBanner message={drift.message} />}
      <div className="dashboard-grid">
        <AssetAllocation allocation={allocation} />
        <GoalAllocation
          targetAktierPct={allocation.targetAktierPct}
          targetStabiltPct={allocation.targetStabiltPct}
          onTargetSaved={handleTargetSaved}
        />
        <AccountsTable accounts={portfolio.accounts} allocation={allocation} />
        <NoticesEmpty alerts={driftAlerts(allocation)} />
        <HoldingsTable holdings={portfolio.holdings} />
      </div>
    </>
  );
}

export default Portfolio;
