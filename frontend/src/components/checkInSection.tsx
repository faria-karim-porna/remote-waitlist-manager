import React from "react";
import { useAppDispatch } from "./core/redux/store";
import { checkInUser } from "./core/redux/apiSlices/userApiSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { UserAction } from "./core/redux/slices/userSlice";
import { FoodSvg } from "../assets/svg/foodSvg";

type CheckInSectionProps = {
  name?: string;
};

const CheckInSectionComponent = (props: CheckInSectionProps) => {
  const { name } = props;
  const dispatch = useAppDispatch();

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
    <div>
      <div className="font-25 font-primary font-weight-500">Your table is just a check-in away. Tap to get started!</div>
      <div>
        <div>
          <div className="d-flex justify-content-center">
            <FoodSvg />
          </div>
          <div>
            <button onClick={() => handleCheckIn(name ?? "")} className="square-button">
              Check in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CheckInSection = React.memo(CheckInSectionComponent);
