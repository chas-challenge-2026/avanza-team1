import { useMemo } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HistorySeries } from "../../types/history";
import Panel from "../Panel";
import styles from "./HistoryChart.module.css";

interface HistoryChartProps {
  series: HistorySeries[];
}

const numberFormat = new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 });
const shortDateFormat = new Intl.DateTimeFormat("sv-SE", {
  day: "numeric",
  month: "short",
});
const lineColors = [
  "var(--primary-color)",
  "var(--primary-color-dark)",
  "var(--primary-color-light)",
];

function formatDate(value: string): string {
  return shortDateFormat.format(new Date(`${value}T00:00:00`));
}

function HistoryChart({ series }: HistoryChartProps): JSX.Element | null {
  const data = useMemo(() => {
    const rows = new Map<string, Record<string, string | number>>();
    for (const item of series) {
      for (const point of item.points) {
        const row = rows.get(point.date) ?? { date: point.date };
        row[item.key] = point.value;
        rows.set(point.date, row);
      }
    }
    return Array.from(rows.values()).sort((left, right) =>
      String(left.date).localeCompare(String(right.date)),
    );
  }, [series]);

  if (series.length === 0 || data.length === 0) return null;

  return (
    <Panel title="Historisk utveckling" size="large">
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              interval="preserveStartEnd"
              minTickGap={28}
            />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(value: number) => numberFormat.format(value)}
              width={76}
            />
            <Tooltip
              labelFormatter={(label) => formatDate(String(label))}
              formatter={(value) => `${numberFormat.format(Number(value))} kr`}
            />
            {series.map((item, index) => (
              <Line
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.label}
                stroke={lineColors[index % lineColors.length]}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

export default HistoryChart;
