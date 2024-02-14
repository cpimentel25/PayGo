import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./page";
import useAuthStore from "@/store/authStore";

// Mocks globales
const mockLogin = jest.fn();
const mockPush = jest.fn();

window.alert = jest.fn();

jest.mock("@/store/authStore", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: mockPush,
    };
  },
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ access_token: "fake_token" }),
  })
);

describe("LoginPage", () => {
  beforeEach(() => {
    useAuthStore.mockReturnValue({
      login: jest.fn(),
    });
    jest.clearAllMocks();
  });

  it("permite al usuario loguearse correctamente", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByRole("button"));

    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });

    await screen.findByRole("button");

    expect(mockPush).toHaveBeenCalledWith("/timeSheet");
  });

  it("muestra un error cuando la autenticación falla", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "Error de autenticación" }),
      })
    );

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    // Simula el envío del formulario
    fireEvent.submit(screen.getByRole("button"));

    await screen.findByRole("button");
  });
});
