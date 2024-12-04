import React from "react";
import { render, screen } from "@testing-library/react";
import { DineInView } from "../components/views/dineInView";
import bgPhoto from "../assets/images/dineInBg.jpg";
import { BackgroundContainer } from "../components/common/backgroundContainer";

jest.mock("../components/common/backgroundContainer", () => ({
  BackgroundContainer: jest.fn(({ children }) => <div data-testid="background-container">{children}</div>),
}));


describe("DineInView Component", () => {
  it("renders BackgroundContainer with the correct image", () => {
    render(<DineInView />);
    const backgroundContainer = screen.getByTestId("background-container");
    expect(BackgroundContainer).toHaveBeenCalledWith(expect.objectContaining({ imageURL: bgPhoto }), expect.anything());
    expect(backgroundContainer).toBeInTheDocument();
  });


  it("displays the correct content", () => {
    render(<DineInView />);
    expect(screen.getByText("Enjoy your meal!!")).toBeInTheDocument();
    expect(
      screen.getByText(
        "We’re thrilled to serve you today and can’t wait for you to experience the delicious meal we’ve prepared. Each dish is crafted with care, bringing together the freshest ingredients and bold flavors just for you. From the first bite to the last, we hope every mouthful delights your senses and makes your dining experience unforgettable."
      )
    ).toBeInTheDocument();
  });
});
