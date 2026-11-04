import type { PortfolioApi } from "../portfolioApi";
import type { Portfolio } from "../../types/portfolio";
import type { StoredTarget } from "../../lib/targetAllocation";
import type { HistoryRange, HistorySeries } from "../../types/history";
import { apiFetch } from "../httpClient";

function isPortfolio(value: unknown): value is Portfolio {
  if (!value || typeof value !== "object") return false;
  const portfolio = value as Partial<Portfolio>;
  return (
    typeof portfolio.userName === "string" &&
    typeof portfolio.totalValueSek === "number" &&
    portfolio.fx !== undefined &&
    portfolio.allocation !== undefined &&
    Array.isArray(portfolio.accounts) &&
    Array.isArray(portfolio.holdings) &&
    Array.isArray(portfolio.alerts)
  );
}

interface DailyPrice {
  date: string;
  close: number;
}

function isDailyPrice(value: unknown): value is DailyPrice {
  if (!value || typeof value !== "object") return false;
  const price = value as Partial<DailyPrice>;
  return (
    typeof price.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(price.date) &&
    typeof price.close === "number" &&
    Number.isFinite(price.close)
  );
}

function isDailyPriceList(value: unknown): value is DailyPrice[] {
  return Array.isArray(value) && value.every(isDailyPrice);
}

export const httpPortfolioApi: PortfolioApi = {
  async getPortfolio(): Promise<Portfolio> {
    const response = await apiFetch("/api/portfolio");
    const body: unknown = await response.json();
    if (!isPortfolio(body)) {
      throw new Error("GET /api/portfolio returned an unexpected shape");
    }
    return body;
  },

  async getHistory(
    params: { ticker: string; range: HistoryRange },
    signal?: AbortSignal,
  ): Promise<HistorySeries> {
    const query = new URLSearchParams({ ticker: params.ticker, range: params.range });
    const response = await apiFetch(`/api/holdings/history?${query.toString()}`, { signal });
    const body: unknown = await response.json();
    if (!isDailyPriceList(body)) {
      throw new Error("GET /api/holdings/history returned an unexpected shape");
    }

    return {
      ticker: params.ticker,
      range: params.range,
      label: params.ticker,
      points: body.map(({ date, close }) => ({ date, value: close })),
    };
  },

  async saveAllocation(target: StoredTarget): Promise<void> {
    await apiFetch("/api/allocation", {
      method: "PUT",
      body: JSON.stringify({
        targetAktierPct: target.targetAktierPct,
        targetStabiltPct: target.targetStabiltPct,
      }),
    });
  },
};
