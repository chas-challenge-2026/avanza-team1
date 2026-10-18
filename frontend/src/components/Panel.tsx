import styles from "./Panel.module.css";

interface PanelProps {
  title: string;
  size?: 'small' | 'medium' | 'large';
  titleColor?: string;
  children: React.ReactNode;
}

function Panel({ title, size = 'medium', titleColor, children }: PanelProps) {
  return (
    <section className={`${styles.panel} ${styles[size]}`}>
      <div className={`${styles.panelHeader} ${titleColor ? styles[titleColor] : undefined}`}>
        <h3>{title}</h3>
      </div>
      <div className="panelContent">
        {children}
      </div>
    </section>
  );
}

export default Panel;
