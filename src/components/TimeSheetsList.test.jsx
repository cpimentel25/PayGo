import { render, screen, fireEvent } from "@testing-library/react";
import TimeSheetsList from "./TimeSheetsList";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

import * as nextRouter from "next/navigation";

jest.mock("@/store/authStore", () => ({
  __esModule: true,
  default: jest.fn(),
}));

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: "/" }));

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
    };
  },
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

describe("TimeSheetsList", () => {
  beforeEach(() => {
    fetch.mockClear();
    useAuthStore.mockReturnValue({
      logout: jest.fn(),
    });
  });

  it("renders correctly with time sheets", () => {
    const mockTimeSheets = [
      {
        id: 1,
        employeeName: "John Doe",
        hourlyRate: 20,
        hours: 8,
        totalPay: 160,
        status: "Pending",
      },
    ];

    const mockUserData = {
      email: "john@example.com",
      is_admin: true,
    };

    render(
      <TimeSheetsList
        userData={mockUserData}
        timeSheets={mockTimeSheets}
        token="dummyToken"
        fetchTimeSheets={jest.fn()}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("$20")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("160")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("calls logout on logOut button click", () => {
    const logoutMock = jest.fn();
    useAuthStore.mockReturnValue({ logout: logoutMock }); // Ajuste aquí
    useRouter.mockImplementation(() => ({ push: jest.fn() }));

    const mockTimeSheets = [
      {
        id: 1,
        employeeName: "John Doe",
        hourlyRate: 20,
        hours: 8,
        totalPay: 160,
        status: "Pending",
      },
    ];

    const mockUserData = { email: "john@example.com", is_admin: true };

    render(
      <TimeSheetsList
        userData={mockUserData}
        timeSheets={mockTimeSheets}
        token="dummyToken"
        fetchTimeSheets={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Log out"));
    expect(logoutMock).toHaveBeenCalled();
  });

  // Más pruebas
});
