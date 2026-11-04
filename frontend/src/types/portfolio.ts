// To be replaced with GET /API/portfolio week 4
import portfolioJson from "../data/portfolio.json";

export type AccountType = "ISK" | "KF" | "DEPA" | "PENSION";
export type AssetClass = "AKTIER" | "STABILT";
export type Currency = "SEK" | "USD" | "EUR";

export interface Fx {
  usdSek: number;
  eurSek: number;
}

export interface Account {
  name: string;
  type: AccountType;
  valueSek: number;
}

export interface Allocation {
  actualAktierPct: number;
  actualStabiltPct: number;
  targetAktierPct: number;
  targetStabiltPct: number;
  thresholdPct: number;
  overThreshold: boolean;
}

export interface Holding {
  ticker: string;
  name: string;
  account: AccountType;
  quantity: number;
  currency: Currency;
  valueSek: number;
  returnPct: number;
  assetClass: AssetClass;
}

export interface Alert {
  type: string;
  message: string;
}

export interface Portfolio {
  userName: string;
  totalValueSek: number;
  fx: Fx;
  accounts: Account[];
  allocation: Allocation;
  holdings: Holding[];
  alerts: Alert[];
}

export const mockPortfolio: Portfolio = portfolioJson as Portfolio;
