import "./Panel.module.css";

interface PanelProps {
  title: string;
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

function Panel({ title, size = 'medium', children }: PanelProps) {
  return (
    <section className={`panel ${size}`}>
      <div className="panelHeader">
        <h3>{title}</h3>
      </div>
      <div className="panelContent">
        {children}
      </div>
    </section>
  );
}

export default Panel;