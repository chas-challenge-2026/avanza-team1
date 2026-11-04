function MockModeBanner(): JSX.Element | null {
  if (import.meta.env.VITE_USE_MOCK !== "true") {
    return null;
  }

  return (
    <div role="status" className="mockModeBanner">
      <strong>Demoläge aktivt</strong>
      <span>
        Du använder en demonstrationsversion med testdata.
        Inloggningen verifieras inte mot den riktiga tjänsten.
      </span>
    </div>
  );
}

export default MockModeBanner;