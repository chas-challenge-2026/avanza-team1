import styles from "./Panel.module.css";

interface PanelProps {
  title: string;
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

function Panel({ title, size = 'medium', children }: PanelProps) {
  return (
    <section className={`${styles.panel} ${size}`}>
      <div className={styles.panelHeader}>
        <h3>{title}</h3>
      </div>
      <div className="panelContent">
        {children}
      </div>
    </section>
  );
}

export default Panel;