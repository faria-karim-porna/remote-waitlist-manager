import React from "react";
import { DiningSvg } from "../../assets/svg/diningSvg";
import { useAppSelector } from "../core/redux/store";
import { shallowEqual } from "react-redux";
import { BackgroundContainer } from "../common/backgroundContainer";
import { TextSection } from "../textSection";
import { CheckInSection } from "../checkInSection";
import { WaitingSection } from "../waitingSection";

const WaitListViewComponent = () => {
  const store = useAppSelector(
    (state) => ({
      user: state.user.userInfo,
    }),
    shallowEqual
  );

  return (
    <BackgroundContainer gradientColor={"280deg, #68007a 6%, #1f053d 84%"}>
      <div className="d-flex w-100 justify-content-center h-100 align-items-center">
        <div className="wait-list-view-main">
          <div className="position-relative">
            <DiningSvg />
            <div className="overlay d-flex justify-content-center align-items-center text-center">
              <TextSection titles={store.user?.canCheckIn ? ["Please!! check in"] : ["All seats are booked"]} />
            </div>
          </div>
          <div className="bg-white d-flex w-100 justify-content-center waitlist-view-main">
            <div className="wait-list-view-info-area text-center">
              {store.user?.canCheckIn ? (
                <CheckInSection name={store.user.name} />
              ) : (
                <WaitingSection waitingPosition={store.user?.waitingPosition} />
              )}
            </div>
          </div>
        </div>
      </div>
    </BackgroundContainer>
  );
};

export const WaitListView = React.memo(WaitListViewComponent);
