import { render, screen } from "@testing-library/react";
import { Views } from "../components/views/views";
import { useAppSelector } from "../components/core/redux/store";
import { EnumStatus } from "../components/core/dataTypes/enums/userEnum";

const mockDispatch = jest.fn();

jest.mock("../components/core/redux/store", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: jest.fn(),
}));

jest.mock("../components/views/loadingView", () => ({
  LoadingView: jest.fn(() => <div data-testid="loading-view">Loading View</div>),
}));
jest.mock("../components/views/formView", () => ({
  FormView: jest.fn(() => <div data-testid="form-view">Form View</div>),
}));
jest.mock("../components/views/waitListView", () => ({
  WaitListView: jest.fn(() => <div data-testid="waitlist-view">WaitList View</div>),
}));
jest.mock("../components/views/dineInView", () => ({
  DineInView: jest.fn(() => <div data-testid="dinein-view">DineIn View</div>),
}));
jest.mock("../components/views/rejoinView", () => ({
  RejoinView: jest.fn(() => <div data-testid="rejoin-view">Rejoin View</div>),
}));

describe("ViewsComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders LoadingView when isBusy is true", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      isBusy: true,
      user: null,
    });

    render(<Views />);

    expect(screen.getByTestId("loading-view")).toBeInTheDocument();
  });

  it("renders FormView when user name is not present", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      isBusy: false,
      user: null,
    });

    render(<Views />);

    expect(screen.getByTestId("form-view")).toBeInTheDocument();
  });

  it("renders WaitListView when user status is InWaitingList", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      isBusy: false,
      user: { name: "John Doe", status: EnumStatus.InWaitingList },
    });

    render(<Views />);

    expect(screen.getByTestId("waitlist-view")).toBeInTheDocument();
  });

  it("renders DineInView when user status is SeatIn", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      isBusy: false,
      user: { name: "John Doe", status: EnumStatus.SeatIn },
    });

    render(<Views />);

    expect(screen.getByTestId("dinein-view")).toBeInTheDocument();
  });

  it("renders RejoinView when user status is ServiceCompleted", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      isBusy: false,
      user: { name: "John Doe", status: EnumStatus.ServiceCompleted },
    });

    render(<Views />);

    expect(screen.getByTestId("rejoin-view")).toBeInTheDocument();
  });

  it("renders null when no conditions are met", () => {
    (useAppSelector as jest.Mock).mockReturnValue({
      isBusy: false,
      user: { name: "John Doe", status: null },
    });

    render(<Views />);

    expect(screen.queryByTestId("loading-view")).not.toBeInTheDocument();
    expect(screen.queryByTestId("form-view")).not.toBeInTheDocument();
    expect(screen.queryByTestId("waitlist-view")).not.toBeInTheDocument();
    expect(screen.queryByTestId("dinein-view")).not.toBeInTheDocument();
    expect(screen.queryByTestId("rejoin-view")).not.toBeInTheDocument();
  });
});
