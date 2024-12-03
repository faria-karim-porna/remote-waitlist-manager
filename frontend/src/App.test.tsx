import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Header } from "./components/common/header";
import { LogoSVG } from "./assets/svg/logoSvg";
import { FormView } from "./components/views/formView";
import { BackgroundContainer } from "./components/common/backgroundContainer";
import bgPhoto from "./assets/images/formViewBg.png";
import { FormSection } from "./components/formSection";
import { Provider } from "react-redux";
import { joinUser } from "./components/core/redux/apiSlices/userApiSlice";
import { configureStore } from "@reduxjs/toolkit";
import { UserAction, UserReducer } from "./components/core/redux/slices/userSlice";
import {  rest } from "msw";
import { server } from "./mocks/server";

jest.mock("./components/core/redux/apiSlices/userApiSlice", () => ({
  joinUser: jest.fn(),
}));

jest.mock("./components/storages/localStorage", () => ({
  setUserInSessionStorage: jest.fn(),
}));

jest.mock("./assets/svg/logoSvg", () => ({
  LogoSVG: jest.fn(() => <svg data-testid="logo-svg">Mock Logo</svg>),
}));

jest.mock("./components/common/backgroundContainer", () => ({
  BackgroundContainer: jest.fn(({ children }) => <div data-testid="background-container">{children}</div>),
}));

// jest.mock("./components/formSection", () => ({
//   FormSection: jest.fn(() => <div data-testid="form-section">Mock FormSection</div>),
// }));


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

const mockDispatch = jest.fn();
jest.mock("../src/components/core/redux/store", () => ({
  useAppDispatch: () => mockDispatch,
}));

describe("FormSectionComponent", () => {
  let store = configureStore({ reducer: { user: UserReducer } });

  server.use(
    rest.post('/api/join', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          name: 'John Doe',
          partySize: 4,
        })
      );
    })
  );
  

  beforeEach(() => {
    store = configureStore({ reducer: { user: UserReducer } });
  });

  it("should dispatch joinUser and set user info correctly", async () => {
    // const mockResponse = { name: "John Doe", partySize: 5 };
    // joinUser.mockResolvedValue(mockResponse); // Mocking the API call success

    render(
      <Provider store={store}>
        <FormSection />
      </Provider>
    );

    // Simulating user input
    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Party size (not more than 10)"), {
      target: { value: "5" },
    });

    // Simulating form submission
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(2)); // Two dispatches expected (one for joinUser, one for setUserInfo)

    // Check if joinUser action was dispatched with correct payload
    expect(mockDispatch).toHaveBeenCalledWith(joinUser({ name: "John Doe", partySize: 4 }));

    // Check if the setUserInfo action was dispatched
    expect(mockDispatch).toHaveBeenCalledWith(UserAction.setUserInfo({
      name: "John Doe",
      partySize: 5,
    }));

    // await store.dispatch(joinUser({ name: "John Doe", partySize: 5 }));
    // Check if dispatch was called with joinUser
    // await waitFor(() => {
    //   expect(mockDispatch).toHaveBeenCalledWith(joinUser({ name: "John Doe", partySize: 5 }));
      
    // }).then(() => {
    //   // store.dispatch(UserAction.setUserInfo(mockResponse));
    //   // const state = store.getState().user;
    //   // expect(state.userInfo).toEqual(mockResponse);
    //   // expect(setUserInSessionStorage).toHaveBeenCalledWith("John Doe");
    // });

    // const state = store.getState().;

    // Check if UserAction.setUserInfo was dispatched


    // Check if setUserInSessionStorage was called
    
  });

  // it("should not allow invalid party size input", () => {
  //   render(
  //     <Provider store={configureStore({ reducer: {} })}>
  //       <FormSection />
  //     </Provider>
  //   );

  //   const partySizeInput = screen.getByPlaceholderText("Party size (not more than 10)");

  //   // Input invalid party size (more than 10)
  //   fireEvent.change(partySizeInput, { target: { value: "15" } });
  //   expect((partySizeInput as HTMLInputElement).value).toBe("1"); // Ensure input is not accepted

  //   // Input non-numeric value
  //   fireEvent.change(partySizeInput, { target: { value: "abc" } });
  //   expect((partySizeInput as HTMLInputElement).value).toBe(""); // Ensure input is not accepted

  //   // Input valid party size (up to 10)
  //   fireEvent.change(partySizeInput, { target: { value: "10" } });
  //   expect((partySizeInput as HTMLInputElement).value).toBe("10"); // Valid input is accepted
  // });
});
