import { useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioApi } from "../api/portfolioApi";
import type { StoredTarget } from "../lib/targetAllocation";

export function useSaveAllocation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (target: StoredTarget) => portfolioApi.saveAllocation(target),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  return {
    saveAllocation: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}
