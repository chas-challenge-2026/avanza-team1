import styles from "./WarningBanner.module.css";

interface WarningBannerProps {
  message: string;
}

function WarningBanner({ message }: WarningBannerProps): JSX.Element {
  return (
    <div className={styles.banner}>
      <span className={styles.icon}>⚠️</span>
      <span>{message}</span>
    </div>
  );
}

export default WarningBanner;
