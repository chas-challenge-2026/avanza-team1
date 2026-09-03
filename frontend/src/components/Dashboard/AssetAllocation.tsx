function AssetAllocation(): JSX.Element {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
      <div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '0.25rem' }}>75%</div>
        <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem' }}>/ i mal 60%</div>
        <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#333' }}>Aktier</div>
      </div>
      <div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333', marginBottom: '0.25rem' }}>25%</div>
        <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem' }}>/ i mal 40%</div>
        <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#333' }}>Fonder</div>
      </div>
    </div>
  );
}

export default AssetAllocation;
