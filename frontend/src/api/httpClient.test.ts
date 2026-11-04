import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiFetch } from "./httpClient";

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("apiFetch", () => {
  it("includes the HTTP status when the path does not exist", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify({ message: "Not found" }), {
            status: 404,
            statusText: "Not Found",
          }),
        ),
      ),
    );

    await expect(apiFetch("/api/does-not-exist")).rejects.toEqual(
      expect.objectContaining({
        name: "ApiError",
        status: 404,
        message: "Not found",
      }),
    );

    expect(ApiError).toBeDefined();
  });
});
