import { render } from "@testing-library/react";
import { Header } from "./components/common/header";
import { LogoSVG } from "./assets/svg/logoSvg";

jest.mock("./assets/svg/logoSvg", () => ({
  LogoSVG: jest.fn(() => <svg data-testid="logo-svg">Mock Logo</svg>),
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
  });
});
