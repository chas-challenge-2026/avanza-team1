import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { portfolioApi } from "../api/portfolioApi";
import type { HistoryRange, HistorySeries } from "../types/history";

interface UseHistoryParams {
  key: string;
  range: HistoryRange;
}

export interface UseHistoryResult {
  series: HistorySeries | undefined;
  isPending: boolean;
  isFetching: boolean;
  isError: boolean;
}

export function useHistory({ key, range }: UseHistoryParams): UseHistoryResult {
  const query = useQuery<HistorySeries>({
    queryKey: ["history", key, range],
    queryFn: ({ signal }) => portfolioApi.getHistory({ key, range }, signal),
    placeholderData: keepPreviousData,
    enabled: Boolean(key),
  });

  return {
    series: query.data,
    isPending: query.isPending,
    isFetching: query.isFetching,
    isError: query.isError,
  };
}
