import styles from "./AllocationPieChart.module.css";

interface AllocationPieChartProps {
  aktierPct: number;
  stabiltPct: number;
}

interface Sector {
  color: string;
  name: string;
  value: number;
}

const center = 50;
const radius = 48;
const labelRadius = 27;
const smallSectorThreshold = 12;

function pointAt(angle: number, distance: number) {
  const radians = ((angle - 90) * Math.PI) / 180;

  return {
    x: center + distance * Math.cos(radians),
    y: center + distance * Math.sin(radians),
  };
}

function sectorPath(startAngle: number, portion: number) {
  if (portion <= 0) return "";

  if (portion >= 1) {
    return `M ${center} ${center} m 0 -${radius} a ${radius} ${radius} 0 1 1 0 ${radius * 2} a ${radius} ${radius} 0 1 1 0 -${radius * 2}`;
  }

  const endAngle = startAngle + portion * 360;
  const start = pointAt(startAngle, radius);
  const end = pointAt(endAngle, radius);
  const largeArc = portion > 0.5 ? 1 : 0;

  return `M ${center} ${center} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

function formatPercentage(value: number) {
  return `${value}%`;
}

function AllocationPieChart({
  aktierPct,
  stabiltPct,
}: AllocationPieChartProps): JSX.Element {
  const sectors: Sector[] = [
    {
      name: "Aktier",
      value: Math.max(0, aktierPct),
      color: "var(--primary-color)",
    },
    {
      name: "Stabilt",
      value: Math.max(0, stabiltPct),
      color: "var(--dark-gray)",
    },
  ];
  const total = sectors.reduce((sum, sector) => sum + sector.value, 0);
  const showExternalLabels = sectors.every(
    (sector) => sector.value < smallSectorThreshold,
  );
  let startAngle = 0;

  return (
    <div className={styles.chart}>
      <svg
        aria-labelledby="allocationChartTitle allocationChartDescription"
        className={styles.svg}
        role="img"
        viewBox="0 0 100 100"
      >
        <title id="allocationChartTitle">Aktuell allokering</title>
        <desc id="allocationChartDescription">
          Aktier: {formatPercentage(aktierPct)}. Stabilt: {formatPercentage(stabiltPct)}.
        </desc>
        {total === 0 ? (
          <circle
            className={styles.emptySector}
            cx={center}
            cy={center}
            r={radius}
          />
        ) : (
          sectors.map((sector) => {
            const portion = sector.value / total;
            const path = sectorPath(startAngle, portion);
            const middleAngle = startAngle + portion * 180;
            const labelPoint = pointAt(middleAngle, labelRadius);
            startAngle += portion * 360;

            return (
              <g key={sector.name}>
                {path && <path d={path} fill={sector.color} />}
                {!showExternalLabels && sector.value > 0 && (
                  <text
                    className={styles.label}
                    textAnchor="middle"
                    x={labelPoint.x}
                    y={labelPoint.y}
                  >
                    {formatPercentage(sector.value)}
                  </text>
                )}
              </g>
            );
          })
        )}
      </svg>

      {showExternalLabels && (
        <div className={styles.legend}>
          {sectors.map((sector) => (
            <div className={styles.legendItem} key={sector.name}>
              <span
                aria-hidden="true"
                className={styles.indicator}
                style={{ backgroundColor: sector.color }}
              />
              <span>
                {sector.name}: {formatPercentage(sector.value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllocationPieChart;
