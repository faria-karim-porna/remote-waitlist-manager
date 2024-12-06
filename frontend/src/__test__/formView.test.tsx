import { render, screen } from "@testing-library/react";
import { FormView } from "../components/views/formView";
import { BackgroundContainer } from "../components/common/backgroundContainer";
import bgPhoto from "../assets/images/formViewBg.png";
import { Provider } from "react-redux";
import { UserAction } from "../components/core/redux/slices/userSlice";
import { AppStore } from "../components/core/redux/store";

jest.mock("../components/common/backgroundContainer", () => ({
  BackgroundContainer: jest.fn(({ children }) => <div data-testid="background-container">{children}</div>),
}));

describe("FormView Component", () => {
  it("renders the BackgroundContainer with the correct imageURL", () => {
    render(
      <Provider store={AppStore}>
        <FormView />
      </Provider>
    );

    const backgroundContainer = screen.getByTestId("background-container");
    expect(BackgroundContainer).toHaveBeenCalledWith(expect.objectContaining({ imageURL: bgPhoto }), expect.anything());
    expect(backgroundContainer).toBeInTheDocument();
  });

  it("renders the main structure and text", () => {
    render(
      <Provider store={AppStore}>
        <FormView />
      </Provider>
    );

    const mainDiv = screen.getByText("Book amazing restaurants");
    const descriptionText = screen.getByText(/From local favorites to the trending restaurants, enjoy without the wait./i);

    expect(mainDiv).toBeInTheDocument();
    expect(descriptionText).toBeInTheDocument();
    expect(mainDiv).toHaveClass("font-40 font-weight-700");
  });

  it("error handling text if user already exists", () => {
    AppStore.dispatch(UserAction.setErrorMessage("Username already exist. Please choose a different one."));
    render(
      <Provider store={AppStore}>
        <FormView />
      </Provider>
    );

    expect(screen.getByText("Username already exist. Please choose a different one.")).toBeInTheDocument();
  });
});
