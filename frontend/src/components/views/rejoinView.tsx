import React from "react";
import bgPhoto from "../../assets/images/rejoinBg.jpg";
import { BgImageContainer } from "../common/bgImageContainer";
import { Header } from "../common/header";
import { clearSessionStorage } from "../storages/localStorage";
import { useAppDispatch, useAppSelector } from "../core/redux/store";
import { shallowEqual } from "react-redux";
import { UserAction } from "../core/redux/slices/userSlice";
import { deleteUser } from "../core/redux/apiSlices/userApiSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const RejoinViewComponent = () => {
  const dispatch = useAppDispatch();
  const store = useAppSelector(
    (state) => ({
      isBusy: state.userApi.userFetch.isBusy,
      user: state.user.userInfo,
    }),
    shallowEqual
  );
  const handleJoinAgain = (name: string) => {
    dispatch(deleteUser(name))
      .then(unwrapResult)
      .then((response) => {
        if (response) {
          clearSessionStorage();
          dispatch(UserAction.removeUserInfo());
        }
      });
  };
  return (
    <BgImageContainer imageURL={bgPhoto}>
      <Header />
      <div className="w-100 d-flex justify-content-center h-100">
        <div className="w-75 h-100">
          <div className="w-40 dine-in-view-main">
            <div className="dine-in-view-title">Thank you for dining with us!!</div>
            <div className="dine-in-view-subtitle my-4">
              We truly appreciate you choosing our restaurant, and we hope your meal was as memorable as it was delicious. It was a pleasure
              having you here, and we look forward to welcoming you back for another unforgettable experience.
            </div>
            <div className="dine-in-view-subtitle">
              Would you like to join us again for another delicious meal? Simply click the button below to rejoin, and we’ll be happy to
              reserve your spot!
            </div>
            <div className="d-flex">
              <button onClick={() => handleJoinAgain(store.user?.name ?? "")} className="oval-button">
                Join with us again
              </button>
            </div>
          </div>
        </div>
      </div>
    </BgImageContainer>
  );
};

export const RejoinView = React.memo(RejoinViewComponent);
