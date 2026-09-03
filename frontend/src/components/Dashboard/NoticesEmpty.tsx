import Panel from '../Panel';

function NoticesEmpty(): JSX.Element {
  return (
    <Panel title="Meddelanden" size="medium">
      <div style={{
        textAlign: 'center',
        color: '#999',
        padding: '2rem 0',
        fontSize: '0.875rem'
      }}>
        <p>Inga nya meddelanden</p>
      </div>
    </Panel>
  );
}

export default NoticesEmpty;
