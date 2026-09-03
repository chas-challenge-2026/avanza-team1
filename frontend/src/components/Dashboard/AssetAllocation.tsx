import Panel from '../Panel';

interface Asset {
  name: string;
  procent: number;
}

interface AssetAllocationProps {
  assets?: Asset[];
}

function AssetAllocation({ assets = [
  { name: 'Aktier', procent: 45 },
  { name: 'Obligationer', procent: 35 },
  { name: 'Kontanter', procent: 20 }
] }: AssetAllocationProps): JSX.Element {
  return (
    <Panel title="Tillgångsfördelning" size="medium">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {assets.map((asset) => (
          <div key={asset.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>{asset.name}</span>
              <span>{asset.procent}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${asset.procent}%`,
                height: '100%',
                backgroundColor: '#00a651'
              }} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export default AssetAllocation;
