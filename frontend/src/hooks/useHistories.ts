import { keepPreviousData, useQueries } from "@tanstack/react-query";
import { portfolioApi } from "../api/portfolioApi";
import type { HistoryRange, HistorySeries } from "../types/history";

export function useHistories(keys: string[], range: HistoryRange): Record<string, HistorySeries | undefined> {
  const uniqueKeys = [...new Set(keys)];
  const queries = useQueries({
    queries: uniqueKeys.map((key) => ({
      queryKey: ["history", key, range],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        portfolioApi.getHistory({ key, range }, signal),
      placeholderData: keepPreviousData,
      enabled: Boolean(key),
    })),
  });

  return Object.fromEntries(
    uniqueKeys.map((key, index) => [key, queries[index].data]),
  );
}
