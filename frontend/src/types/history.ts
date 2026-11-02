export type HistoryRange = "1M" | "6M" | "1Y" | "ALL";

export interface HistoryPoint {
  date: string;
  value: number;
}

export interface HistorySeries {
  key: string;
  label: string;
  points: HistoryPoint[];
  color?: string;
}
