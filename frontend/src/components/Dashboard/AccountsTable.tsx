function AccountsTable(): JSX.Element {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#333', marginBottom: '1rem' }}>Konton</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>ISK</span>
            <span>412 000 kr</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>KF</span>
            <span>196 200 kr</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Dagå</span>
            <span>100 250 kr</span>
          </div>
        </div>
      </div>
      <div>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#333', marginBottom: '1rem' }}>Tillgångsslag</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Aktier</span>
            <span style={{ fontWeight: '600', color: '#00a651' }}>75%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Fonder</span>
            <span style={{ fontWeight: '600', color: '#00a651' }}>25%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountsTable;
