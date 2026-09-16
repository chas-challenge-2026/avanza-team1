import type { PortfolioApi } from "../portfolioApi";
import type { Portfolio } from "../../types/portfolio";

export const httpPortfolioApi: PortfolioApi = {
  async getPortfolio(): Promise<Portfolio> {
    // When backend is complete, change Throw to Authorization: Bearer <ph_token>
    throw new Error("httpPortfolioApi: GET /api/portfolio is not wired yet");
  },
};
