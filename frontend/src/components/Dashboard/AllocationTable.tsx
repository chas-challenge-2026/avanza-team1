import Panel from '../Panel';

function AllocationTable(): JSX.Element {
  return (
    <Panel title="Fördelning" size="large">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
            <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: '#666' }}>Tillgångsslag</th>
            <th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: '#666' }}>Andel</th>
            <th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: '#666' }}>Värde</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td style={{ padding: '0.75rem' }}>Aktier</td>
            <td style={{ padding: '0.75rem', textAlign: 'right', color: '#00a651', fontWeight: '600' }}>75%</td>
            <td style={{ padding: '0.75rem', textAlign: 'right' }}>523 837 kr</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
            <td style={{ padding: '0.75rem' }}>Obligationer</td>
            <td style={{ padding: '0.75rem', textAlign: 'right', color: '#00a651', fontWeight: '600' }}>15%</td>
            <td style={{ padding: '0.75rem', textAlign: 'right' }}>104 767 kr</td>
          </tr>
          <tr>
            <td style={{ padding: '0.75rem' }}>Kontanter</td>
            <td style={{ padding: '0.75rem', textAlign: 'right', color: '#00a651', fontWeight: '600' }}>10%</td>
            <td style={{ padding: '0.75rem', textAlign: 'right' }}>69 846 kr</td>
          </tr>
        </tbody>
      </table>
    </Panel>
  );
}

export default AllocationTable;
