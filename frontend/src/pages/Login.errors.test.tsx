
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiError } from "../api/httpClient";
import { useAuth } from "../auth/useAuth";
import Login from "./Login";

// Mock the authentication hook so we can control login results
// without making real API requests or depending on the backend.
vi.mock("../auth/useAuth", () => ({
  useAuth: vi.fn(),
}));

describe("Login error handling", () => {
  beforeEach(() => {
    // Start every test with an empty session to avoid
    // authentication data leaking between tests.
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("shows a server error without redirecting on HTTP 500", async () => {
    // Simulate the same HTTP error type used by our API client.
    const login = vi.fn().mockRejectedValue(
      new ApiError(500, "Internal Server Error"),
    );

    // Simulate an authentication context with no logged-in user.
    vi.mocked(useAuth).mockReturnValue({
      login,
      logout: vi.fn(),
      user: null,
      isAuthenticated: false,
    });

    // Render both routes so we can detect an unwanted redirect.
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>,
    );

    // Submit credentials to trigger the simulated server error.
    fireEvent.change(screen.getByLabelText("E-post"), {
      target: { value: "anna@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Lösenord"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Logga in" }));

    // Verify that the correct server error is announced.
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Ett serverfel uppstod. Försök igen senare.",
    );

    // Failed authentication must not redirect or store a token.
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(localStorage.getItem("ph_token")).toBeNull();
  });

  it("shows a connection error when the backend is unreachable", async () => {
    // Simulate a fetch failure where no HTTP response is received.
    // This tests the UI behavior, not the actual network connection.
    const login = vi.fn().mockRejectedValue(
      new TypeError("Failed to fetch"),
    );

    // Provide a simulated authentication context with no active session.
    vi.mocked(useAuth).mockReturnValue({
      login,
      logout: vi.fn(),
      user: null,
      isAuthenticated: false,
    });

    // Render the login page with a dashboard route for redirect checks.
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>,
    );

    // Enter credentials and attempt to log in.
    fireEvent.change(screen.getByLabelText("E-post"), {
      target: { value: "anna@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Lösenord"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Logga in" }));

    // Verify that the user receives a helpful connection error.
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Det gick inte att ansluta till tjänsten.",
    );

    // A network failure must not navigate to the dashboard
    // or create a new authentication token.
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(localStorage.getItem("ph_token")).toBeNull();
  });

it("shows a generic message for unexpected errors", async () => {
  // Simulate an unexpected error that is neither an
  // HTTP response error nor a network failure.
  const login = vi.fn().mockRejectedValue(
    new Error("Unexpected authentication failure"),
  );

  // Keep the user unauthenticated during this test.
  vi.mocked(useAuth).mockReturnValue({
    login,
    logout: vi.fn(),
    user: null,
    isAuthenticated: false,
  });

  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  );

  // Submit the form to trigger the simulated failure.
  fireEvent.change(screen.getByLabelText("E-post"), {
    target: { value: "anna@example.com" },
  });

  fireEvent.change(screen.getByLabelText("Lösenord"), {
    target: { value: "password123" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Logga in" }));

  // Unexpected errors should produce a safe, user-friendly message.
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Något gick fel. Försök igen.",
  );

  // The failed attempt must not redirect or create a session.
  expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  expect(localStorage.getItem("ph_token")).toBeNull();
});
});
