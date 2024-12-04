import React from "react";
import { DiningSvg } from "../../assets/svg/diningSvg";
import { UserSvg } from "../../assets/svg/userSvg";
import { FoodSvg } from "../../assets/svg/foodSvg";
import { useAppDispatch, useAppSelector } from "../core/redux/store";
import { shallowEqual } from "react-redux";
import { checkInUser } from "../core/redux/apiSlices/userApiSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { BackgroundContainer } from "../common/backgroundContainer";
import { UserAction } from "../core/redux/slices/userSlice";
import { TextSection } from "../textSection";

const WaitListViewComponent = () => {
  const dispatch = useAppDispatch();
  const store = useAppSelector(
    (state) => ({
      isBusy: state.userApi.userFetch.isBusy,
      user: state.user.userInfo,
    }),
    shallowEqual
  );

  const handleCheckIn = (name: string) => {
    dispatch(checkInUser(name))
      .then(unwrapResult)
      .then((response) => {
        if (response) {
          dispatch(UserAction.setUserInfo(response));
        }
      });
  };
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
              <div className="font-25 font-primary font-weight-500">
                {store.user?.canCheckIn
                  ? "Your table is just a check-in away. Tap to get started!"
                  : "Thank you for choosing us – we'll seat you soon!"}
              </div>
              <div>
                {store.user?.canCheckIn ? (
                  <div>
                    <div className="d-flex justify-content-center">
                      <FoodSvg />
                    </div>
                    <div>
                      <button onClick={() => handleCheckIn(store.user?.name ?? "")} className="square-button">
                        Check in
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <div className="d-flex align-items-center">
                      <UserSvg small={true} />
                      <UserSvg small={true} />
                      <UserSvg small={true} />
                      <UserSvg />
                      <UserSvg small={true} />
                      <UserSvg small={true} />
                      <UserSvg small={true} />
                    </div>
                    <div className="wait-list-view-small-text">
                      You're <span className="font-22 font-primary font-weight-500">#{store.user?.waitingPosition}</span> on the waitlist.
                      Please wait.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundContainer>
  );
};

export const WaitListView = React.memo(WaitListViewComponent);
