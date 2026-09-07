import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title?: string;
  totalValue?: number;
  exchange?: string;
}

function PageHeader({
  title = 'Din portfölj',
  totalValue = 698450,
  exchange = 'USD/SEK 10:45'
}: PageHeaderProps): JSX.Element {
  return (
    <div className={styles.pageHeader}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.value}>
        {totalValue.toLocaleString('sv-SE')} <span>SEK</span>
      </div>
      <p className={styles.subtitle}>Värde: {exchange}</p>
    </div>
  );
}

export default PageHeader;
