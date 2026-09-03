import Panel from '../Panel';

interface Allocation {
  name: string;
  procent: number;
  value: number;
}

interface AllocationTableProps {
  allocations?: Allocation[];
}

function AllocationTable({ allocations = [
  { name: 'Läkemedelsakties', procent: 15, value: 100000 },
  { name: 'Teknikakties', procent: 20, value: 135000 },
  { name: 'Obligationer', procent: 35, value: 235000 },
  { name: 'Andra', procent: 30, value: 200000 }
] }: AllocationTableProps): JSX.Element {
  return (
    <Panel title="Fördelning" size="large">
      <table>
        <thead>
          <tr>
            <th>Typ</th>
            <th style={{ textAlign: 'right' }}>Andel</th>
            <th style={{ textAlign: 'right' }}>Värde</th>
          </tr>
        </thead>
        <tbody>
          {allocations.map((item) => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td style={{ textAlign: 'right' }}>{item.procent}%</td>
              <td style={{ textAlign: 'right' }}>
                {item.value.toLocaleString('sv-SE')} kr
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

export default AllocationTable;
