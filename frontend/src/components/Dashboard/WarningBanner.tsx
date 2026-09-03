interface WarningBannerProps {
  message?: string;
}

function WarningBanner({
  message = 'Portföljen har glidit från målat — alloker 75% mot mål 60% (gratis 5%)'
}: WarningBannerProps): JSX.Element {
  return (
    <div style={{
      backgroundColor: '#fff3cd',
      border: '1px solid #ffc107',
      borderRadius: '4px',
      padding: '1rem',
      marginBottom: '1rem',
      color: '#856404',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem'
    }}>
      <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>⚠️</span>
      <span>{message}</span>
    </div>
  );
}

export default WarningBanner;
