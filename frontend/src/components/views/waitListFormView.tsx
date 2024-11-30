import React, { useState } from "react";
import { setUserInSessionStorage } from "../storages/localStorage";
import { UserAction } from "../core/redux/slices/userSlice";
import { useAppDispatch } from "../core/redux/store";
import { joinUser } from "../core/redux/apiSlices/userApiSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const WaitListFormViewComponent = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState<string>("");
  const handleJoin = () => {
    dispatch(joinUser({ name: name, partySize: Number(partySize) }))
      .then(unwrapResult)
      .then((response) => {
        if (response) {
          dispatch(UserAction.setUserInfo(response));
          setUserInSessionStorage(name);
        }
      });
  };
  return (
    <div className="waitlist-form-view d-flex justify-content-center">
      <div className="w-75">
        <div className="w-50 waitlist-form-view-main">
          <div>
            <div className="wait-list-form-title">Book amazing restaurants</div>
            <div className="my-4">
              <div className="waitlist-form-subtitle">
                From local favorites to the trending restaurants, enjoy without the wait. Discover popular restaurants where you can skip
                the wait by booking through TableCheck.
              </div>
            </div>
          </div>
          <div className="waitlist-form">
            <div>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="waitlist-form-input"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Party size"
                value={partySize}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^[0-9]+$/.test(value)) {
                    setPartySize(value);
                  }
                }}
                className="waitlist-form-input"
              />
            </div>
            <button onClick={() => handleJoin()} className="square-button">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WaitListFormView = React.memo(WaitListFormViewComponent);
