import type { PortfolioApi } from "../portfolioApi";
import type { Portfolio } from "../../types/portfolio";

export const httpPortfolioApi: PortfolioApi = {
  async getPortfolio(): Promise<Portfolio> {
    throw new Error("httpPortfolioApi: GET /api/portfolio is not wired yet");
  },

  async saveAllocation(): Promise<void> {
    throw new Error("httpPortfolioApi: PUT /api/allocation is not wired yet");
  },
};
