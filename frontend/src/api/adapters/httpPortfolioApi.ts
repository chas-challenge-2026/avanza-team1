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
    params: { key: string; range: HistoryRange },
    signal?: AbortSignal,
  ): Promise<HistorySeries> {
    // TODO: Confirm the history endpoint contract with the Spring Boot backend and native back-testing module.
    const query = new URLSearchParams({ key: params.key, range: params.range });
    const response = await apiFetch(`/portfolio/history?${query.toString()}`, { signal });
    return (await response.json()) as HistorySeries;
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
