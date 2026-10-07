import type { PortfolioApi } from "../portfolioApi";
import type { Portfolio } from "../../types/portfolio";
import type { StoredTarget } from "../../lib/targetAllocation";
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
