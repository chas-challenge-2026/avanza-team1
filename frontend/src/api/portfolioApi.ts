import type { Portfolio } from "../types/portfolio";
import { mockPortfolioApi } from "./adapters/mockPortfolioApi";
import { httpPortfolioApi } from "./adapters/httpPortfolioApi";
import type { StoredTarget } from "../lib/targetAllocation";

export interface PortfolioApi {
  getPortfolio: () => Promise<Portfolio>;
  saveAllocation: (target: StoredTarget) => Promise<void>;
}

const useMock = import.meta.env.VITE_USE_MOCK !== "false";

export const portfolioApi: PortfolioApi = useMock
  ? mockPortfolioApi
  : httpPortfolioApi;
