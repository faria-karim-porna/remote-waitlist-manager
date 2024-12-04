import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { AppStore } from "../components/core/redux/store";
import { UserAction } from "../components/core/redux/slices/userSlice";
import { WaitListView } from "../components/views/waitListView";

describe("WaitListView Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders data from store when data is an array", () => {
    AppStore.dispatch(UserAction.setUserInfo({ name: "John Doe", canCheckIn: true, waitingPosition: 3 }));

    render(
      <Provider store={AppStore}>
        <WaitListView />
      </Provider>
    );
  });

  // test("renders the waitlist view when check-in is not available", () => {
  //   jest.mock("./components/core/redux/store", () => ({
  //     useAppDispatch: () => mockDispatch,
  //     useAppSelector: jest.fn((selector) =>
  //       selector({
  //         userApi: { userFetch: { isBusy: false } },
  //         user: {
  //           userInfo: { name: "John Doe", canCheckIn: false, waitingPosition: 3 },
  //         },
  //       })
  //     ),
  //   }));

  //   const store = configureStore({ reducer: { user: UserReducer } });
  //   render(
  //     <Provider store={store}>
  //       <WaitListView />
  //     </Provider>
  //   );

  //   expect(screen.getByText("Thank you for choosing us – we'll seat you soon!")).toBeInTheDocument();
  //   expect(screen.getByText("You're #3 on the waitlist. Please wait.")).toBeInTheDocument();
  // });

  // test("handles check-in submission", async () => {
  //   const mockUserResponse = { name: "John Doe", canCheckIn: false };
  //   (checkInUser as unknown as jest.Mock).mockResolvedValue(mockUserResponse);
  //   mockDispatch.mockResolvedValue({ payload: mockUserResponse });

  //   const store = configureStore({ reducer: { user: UserReducer } });
  //   render(
  //     <Provider store={store}>
  //       <WaitListView />
  //     </Provider>
  //   );

  //   fireEvent.click(screen.getByRole("button", { name: "Submit" }));

  //   expect(checkInUser).toHaveBeenCalledWith("John Doe");
  //   // expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
  //   await new Promise((resolve) => setTimeout(resolve, 0));
  //   expect(mockDispatch).toHaveBeenCalledWith(UserAction.setUserInfo(mockUserResponse));
  // });
});
