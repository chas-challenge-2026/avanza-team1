import { useEffect, useId, useRef, useState } from "react";
import styles from "./AllocationPieChart.module.css";

interface AllocationPieChartProps {
  aktierPct: number;
  stabiltPct: number;
}

interface Sector {
  color: string;
  edgeColor: string;
  gradientId: string;
  name: string;
  value: number;
}

const center = 50;
const radius = 48;
const labelRadius = 27;

function cssVariableToPixels(value: string, fallback: number, rootFontSize: number) {
  const numericValue = Number.parseFloat(value);

  if (Number.isNaN(numericValue)) return fallback;
  if (value.trim().endsWith("rem")) return numericValue * rootFontSize;

  return numericValue;
}

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
  const chartId = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const [labelMetrics, setLabelMetrics] = useState({
    chartDiameter: 300,
    nameFontSize: 12,
    valueFontSize: 24,
  });
  const sectors: Sector[] = [
    {
      name: "Aktier",
      value: Math.max(0, aktierPct),
      color: "var(--primary-color)",
      edgeColor: "var(--primary-color-dark)",
      gradientId: `${chartId}-aktierGradient`,
    },
    {
      name: "Stabilt",
      value: Math.max(0, stabiltPct),
      color: "var(--primary-color-dark)",
      edgeColor: "var(--dark-gray)",
      gradientId: `${chartId}-stabiltGradient`,
    },
  ];
  const total = sectors.reduce((sum, sector) => sum + sector.value, 0);
  const chartDiameter = Math.max(labelMetrics.chartDiameter, 1);
  const valueFontSize = (labelMetrics.valueFontSize / chartDiameter) * 100;
  const nameFontSize = (labelMetrics.nameFontSize / chartDiameter) * 100;
  const titleId = `${chartId}-title`;
  const descriptionId = `${chartId}-description`;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const chartSvg = svg;

    function updateLabelMetrics() {
      const rootStyles = getComputedStyle(document.documentElement);
      const rootFontSize = Number.parseFloat(rootStyles.fontSize);

      setLabelMetrics({
        chartDiameter: chartSvg.getBoundingClientRect().width,
        valueFontSize: cssVariableToPixels(
          rootStyles.getPropertyValue("--font-size-xlarge"),
          24,
          rootFontSize,
        ),
        nameFontSize: cssVariableToPixels(
          rootStyles.getPropertyValue("--font-size-small"),
          12,
          rootFontSize,
        ),
      });
    }

    updateLabelMetrics();
    if (typeof ResizeObserver === "undefined") return;

    const resizeObserver = new ResizeObserver(updateLabelMetrics);
    resizeObserver.observe(chartSvg);

    return () => resizeObserver.disconnect();
  }, []);

  function labelFitsSector(sector: Sector) {
    if (total === 0 || sector.value <= 0) return false;

    const portion = sector.value / total;
    if (portion >= 0.5) return true;

    const percentageWidth =
      formatPercentage(sector.value).length * labelMetrics.valueFontSize * 0.6;
    const nameWidth = sector.name.length * labelMetrics.nameFontSize * 0.55;
    const availableWidth =
      2 * labelRadius * (chartDiameter / 100) * Math.sin(portion * Math.PI);

    return Math.max(percentageWidth, nameWidth) <= availableWidth;
  }

  const externalSectors = sectors.filter(
    (sector) => sector.value > 0 && !labelFitsSector(sector),
  );
  const externalSectorNames = new Set(externalSectors.map((sector) => sector.name));
  let startAngle = 0;

  return (
    <div className={styles.chart}>
      <svg
        aria-labelledby={`${titleId} ${descriptionId}`}
        className={styles.svg}
        ref={svgRef}
        role="img"
        viewBox="0 0 100 100"
      >
        <title id={titleId}>Aktuell allokering</title>
        <desc id={descriptionId}>
          Aktier: {formatPercentage(aktierPct)}. Stabilt: {formatPercentage(stabiltPct)}.
        </desc>
        <defs>
          {sectors.map((sector) => (
            <radialGradient
              id={sector.gradientId}
              key={sector.gradientId}
              cx={center}
              cy={center}
              gradientUnits="userSpaceOnUse"
              r={radius}
            >
              <stop offset="0%" stopColor={sector.color} />
              <stop offset="100%" stopColor={sector.edgeColor} />
            </radialGradient>
          ))}
          <radialGradient
            id={`${chartId}-edgeShadow`}
            cx={center}
            cy={center + 2}
            gradientUnits="userSpaceOnUse"
            r={radius}
          >
            <stop offset="95%" stopColor="transparent" />
            <stop offset="120%" stopColor="rgba(0, 0, 0, 0.5)" />
          </radialGradient>
        </defs>
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
                {path && <path d={path} fill={`url(#${sector.gradientId})`} />}
                {!externalSectorNames.has(sector.name) && sector.value > 0 && (
                  <text
                    className={styles.label}
                    fontSize={valueFontSize}
                    textAnchor="middle"
                    x={labelPoint.x}
                    y={labelPoint.y}
                  >
                    {formatPercentage(sector.value)}
                    <tspan
                      className={styles.labelName}
                      dy={valueFontSize * 0.8}
                      fontSize={nameFontSize}
                      x={labelPoint.x}
                    >
                      {sector.name}
                    </tspan>
                  </text>
                )}
              </g>
            );
          })
        )}
        {total > 0 && (
          <circle
            className={styles.edgeShadow}
            cx={center}
            cy={center}
            fill={`url(#${chartId}-edgeShadow)`}
            r={radius}
          />
        )}
      </svg>

      {externalSectors.length > 0 && (
        <div className={styles.legend}>
          {externalSectors.map((sector) => (
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
