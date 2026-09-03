import Panel from '../Panel';

function GoalAllocation(): JSX.Element {
  return (
    <Panel title="Målallokering" size="large">
      <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        Ange hur du vill att din ställer ska fördelats. Summan av vara 100 %.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '1.5rem' }}>📊</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#333', marginBottom: '0.25rem' }}>Aktier (%)</div>
            <div style={{ fontSize: '0.75rem', color: '#999' }}>Andel älter i din portfölj</div>
          </div>
          <input type="number" placeholder="60" style={{ width: '60px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
          <span style={{ fontSize: '0.875rem', color: '#666' }}>%</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '1.5rem' }}>🟢</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#333', marginBottom: '0.25rem' }}>Fonder (%)</div>
            <div style={{ fontSize: '0.75rem', color: '#999' }}>Andel älter i din portfölj</div>
          </div>
          <input type="number" placeholder="40" style={{ width: '60px', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
          <span style={{ fontSize: '0.875rem', color: '#666' }}>%</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid #f0f0f0', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#333' }}>Summa: <span style={{ color: '#00a651' }}>100</span> %</div>
        <button style={{ padding: '0.5rem 1rem', backgroundColor: '#00a651', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Spara mål ✓</button>
      </div>

      <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #d4edda', borderRadius: '4px', padding: '1rem', display: 'flex', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>ℹ️</span>
        <span style={{ fontSize: '0.75rem', color: '#155724' }}>Ett värdigt engagemang af 60 / 40. Det är inte ett rål.</span>
      </div>
    </Panel>
  );
}

export default GoalAllocation;
