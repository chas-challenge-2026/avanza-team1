import Panel from '../Panel';

interface Account {
  id: number;
  name: string;
  balance: number;
}

interface AccountsTableProps {
  accounts?: Account[];
}

function AccountsTable({ accounts = [
  { id: 1, name: 'ISK Avanza', balance: 125500 },
  { id: 2, name: 'IPS Pension', balance: 325000 },
  { id: 3, name: 'Sparbuff', balance: 75000 }
] }: AccountsTableProps): JSX.Element {
  return (
    <Panel title="Dina konton" size="medium">
      <table>
        <thead>
          <tr>
            <th>Konto</th>
            <th style={{ textAlign: 'right' }}>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>{account.name}</td>
              <td style={{ textAlign: 'right' }}>
                {account.balance.toLocaleString('sv-SE')} kr
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

export default AccountsTable;
