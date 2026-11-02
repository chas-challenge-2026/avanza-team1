
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Authentication mode", () => {
  beforeEach(() => {
    // Start every test with a clean session and module cache.
    // This prevents previous authentication state from affecting the result.
    localStorage.clear();
    vi.resetModules();
  });

  afterEach(() => {
    // Restore the original environment and fetch implementation
    // so other test files are not affected by this test.
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("does not fall back to mock when the backend is unavailable", async () => {
    // Explicitly select backend authentication before loading auth.ts.
    // The module reads VITE_USE_MOCK when it is imported.
    vi.stubEnv("VITE_USE_MOCK", "false");

    // Simulate a network failure instead of contacting the real backend.
    const fetchMock = vi.fn().mockRejectedValue(
      new TypeError("Failed to fetch"),
    );
    vi.stubGlobal("fetch", fetchMock);

    // Import after configuring the environment to ensure
    // auth.ts uses backend mode rather than the test default.
    const { login } = await import("./auth");

    // A network failure must be reported, not replaced
    // with a successful login using a mock account.
    await expect(
      login("anna@example.com", "password123"),
    ).rejects.toThrow("Failed to fetch");

    // Verify that the backend request was actually attempted.
    expect(fetchMock).toHaveBeenCalledOnce();

    // A failed backend request must not create a new session.
    expect(localStorage.getItem("ph_token")).toBeNull();
    expect(localStorage.getItem("ph_user")).toBeNull();
  });

it("uses mock authentication when explicitly enabled", async () => {
  // Explicitly enable mock authentication before importing auth.ts.
  // This ensures the module starts in the correct mode.
  vi.stubEnv("VITE_USE_MOCK", "true");

  // Mock fetch so we can verify that no backend request is made.
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);

  // Import auth.ts after setting the environment variable.
  const { login } = await import("./auth");

  // Log in using an account from the predefined mock users.
  const result = await login("anna@example.com", "password123");

  // Verify that mock authentication succeeds.
  expect(result).not.toBeNull();
  expect(result?.token).toBe("mock-token");

  // Mock mode must not contact the real backend.
  expect(fetchMock).not.toHaveBeenCalled();

  // A successful mock login should store its session data.
  expect(localStorage.getItem("ph_token")).toBe("mock-token");
  expect(localStorage.getItem("ph_user")).not.toBeNull();
});

it("rejects an invalid authentication configuration", async () => {
  // An unexpected environment value must never enable mock mode.
  vi.stubEnv("VITE_USE_MOCK", "invalid");

  // Reload auth.ts so it reads the invalid configuration.
  await expect(import("./auth")).rejects.toThrow(
    "Invalid authentication configuration",
  );

  // No session should be created when configuration is invalid.
  expect(localStorage.getItem("ph_token")).toBeNull();
});

it("rejects a missing authentication configuration", async () => {
  // Remove the environment value instead of selecting a mode.
  vi.stubEnv("VITE_USE_MOCK", undefined);

  // Missing configuration must fail explicitly, not default to mock.
  await expect(import("./auth")).rejects.toThrow(
    "Invalid authentication configuration",
  );

  // Authentication must not create a session.
  expect(localStorage.getItem("ph_token")).toBeNull();
});

it("authenticates through the backend when mock mode is disabled", async () => {
  // Select real backend authentication before importing auth.ts.
  vi.stubEnv("VITE_USE_MOCK", "false");

  // Simulate a successful API response containing a user and JWT.
  const backendResponse = {
    user: {
      id: "1",
      name: "Anna Lindqvist",
      email: "anna@example.com",
    },
    token: "test-jwt-token",
  };

  // Replace the network request with a controlled response.
  // This verifies the frontend without requiring a running backend.
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(backendResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );

  vi.stubGlobal("fetch", fetchMock);

  // Load auth.ts after configuring the authentication mode.
  const { login } = await import("./auth");

  const result = await login("anna@example.com", "password123");

  // Verify that login called the real API endpoint.
  expect(fetchMock).toHaveBeenCalledOnce();
  expect(fetchMock.mock.calls[0][0]).toBe(
    "http://localhost:8082/api/auth/login",
  );

  // The application should use the backend response,
  // not the predefined mock token.
  expect(result).toEqual(backendResponse);
  expect(localStorage.getItem("ph_token")).toBe("test-jwt-token");

  // Verify that the authenticated user is stored correctly.
  expect(JSON.parse(localStorage.getItem("ph_user")!)).toEqual(
    backendResponse.user,
  );
});

it("rejects invalid credentials without creating a session", async () => {
  // Use backend authentication so the test covers the real API path.
  vi.stubEnv("VITE_USE_MOCK", "false");

  // Simulate HTTP 401 returned by the backend for invalid credentials.
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ message: "Invalid credentials" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    }),
  );

  vi.stubGlobal("fetch", fetchMock);

  // Import the authentication module after setting backend mode.
  const { login } = await import("./auth");

  const result = await login("anna@example.com", "wrong-password");

  // Invalid credentials should return null instead of logging in.
  expect(result).toBeNull();

  // Verify that a backend request was actually made.
  expect(fetchMock).toHaveBeenCalledOnce();

  // A failed login must not leave a token or user in localStorage.
  expect(localStorage.getItem("ph_token")).toBeNull();
  expect(localStorage.getItem("ph_user")).toBeNull();
});
});
