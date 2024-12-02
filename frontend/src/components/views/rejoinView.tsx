import React from "react";
import bgPhoto from "../../assets/images/rejoinBg.jpg";
import { BackgroundContainer } from "../common/backgroundContainer";
import { clearSessionStorage } from "../storages/localStorage";
import { useAppDispatch, useAppSelector } from "../core/redux/store";
import { shallowEqual } from "react-redux";
import { UserAction } from "../core/redux/slices/userSlice";
import { deleteUser } from "../core/redux/apiSlices/userApiSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { TextSection } from "../textSection";

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
    <BackgroundContainer imageURL={bgPhoto}>
      <div className="w-100 d-flex justify-content-center h-100">
        <div className="w-75 h-100 d-flex align-items-center">
          <div className="main-view">
            <TextSection
              titles={["Thanks for dining with us!"]}
              subTitles={[
                "Thank you for choosing our restaurant! We hope your meal was delightful and look forward to welcoming you back soon.",
                "Want to join us again for another delicious meal? Click below to rejoin, and we’ll save your spot!",
              ]}
            />
            <div className="d-flex mt-4">
              <button onClick={() => handleJoinAgain(store.user?.name ?? "")} className="oval-button">
                Join with us again
              </button>
            </div>
          </div>
        </div>
      </div>
    </BackgroundContainer>
  );
};

export const RejoinView = React.memo(RejoinViewComponent);
