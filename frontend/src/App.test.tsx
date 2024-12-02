import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Header } from './components/common/header';

describe("Header Component", () => {
  it("renders the header with the correct structure and classes", () => {
    const { container } = render(<Header />);
    const headerDiv = container.querySelector(".header");

    expect(headerDiv).toBeInTheDocument();
    expect(headerDiv).toHaveClass("w-100 d-flex justify-content-center align-items-center fixed-top");
  });
});
