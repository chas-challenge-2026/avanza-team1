import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { portfolioApi } from "../api/portfolioApi";
import type { HistoryRange, HistorySeries } from "../types/history";

interface UseHistoryParams {
  ticker: string;
  range: HistoryRange;
}

export interface UseHistoryResult {
  series: HistorySeries | undefined;
  isPending: boolean;
  isFetching: boolean;
  isError: boolean;
}

export function useHistory({ ticker, range }: UseHistoryParams): UseHistoryResult {
  const query = useQuery<HistorySeries>({
    queryKey: ["history", ticker, range],
    queryFn: ({ signal }) => portfolioApi.getHistory({ ticker, range }, signal),
    placeholderData: keepPreviousData,
    enabled: Boolean(ticker),
  });

  return {
    series: query.data,
    isPending: query.isPending,
    isFetching: query.isFetching,
    isError: query.isError,
  };
}
