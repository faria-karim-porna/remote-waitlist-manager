import React from "react";
import { Header } from "../common/header";
import { DiningSvg } from "../../assets/svg/diningSvg";
import { UserSvg } from "../../assets/svg/userSvg";
import { FoodSvg } from "../../assets/svg/foodSvg";
import { useAppDispatch, useAppSelector } from "../core/redux/store";
import { shallowEqual } from "react-redux";
import { checkInUser } from "../core/redux/apiSlices/userApiSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { UserAction } from "../core/redux/slices/userSlice";

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
          // dispatch(UserAction.setUserInfo(data.user));
        }
      });
  };
  return (
    <div className="waitlist-view">
      <Header />
      <div className="d-flex w-100 justify-content-center h-100 align-items-center">
        <div className="w-50 ">
          <div className="position-relative">
            <DiningSvg />
            <div className="overlay d-flex justify-content-center align-items-center">
              <div className="dine-in-view-title">{store.user?.canCheckIn ? "Please!! check in" : "All seats are booked"}</div>
            </div>
          </div>
          <div className="bg-white d-flex w-100 justify-content-center waitlist-view-main">
            <div className="d-flex w-80 align-items-center">
              <div className="w-50 wait-list-view-subtitle">
                {store.user?.canCheckIn
                  ? "Your table is just a check-in away. Tap to get started!"
                  : "Thank you for choosing us – we'll seat you soon!"}
              </div>
              <div className="w-50">
                {store.user?.canCheckIn ? (
                  <div>
                    <FoodSvg />
                    <div>
                      <button onClick={() => handleCheckIn(store.user?.name ?? "")} className="square-button">
                        Submit
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
                      You're <span className="style-text">#{store.user?.waitingPosition}</span> on the waitlist. Please wait.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WaitListView = React.memo(WaitListViewComponent);
