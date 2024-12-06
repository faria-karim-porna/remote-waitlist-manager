import React, { useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { joinUser } from "./core/redux/apiSlices/userApiSlice";
import { UserAction } from "./core/redux/slices/userSlice";
import { setUserInLocalStorage } from "./storages/localStorage";
import { useAppDispatch } from "./core/redux/store";

const FormSectionComponent = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState<string>("");
  const canSubmit = () => {
    return name && partySize;
  };
  const handleJoin = () => {
    dispatch(joinUser({ name: name, partySize: Number(partySize) }))
      .then(unwrapResult)
      .then((response) => {
        if (response) {
          dispatch(UserAction.setUserInfo(response));
          setUserInLocalStorage(name);
        }
      })
      .catch((error) => {
        if (error) {
          dispatch(UserAction.setErrorMessage("Username already exist. Please choose a different one."));
        }
      });
  };
  return (
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
          placeholder="Party size (should be between 1-10)"
          value={partySize}
          onChange={(e) => {
            const value = e.target.value;
            if ((value === "" || /^[0-9]+$/.test(value)) && (value === "" || (parseInt(value, 10) <= 10 && parseInt(value, 10) >= 1))) {
              setPartySize(value);
            } else {
              setPartySize(value.slice(0, -1));
            }
          }}
          className="waitlist-form-input"
        />
      </div>
      <button onClick={() => handleJoin()} className="square-button" disabled={!canSubmit()}>
        Submit
      </button>
    </div>
  );
};

export const FormSection = React.memo(FormSectionComponent);
