import HoldingsTable from "../components/Dashboard/HoldingsTable";
import { usePortfolio } from "../hooks/usePortfolio";

function Holdings() {
  const { portfolio, isPending, isError } = usePortfolio();

  if (isPending) {
    return <p>Laddar innehav…</p>;
  }

  if (isError || !portfolio) {
    return <p>Kunde inte hämta innehaven.</p>;
  }

  return (
    <HoldingsTable holdings={portfolio.holdings} />
  );
}

export default Holdings;
