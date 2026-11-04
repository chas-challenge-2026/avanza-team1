import type { PortfolioApi } from "../portfolioApi";
import type { StoredTarget } from "../../lib/targetAllocation";
import { mockPortfolio } from "../../types/portfolio";
import { saveStoredTarget } from "../../lib/targetAllocation";

export const mockPortfolioApi: PortfolioApi = {
  async getPortfolio() {
    return mockPortfolio;
  },

  async saveAllocation(target: StoredTarget) {
    return saveStoredTarget(target);
  },
};
