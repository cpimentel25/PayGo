import { render, screen, fireEvent } from "@testing-library/react";
import RegisterPage from "./page";
import { useRouter } from "next/navigation";

// Mocks globales
window.alert = jest.fn(); // Mock para window.alert

// Mock para useRouter
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock para fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: "Usuario registrado con éxito" }),
  })
);

describe("RegisterPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("valida y registra un usuario correctamente", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/Email:/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password:/i), {
      target: { value: "Password123" },
    });
    fireEvent.click(screen.getByLabelText(/Register as Admin:/i));

    fireEvent.submit(screen.getByRole("button"));

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: "test@example.com",
          password: "Password123",
          is_admin: true,
        }),
      })
    );
  });

  it("muestra un error si la contraseña no es válida", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/Email:/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password:/i), {
      target: { value: "pass" }, // Contraseña inválida
    });

    fireEvent.submit(screen.getByRole("button"));

    expect(window.alert).toHaveBeenCalledWith(expect.any(String));

    expect(fetch).not.toHaveBeenCalled();
  });
});
