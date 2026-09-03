import Panel from '../Panel';

interface Goal {
  name: string;
  target: number;
  current: number;
}

interface GoalAllocationProps {
  goals?: Goal[];
}

function GoalAllocation({ goals = [
  { name: 'Sparbuff', target: 100000, current: 75000 },
  { name: 'Pension', target: 500000, current: 325000 }
] }: GoalAllocationProps): JSX.Element {
  return (
    <Panel title="Sparmål" size="medium">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          return (
            <div key={goal.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span><strong>{goal.name}</strong></span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '10px',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  backgroundColor: '#00a651'
                }} />
              </div>
              <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
                {goal.current.toLocaleString('sv-SE')} / {goal.target.toLocaleString('sv-SE')} kr
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

export default GoalAllocation;
