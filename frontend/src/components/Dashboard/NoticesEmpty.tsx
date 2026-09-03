import Panel from '../Panel';
import styles from './NoticesEmpty.module.css';

function NoticesEmpty(): JSX.Element {
  return (
    <Panel title="Meddelanden" size="medium">
      <div className={styles.empty}>
        <p className={styles.emptyText}>Inga nya meddelanden</p>
      </div>
    </Panel>
  );
}

export default NoticesEmpty;
