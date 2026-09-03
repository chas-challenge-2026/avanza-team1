import Panel from '../Panel';

interface NoticesEmptyProps {
  emptyMessage?: string;
}

function NoticesEmpty({ emptyMessage = 'Inga nya meddelanden' }: NoticesEmptyProps): JSX.Element {
  return (
    <Panel title="Meddelanden" size="medium">
      <div style={{
        textAlign: 'center',
        color: '#999',
        padding: '2rem 0'
      }}>
        <p>{emptyMessage}</p>
      </div>
    </Panel>
  );
}

export default NoticesEmpty;
