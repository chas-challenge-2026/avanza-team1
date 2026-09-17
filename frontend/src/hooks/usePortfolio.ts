import { useQuery } from "@tanstack/react-query";
import { portfolioApi } from "../api/portfolioApi";
import type { Portfolio } from "../types/portfolio";

export interface UsePortfolioResult {
  portfolio: Portfolio | undefined;
  isPending: boolean;
  isError: boolean;
}

export function usePortfolio(): UsePortfolioResult {
  const query = useQuery<Portfolio>({
    queryKey: ["portfolio"],
    queryFn: () => portfolioApi.getPortfolio(),
  });

  return {
    portfolio: query.data,
    isPending: query.isPending,
    isError: query.isError,
  };
}
