interface PanelProps {
  title: string;
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

function Panel({ title, size = 'medium', children }: PanelProps) {
  return (
    <div className={`panel panel-${size}`}>
      <div className="panel-header">
        <h3>{title}</h3>
      </div>
      <div className="panel-content">
        {children}
      </div>
    </div>
  );
}

export default Panel;