import { render, screen } from "@testing-library/react";
import { FormView } from "../components/views/formView";
import { BackgroundContainer } from "../components/common/backgroundContainer";
import bgPhoto from "../assets/images/formViewBg.png";

const mockDispatch = jest.fn();

jest.mock("../components/core/redux/store", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: jest.fn(),
}));

jest.mock("../components/core/redux/apiSlices/userApiSlice", () => ({
  joinUser: jest.fn(),
}));

jest.mock("../components/common/backgroundContainer", () => ({
  BackgroundContainer: jest.fn(({ children }) => <div data-testid="background-container">{children}</div>),
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

});
