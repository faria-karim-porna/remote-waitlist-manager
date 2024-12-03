import { render, screen } from "@testing-library/react";
import { Header } from "./components/common/header";
import { LogoSVG } from "./assets/svg/logoSvg";
import { FormView } from "./components/views/formView";
import { BackgroundContainer } from "./components/common/backgroundContainer";
import bgPhoto from "./assets/images/formViewBg.png";
import { FormSection } from "./components/formSection";

jest.mock("./assets/svg/logoSvg", () => ({
  LogoSVG: jest.fn(() => <svg data-testid="logo-svg">Mock Logo</svg>),
}));

jest.mock("./components/common/backgroundContainer", () => ({
  BackgroundContainer: jest.fn(({ children }) => <div data-testid="background-container">{children}</div>),
}));

jest.mock("./components/formSection", () => ({
  FormSection: jest.fn(() => <div data-testid="form-section">Mock FormSection</div>),
}));

describe("Header Component", () => {
  it("renders the header with the correct structure and classes", () => {
    const { container } = render(<Header />);
    const headerDiv = container.querySelector(".header");

    expect(headerDiv).toBeInTheDocument();
    expect(headerDiv).toHaveClass("w-100 d-flex justify-content-center align-items-center fixed-top");
  });

  it("renders the inner div with the correct classes", () => {
    const { container } = render(<Header />);
    const innerDiv = container.querySelector(".d-flex.w-75.align-items-center.position-relative");

    expect(innerDiv).toBeInTheDocument();
  });

  it("renders the LogoSVG component", () => {
    const { getByTestId } = render(<Header />);
    const logoSVG = getByTestId("logo-svg");

    expect(logoSVG).toBeInTheDocument();
    expect(LogoSVG).toHaveBeenCalledTimes(3);
  });
});



describe("FormView Component", () => {
  it("renders the BackgroundContainer with the correct imageURL", () => {
    render(<FormView />);

    const backgroundContainer = screen.getByTestId("background-container");
    expect(BackgroundContainer).toHaveBeenCalledWith(
      expect.objectContaining({ imageURL: bgPhoto }),
      expect.anything()
    );
    expect(backgroundContainer).toBeInTheDocument();
  });

  it("renders the main structure and text", () => {
    render(<FormView />);

    const mainDiv = screen.getByText("Book amazing restaurants");
    const descriptionText = screen.getByText(
      /From local favorites to the trending restaurants, enjoy without the wait./i
    );

    expect(mainDiv).toBeInTheDocument();
    expect(descriptionText).toBeInTheDocument();
    expect(mainDiv).toHaveClass("font-40 font-weight-700");
  });

  it("renders the FormSection component", () => {
    render(<FormView />);

    const formSection = screen.getByTestId("form-section");
    expect(formSection).toBeInTheDocument();
    expect(formSection).toHaveTextContent("Mock FormSection");
  });

  it("matches the snapshot", () => {
    const { asFragment } = render(<FormView />);
    expect(asFragment()).toMatchSnapshot();
  });
});

