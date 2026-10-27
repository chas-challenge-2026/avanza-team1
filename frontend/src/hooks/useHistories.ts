import { keepPreviousData, useQueries } from "@tanstack/react-query";
import { portfolioApi } from "../api/portfolioApi";
import type { HistoryRange, HistorySeries } from "../types/history";

export interface UseHistoriesResult {
  histories: Record<string, HistorySeries | undefined>;
  isFetching: boolean;
  isError: boolean;
}

export function useHistories(
  keys: string[],
  range: HistoryRange,
  enabled = true,
): UseHistoriesResult {
  const uniqueKeys = [...new Set(keys)];
  const queries = useQueries({
    queries: uniqueKeys.map((key) => ({
      queryKey: ["history", key, range],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        portfolioApi.getHistory({ key, range }, signal),
      placeholderData: keepPreviousData,
      enabled: enabled && Boolean(key),
    })),
  });

  return {
    histories: Object.fromEntries(
      uniqueKeys.map((key, index) => [key, queries[index].data]),
    ),
    isFetching: queries.some((query) => query.isFetching),
    isError: queries.some((query) => query.isError),
  };
}
