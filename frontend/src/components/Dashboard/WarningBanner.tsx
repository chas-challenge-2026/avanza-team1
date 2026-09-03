interface WarningBannerProps {
  message?: string;
}

function WarningBanner({ message = 'Uppdatera dina kontoinställningar för bättre säkerhet.' }: WarningBannerProps): JSX.Element {
  return (
    <div style={{
      backgroundColor: '#fff3cd',
      border: '1px solid #ffc107',
      borderRadius: '4px',
      padding: '1rem',
      marginBottom: '1rem',
      color: '#856404'
    }}>
      <strong>Varning:</strong> {message}
    </div>
  );
}

export default WarningBanner;
