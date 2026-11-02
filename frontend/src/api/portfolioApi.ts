import type { Portfolio } from "../types/portfolio";
import type { HistoryRange, HistorySeries } from "../types/history";
import { mockPortfolioApi } from "./adapters/mockPortfolioApi";
import { httpPortfolioApi } from "./adapters/httpPortfolioApi";
import type { StoredTarget } from "../lib/targetAllocation";

export interface PortfolioApi {
  getPortfolio: () => Promise<Portfolio>;
  getHistory: (
    params: { key: string; range: HistoryRange },
    signal?: AbortSignal,
  ) => Promise<HistorySeries>;
  saveAllocation: (target: StoredTarget) => Promise<void>;
}

const useMock = import.meta.env.VITE_USE_MOCK !== "false";

export const portfolioApi: PortfolioApi = useMock
  ? mockPortfolioApi
  : httpPortfolioApi;
