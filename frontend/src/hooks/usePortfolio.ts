import { useQuery } from "@tanstack/react-query";
import { portfolioApi } from "../api/portfolioApi";
import type { Portfolio } from "../types/portfolio";

export function usePortfolio() {
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
