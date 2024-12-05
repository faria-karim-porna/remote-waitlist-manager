import { render, screen } from "@testing-library/react";
import { RejoinView } from "../components/views/rejoinView";
import bgPhoto from "../assets/images/rejoinBg.jpg";
import { BackgroundContainer } from "../components/common/backgroundContainer";
import { AppStore } from "../components/core/redux/store";
import { UserAction } from "../components/core/redux/slices/userSlice";
import { EnumStatus } from "../components/core/dataTypes/enums/userEnum";
import { Provider } from "react-redux";

jest.mock("../components/common/backgroundContainer", () => ({
  BackgroundContainer: jest.fn(({ children }) => <div data-testid="background-container">{children}</div>),
}));

describe("RejoinView Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders BackgroundContainer with the correct image", () => {
    AppStore.dispatch(
      UserAction.setUserInfo({ name: "John Doe", canCheckIn: true, waitingPosition: 3, status: EnumStatus.ServiceCompleted })
    );
    render(
      <Provider store={AppStore}>
        <RejoinView />
      </Provider>
    );
    const backgroundContainer = screen.getByTestId("background-container");
    expect(BackgroundContainer).toHaveBeenCalledWith(expect.objectContaining({ imageURL: bgPhoto }), expect.anything());
    expect(backgroundContainer).toBeInTheDocument();
  });
});
