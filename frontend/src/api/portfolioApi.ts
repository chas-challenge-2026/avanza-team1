import type { Portfolio } from "../types/portfolio";
import { mockPortfolioApi } from "./adapters/mockPortfolioApi";
import { httpPortfolioApi } from "./adapters/httpPortfolioApi";

export interface PortfolioApi {
  getPortfolio: () => Promise<Portfolio>;
}

const useMock = import.meta.env.VITE_USE_MOCK !== "false";

export const portfolioApi: PortfolioApi = useMock
  ? mockPortfolioApi
  : httpPortfolioApi;
