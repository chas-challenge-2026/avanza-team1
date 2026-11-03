import type { Currency } from "./portfolio";

export type HistoryRange = "1M" | "6M" | "1Y" | "10Y";

export interface HistoryPoint {
  date: string;
  value: number;
}

export interface HistorySeries {
  ticker: string;
  range: HistoryRange;
  label: string;
  points: HistoryPoint[];
  color?: string;
  currency?: Currency;
}
