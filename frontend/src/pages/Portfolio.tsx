import PageHeader from '../components/Dashboard/PageHeader';
import WarningBanner from '../components/Dashboard/WarningBanner';
import AssetAllocation from '../components/Dashboard/AssetAllocation';
import GoalAllocation from '../components/Dashboard/GoalAllocation';
import AccountsTable from '../components/Dashboard/AccountsTable';
import AllocationTable from '../components/Dashboard/AllocationTable';
import NoticesEmpty from '../components/Dashboard/NoticesEmpty';
import HoldingsTable from '../components/Dashboard/HoldingsTable';
import './Portfolio.css';

function Portfolio() {
  return (
    <div className="portfolio-page">
      <PageHeader />
      <WarningBanner />
      <div className="dashboard-grid">
        <AssetAllocation />
        <GoalAllocation />
        <AccountsTable />
        <AllocationTable />
        <NoticesEmpty />
        <HoldingsTable />
      </div>
    </div>
  );
}

export default Portfolio;