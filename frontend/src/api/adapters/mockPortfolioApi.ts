import type { PortfolioApi } from "../portfolioApi";
import { mockPortfolio } from "../../types/portfolio";

export const mockPortfolioApi: PortfolioApi = {
  async getPortfolio() {
    return mockPortfolio;
  },
};
