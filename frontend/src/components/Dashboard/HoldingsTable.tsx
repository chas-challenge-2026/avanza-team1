import Panel from '../Panel';

function HoldingsTable(): JSX.Element {
  return (
    <Panel title="Innehav" size="large">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#333', margin: 0 }}>Innehav</h2>
        <a href="#" style={{ fontSize: '0.875rem', color: '#00a651', textDecoration: 'none' }}>← Tillbaka till Översikt</a>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
            <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: '#666' }}>Ticker</th>
            <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: '#666' }}>Namn</th>
            <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: '#666' }}>Konto</th>
            <th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: '#666' }}>Antal</th>
            <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: '#666' }}>Valuta</th>
            <th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: '#666' }}>Värde</th>
            <th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: '#666' }}>Värde SEK</th>
            <th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: '#666' }}>Ändring</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td style={{ padding: '0.75rem', color: '#00a651', fontWeight: '500' }}>AAPL</td>
            <td style={{ padding: '0.75rem' }}>Apple Inc</td>
            <td style={{ padding: '0.75rem' }}>Depå</td>
            <td style={{ padding: '0.75rem', textAlign: 'right' }}>10</td>
            <td style={{ padding: '0.75rem' }}>USD</td>
            <td style={{ padding: '0.75rem', textAlign: 'right' }}>21 000</td>
            <td style={{ padding: '0.75rem', textAlign: 'right' }}>21 000</td>
            <td style={{ padding: '0.75rem', textAlign: 'right', color: '#00a651' }}>+12%</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td style={{ padding: '0.75rem', color: '#00a651', fontWeight: '500' }}>VOLV-B</td>
            <td style={{ padding: '0.75rem' }}>Volvo</td>
            <td style={{ padding: '0.75rem' }}>ISK</td>
            <td style={{ padding: '0.75rem', textAlign: 'right' }}>40</td>
            <td style={{ padding: '0.75rem' }}>SEK</td>
            <td style={{ padding: '0.75rem', textAlign: 'right' }}>112 000</td>
            <td style={{ padding: '0.75rem', textAlign: 'right' }}>112 000</td>
            <td style={{ padding: '0.75rem', textAlign: 'right', color: '#00a651' }}>+4%</td>
          </tr>
          <tr>
            <td style={{ padding: '0.75rem', color: '#00a651', fontWeight: '500' }}>Avanza Global</td>
            <td style={{ padding: '0.75rem' }}>Avanza Global (KF)</td>
            <td style={{ padding: '0.75rem' }}>KF</td>
            <td style={{ padding: '0.75rem', textAlign: 'right' }}>250</td>
            <td style={{ padding: '0.75rem' }}>SEK</td>
            <td style={{ padding: '0.75rem', textAlign: 'right' }}>89 500</td>
            <td style={{ padding: '0.75rem', textAlign: 'right' }}>89 500</td>
            <td style={{ padding: '0.75rem', textAlign: 'right', color: '#00a651' }}>-7%</td>
          </tr>
        </tbody>
      </table>

      <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '1rem' }}>Värdena i SEK med FX-vikten</p>
    </Panel>
  );
}

export default HoldingsTable;
