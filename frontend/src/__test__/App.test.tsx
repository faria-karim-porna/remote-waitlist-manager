import { render, screen } from "@testing-library/react";
import { useSocket } from "../components/hooks/useSocket";
import App from "../App";
import { fetchUser } from "../components/core/redux/apiSlices/userApiSlice";
import { UserAction, UserReducer } from "../components/core/redux/slices/userSlice";
import { getUserFromLocalStorage } from "../components/storages/localStorage";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Header } from "../components/common/header";
import { Views } from "../components/views/views";

const mockDispatch = jest.fn();

jest.mock("../components/core/redux/store", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: jest.fn(),
}));

jest.mock("../components/core/redux/apiSlices/userApiSlice", () => ({
  fetchUser: jest.fn(),
}));

jest.mock("../components/storages/localStorage", () => ({
  getUserFromLocalStorage: jest.fn(),
}));

jest.mock("../components/hooks/useSocket", () => ({
  useSocket: jest.fn(),
}));

jest.mock("../components/common/header", () => ({
  Header: jest.fn(() => <div data-testid="header">Mock Header</div>),
}));

jest.mock("../components/views/views", () => ({
  Views: jest.fn(() => <div data-testid="views">Mock Views</div>),
}));

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls fetchUser with the username from session storage and set the response in store on mount", async () => {
    const mockUserName = "John Doe";
    const mockResponse = { name: "John Doe", partySize: 4 };
    (fetchUser as unknown as jest.Mock).mockResolvedValue(mockResponse);
    mockDispatch.mockResolvedValue({
      payload: mockResponse,
    });
    const store = configureStore({ reducer: { user: UserReducer } });
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(getUserFromLocalStorage).toHaveBeenCalled();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mockDispatch).toHaveBeenCalledWith(fetchUser(mockUserName));
    expect(mockDispatch).toHaveBeenCalledWith(UserAction.setUserInfo(mockResponse));
  });

  it("calls useSocket on mount", () => {
    const mockResponse = { name: "John Doe", partySize: 4 };
    (fetchUser as unknown as jest.Mock).mockResolvedValue(mockResponse);
    mockDispatch.mockResolvedValue({
      payload: mockResponse,
    });
    const store = configureStore({ reducer: { user: UserReducer } });
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(useSocket).toHaveBeenCalled();
  });

  it("renders Header and Views components", () => {
    const mockResponse = { name: "John Doe", partySize: 4 };
    (fetchUser as unknown as jest.Mock).mockResolvedValue(mockResponse);
    mockDispatch.mockResolvedValue({
      payload: mockResponse,
    });
    const store = configureStore({ reducer: { user: UserReducer } });
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const header = screen.getByTestId("header");
    expect(header).toBeInTheDocument();
    expect(Header).toHaveBeenCalled();

    const views = screen.getByTestId("views");
    expect(views).toBeInTheDocument();
    expect(Views).toHaveBeenCalled();
  });
});
