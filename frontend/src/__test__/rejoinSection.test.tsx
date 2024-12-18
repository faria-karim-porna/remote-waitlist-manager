import { render, screen, fireEvent } from "@testing-library/react";
import { RejoinSection } from "../components/rejoinSection";
import { deleteUser } from "../components/core/redux/apiSlices/userApiSlice";
import { UserAction } from "../components/core/redux/slices/userSlice";
import { clearLocalStorage } from "../components/storages/localStorage";

const mockDispatch = jest.fn();

jest.mock("../components/core/redux/store", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: jest.fn(),
}));

jest.mock("../components/core/redux/apiSlices/userApiSlice", () => ({
  deleteUser: jest.fn(),
}));

jest.mock("../components/storages/localStorage", () => ({
  clearLocalStorage: jest.fn(),
}));

jest.mock("../components/core/redux/slices/userSlice", () => ({
  UserAction: {
    removeUserInfo: jest.fn(),
  },
}));

describe("RejoinSection Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders TextSection with correct titles and subtitles", () => {
    render(<RejoinSection />);
    expect(screen.getByText("Thanks for dining with us!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Thank you for choosing our restaurant! We hope your meal was delightful and look forward to welcoming you back soon."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Want to join us again for another delicious meal? Click below to rejoin, and we’ll save your spot!")
    ).toBeInTheDocument();
  });

  it("renders the 'Join with us again' button", () => {
    render(<RejoinSection />);
    const button = screen.getByText("Join with us again");
    expect(button).toBeInTheDocument();
  });

  test("calls handleJoinAgain with the correct name", async () => {
    const mockUserResponse = null;
    (deleteUser as unknown as jest.Mock).mockResolvedValue(mockUserResponse);

    mockDispatch.mockResolvedValue({
      payload: mockUserResponse,
    });

    render(<RejoinSection name={"John Doe"} />);

    fireEvent.click(screen.getByText("Join with us again"));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(deleteUser).toHaveBeenCalledWith("John Doe");
    expect(clearLocalStorage).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(UserAction.removeUserInfo());
  });
});
