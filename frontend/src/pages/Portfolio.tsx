import PageHeader from "../components/Dashboard/PageHeader";
import WarningBanner from "../components/Dashboard/WarningBanner";
import AssetAllocation from "../components/Dashboard/AssetAllocation";
import GoalAllocation from "../components/Dashboard/GoalAllocation";
import AccountsTable from "../components/Dashboard/AccountsTable";
import NoticesEmpty from "../components/Dashboard/NoticesEmpty";
import HoldingsTable from "../components/Dashboard/HoldingsTable";
import "./Portfolio.css";
import { mockPortfolio } from "../types/portfolio";

function Portfolio() {
  console.log("mockPortfolio", mockPortfolio);
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
        <AssetAllocation allocation={mockPortfolio.allocation} />
        <GoalAllocation />
        <AccountsTable
          accounts={mockPortfolio.accounts}
          allocation={mockPortfolio.allocation}
        />
        <NoticesEmpty alerts={mockPortfolio.alerts} />
        <HoldingsTable holdings={mockPortfolio.holdings} />
      </div>
    </div>
  );
}

export default Portfolio;
