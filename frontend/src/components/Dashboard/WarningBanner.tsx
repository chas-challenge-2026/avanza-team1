import styles from './WarningBanner.module.css';

interface WarningBannerProps {
  message?: string;
}

function WarningBanner({
  message = 'Portföljen har glidit från målat — alloker 75% mot mål 60% (gratis 5%)'
}: WarningBannerProps): JSX.Element {
  return (
    <div className={styles.banner}>
      <span className={styles.icon}>⚠️</span>
      <span>{message}</span>
    </div>
  );
}

export default WarningBanner;
