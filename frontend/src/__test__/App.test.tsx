import { render, screen, fireEvent } from "@testing-library/react";
import { FormView } from "../components/views/formView";
import { BackgroundContainer } from "../components/common/backgroundContainer";
import bgPhoto from "./assets/images/formViewBg.png";
import { FormSection } from "../components/formSection";
import { Provider } from "react-redux";
import { checkInUser, joinUser } from "../components/core/redux/apiSlices/userApiSlice";
import { configureStore } from "@reduxjs/toolkit";
import { UserAction, UserReducer } from "../components/core/redux/slices/userSlice";
import { setUserInSessionStorage } from "../components/storages/localStorage";

const mockDispatch = jest.fn();

jest.mock("../components/core/redux/store", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: jest.fn(),
}));

jest.mock("../components/core/redux/apiSlices/userApiSlice", () => ({
  joinUser: jest.fn(),
}));

jest.mock("../components/storages/localStorage", () => ({
  setUserInSessionStorage: jest.fn(),
}));


jest.mock("../components/common/backgroundContainer", () => ({
  BackgroundContainer: jest.fn(({ children }) => <div data-testid="background-container">{children}</div>),
}));

jest.mock("../components/core/redux/apiSlices/userApiSlice", () => ({
  joinUser: jest.fn(),
  checkInUser: jest.fn(),
}));

jest.mock("../components/storages/localStorage", () => ({
  setUserInSessionStorage: jest.fn(),
}));

describe("FormView Component", () => {
  it("renders the BackgroundContainer with the correct imageURL", () => {
    render(<FormView />);

    const backgroundContainer = screen.getByTestId("background-container");
    expect(BackgroundContainer).toHaveBeenCalledWith(expect.objectContaining({ imageURL: bgPhoto }), expect.anything());
    expect(backgroundContainer).toBeInTheDocument();
  });

  it("renders the main structure and text", () => {
    render(<FormView />);

    const mainDiv = screen.getByText("Book amazing restaurants");
    const descriptionText = screen.getByText(/From local favorites to the trending restaurants, enjoy without the wait./i);

    expect(mainDiv).toBeInTheDocument();
    expect(descriptionText).toBeInTheDocument();
    expect(mainDiv).toHaveClass("font-40 font-weight-700");
  });

  // it("renders the FormSection component", () => {
  //   render(<FormView />);

  //   const formSection = screen.getByTestId("form-section");
  //   expect(formSection).toBeInTheDocument();
  //   // expect(formSection).toHaveTextContent("Mock FormSection");
  // });
});

describe("FormSection Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handles form submission and dispatches joinUser", async () => {
    const mockUserResponse = { name: "John Doe", partySize: 4 };
    (joinUser as unknown as jest.Mock).mockResolvedValue(mockUserResponse);

    mockDispatch.mockResolvedValue({
      payload: mockUserResponse,
    });

    const store = configureStore({ reducer: { user: UserReducer } });
    render(
      <Provider store={store}>
        <FormSection />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Party size (should be between 1-10)"), {
      target: { value: "4" },
    });

    fireEvent.click(screen.getByText("Submit"));

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(joinUser).toHaveBeenCalledWith({ name: "John Doe", partySize: 4 });

    expect(mockDispatch).toHaveBeenCalledWith(UserAction.setUserInfo(mockUserResponse));

    expect(setUserInSessionStorage).toHaveBeenCalledWith("John Doe");
  });

  it("should not allow invalid party size input", () => {
    render(
      <Provider store={configureStore( { reducer: { user: UserReducer }  })}>
        <FormSection />
      </Provider>
    );

    const partySizeInput = screen.getByPlaceholderText("Party size (should be between 1-10)");

    fireEvent.change(partySizeInput, { target: { value: "15" } });
    expect((partySizeInput as HTMLInputElement).value).toBe("1");

    fireEvent.change(partySizeInput, { target: { value: "a" } });
    expect((partySizeInput as HTMLInputElement).value).toBe("");

    fireEvent.change(partySizeInput, { target: { value: "10" } });
    expect((partySizeInput as HTMLInputElement).value).toBe("10");

    fireEvent.change(partySizeInput, { target: { value: "0" } });
    expect((partySizeInput as HTMLInputElement).value).toBe("");
  });
});