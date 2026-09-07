import styles from './WarningBanner.module.css';

interface WarningBannerProps {
  message?: string;
}

function WarningBanner({
  message = 'Portföljen har glidit från målet — aktier 75% mot mål 60% (gräns 5%)'
}: WarningBannerProps): JSX.Element {
  return (
    <div className={styles.banner}>
      <span className={styles.icon}>⚠️</span>
      <span>{message}</span>
    </div>
  );
}

export default WarningBanner;
