import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { AppStore } from "../components/core/redux/store";
import { UserAction } from "../components/core/redux/slices/userSlice";
import { WaitListView } from "../components/views/waitListView";
import { EnumStatus } from "../components/core/dataTypes/enums/userEnum";

describe("WaitListView Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the waitlist view when check-in is not available", () => {
    AppStore.dispatch(
      UserAction.setUserInfo({ name: "John Doe", canCheckIn: false, waitingPosition: 3, status: EnumStatus.InWaitingList })
    );
    render(
      <Provider store={AppStore}>
        <WaitListView />
      </Provider>
    );

    expect(screen.getByText("Thank you for choosing us – we'll seat you soon!")).toBeInTheDocument();
    expect(screen.getByText("You're", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("#3", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("on the waitlist. Please wait.", { exact: false })).toBeInTheDocument();
  });

  test("renders the waitlist view when check-in is not available", async () => {
    AppStore.dispatch(UserAction.setUserInfo({ name: "John Doe", canCheckIn: true, waitingPosition: 3, status: EnumStatus.InWaitingList }));
    render(
      <Provider store={AppStore}>
        <WaitListView />
      </Provider>
    );

    const button = screen.getByRole("button", { name: "Check in" });
    expect(button).toBeInTheDocument();
  });
});
