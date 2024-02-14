import { render, fireEvent, screen } from "@testing-library/react";
import TimeSheetForm from "./TimeSheetForm";

const mockUserData = { sub: "user-id-123" };
const mockToken = "fake-token-123";
const mockFetchTimeSheets = jest.fn();

describe("TimeSheetForm", () => {
  it("renders correctly", () => {
    render(
      <TimeSheetForm
        userData={mockUserData}
        token={mockToken}
        fetchTimeSheets={mockFetchTimeSheets}
      />
    );

    // Verificamos que el botón de "Add Entry" está presente
    expect(
      screen.getByRole("button", { name: /add entry/i })
    ).toBeInTheDocument();
  });

  it("allows adding a new entry", () => {
    render(
      <TimeSheetForm
        userData={mockUserData}
        token={mockToken}
        fetchTimeSheets={mockFetchTimeSheets}
      />
    );

    // Simula el clic en el botón "Add Entry"
    fireEvent.click(screen.getByRole("button", { name: /add entry/i }));

    // Verifica que ahora hay dos secciones para entradas, lo que indica que se agregó una nueva entrada
    const entrySections = screen.getAllByText(/employee/i); // Asumimos "Employee" es parte del formulario
    expect(entrySections.length).toBe(2);
  });

  // Eliminación de entradas
  it("allows removing an entry", () => {
    render(
      <TimeSheetForm
        userData={mockUserData}
        token={mockToken}
        fetchTimeSheets={mockFetchTimeSheets}
      />
    );

    // Añadimos dos entradas
    fireEvent.click(screen.getByRole("button", { name: /add entry/i }));
    fireEvent.click(screen.getByRole("button", { name: /add entry/i }));

    // Eliminamos una entrada
    fireEvent.click(screen.getByRole("button", { name: /remove entry/i }));

    // Verificamos que la cantidad de secciones de entradas haya disminuido
    const entrySections = screen.getAllByText(/employee/i);
    expect(entrySections.length).toBe(2);
  });

  // Actualización de campos
  it("allows updating an entry's employee name", () => {
    render(
      <TimeSheetForm
        userData={mockUserData}
        token={mockToken}
        fetchTimeSheets={mockFetchTimeSheets}
      />
    );

    const employeeNameInput =
      screen.getAllByPlaceholderText("Employee Name")[0];
    fireEvent.change(employeeNameInput, { target: { value: "John Doe" } });

    // Verifica que el valor del input ha sido actualizado
    expect(employeeNameInput.value).toBe("John Doe");
  });

  // Validaciones antes del envío del formulario
  it("validates entries before submitting", () => {
    window.alert = jest.fn(); // Espía el método alert

    render(
      <TimeSheetForm
        userData={mockUserData}
        token={mockToken}
        fetchTimeSheets={mockFetchTimeSheets}
      />
    );

    // Intenta enviar el formulario sin modificar los valores predeterminados, lo que debería fallar la validación
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Verifica que se haya llamado al alert, indicando que la validación falló
    expect(window.alert).toHaveBeenCalled();
  });
});
