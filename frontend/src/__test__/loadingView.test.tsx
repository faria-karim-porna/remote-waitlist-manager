import { render, screen } from "@testing-library/react";
import { LoadingView } from "../components/views/loadingView";
import { BackgroundContainer } from "../components/common/backgroundContainer";

jest.mock("../components/common/backgroundContainer", () => ({
  BackgroundContainer: jest.fn(({ children }) => <div data-testid="background-container">{children}</div>),
}));

describe("LoadingView Component", () => {
  it("renders BackgroundContainer with the correct gradient", () => {
    const gradientColor = "280deg, #68007a 6%, #1f053d 84%";
    render(<LoadingView />);

    const backgroundContainer = screen.getByTestId("background-container");
    expect(BackgroundContainer).toHaveBeenCalledWith(expect.objectContaining({ gradientColor }), expect.anything());
    expect(backgroundContainer).toBeInTheDocument();
  });

  it("displays the 'Loading...' text", () => {
    render(<LoadingView />);
    const loadingText = screen.getByText("Loading...");
    expect(loadingText).toBeInTheDocument();
  });
});
