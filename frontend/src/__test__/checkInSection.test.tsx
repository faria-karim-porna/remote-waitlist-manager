import { render, screen, fireEvent } from "@testing-library/react";
import { CheckInSection } from "../components/checkInSection";
import { checkInUser } from "../components/core/redux/apiSlices/userApiSlice";
import { EnumStatus } from "../components/core/dataTypes/enums/userEnum";
import { UserAction, UserReducer } from "../components/core/redux/slices/userSlice";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

const mockDispatch = jest.fn();

jest.mock("../components/core/redux/store", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: jest.fn(),
}));

jest.mock("../components/core/redux/apiSlices/userApiSlice", () => ({
  checkInUser: jest.fn(),
}));

describe("CheckInSection Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders the message text", () => {
    render(<CheckInSection />);
    expect(screen.getByText("Your table is just a check-in away. Tap to get started!")).toBeInTheDocument();
  });

  it("renders the Check in button", () => {
    render(<CheckInSection />);
    const button = screen.getByText("Check in");
    expect(button).toBeInTheDocument();
  });

  test("handles checkIn function", async () => {
    const mockUserResponse = { name: "John Doe", partySize: 4, status: EnumStatus.SeatIn, canCheckIn: true, waitingPosition: 3 };
    (checkInUser as unknown as jest.Mock).mockResolvedValue(mockUserResponse);

    mockDispatch.mockResolvedValue({
      payload: mockUserResponse,
    });

    const store = configureStore({ reducer: { user: UserReducer } });
    render(
      <Provider store={store}>
        <CheckInSection name={"John Doe"} />
      </Provider>
    );

    fireEvent.click(screen.getByText("Check in"));

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(checkInUser).toHaveBeenCalledWith("John Doe");

    expect(mockDispatch).toHaveBeenCalledWith(UserAction.setUserInfo(mockUserResponse));
  });
});
