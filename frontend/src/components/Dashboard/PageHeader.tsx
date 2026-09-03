interface PageHeaderProps {
  title?: string;
  totalValue?: number;
  exchange?: string;
}

function PageHeader({
  title = 'Din portfölj',
  totalValue = 698450,
  exchange = 'USD/SEK 10:45'
}: PageHeaderProps): JSX.Element {
  return (
    <div className="page-header">
      <h1>{title}</h1>
      <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>
        {totalValue.toLocaleString('sv-SE')} <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>SEK</span>
      </div>
      <p className="subtitle" style={{ color: '#666', fontSize: '0.875rem' }}>Värde: {exchange}</p>
    </div>
  );
}

export default PageHeader;