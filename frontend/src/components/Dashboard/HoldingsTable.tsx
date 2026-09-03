import Panel from '../Panel';

interface Holding {
  ticker: string;
  name: string;
  shares: number;
  price: number;
  value: number;
}

interface HoldingsTableProps {
  holdings?: Holding[];
}

function HoldingsTable({ holdings = [
  { ticker: 'AAPL', name: 'Apple Inc', shares: 10, price: 2200, value: 22000 },
  { ticker: 'MSFT', name: 'Microsoft', shares: 5, price: 3500, value: 17500 },
  { ticker: 'GOOGL', name: 'Alphabet', shares: 3, price: 4100, value: 12300 }
] }: HoldingsTableProps): JSX.Element {
  return (
    <Panel title="Innehav" size="large">
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Namn</th>
            <th style={{ textAlign: 'right' }}>Andel</th>
            <th style={{ textAlign: 'right' }}>Pris</th>
            <th style={{ textAlign: 'right' }}>Värde</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => (
            <tr key={holding.ticker}>
              <td><strong>{holding.ticker}</strong></td>
              <td>{holding.name}</td>
              <td style={{ textAlign: 'right' }}>{holding.shares}</td>
              <td style={{ textAlign: 'right' }}>
                {holding.price.toLocaleString('sv-SE')} kr
              </td>
              <td style={{ textAlign: 'right' }}>
                {holding.value.toLocaleString('sv-SE')} kr
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

export default HoldingsTable;
