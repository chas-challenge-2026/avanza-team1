interface PageHeaderProps {
  title?: string;
  subtitle?: string;
}

function PageHeader({ title = 'Min portfölj', subtitle = 'Uppdaterad: idag' }: PageHeaderProps): JSX.Element {
  return (
    <div className="page-header">
      <h1>{title}</h1>
      <p className="subtitle">{subtitle}</p>
    </div>
  );
}

export default PageHeader;