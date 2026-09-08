import Panel from "../Panel";
import styles from "./NoticesEmpty.module.css";
import type { Alert } from "../../types/portfolio";

interface NoticesEmptyProps {
  alerts: Alert[];
}

function NoticesEmpty({ alerts }: NoticesEmptyProps): JSX.Element {
  return (
    <Panel title="Meddelanden" size="medium">
      {alerts.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Inga nya meddelanden</p>
        </div>
      ) : (
        <ul className={styles.empty}>
          {alerts.map((alert, index) => (
            <li key={`${alert.type}-${index}`}>{alert.message}</li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

export default NoticesEmpty;
