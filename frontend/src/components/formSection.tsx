import React, { useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { joinUser } from "./core/redux/apiSlices/userApiSlice";
import { UserAction } from "./core/redux/slices/userSlice";
import { setUserInSessionStorage } from "./storages/localStorage";
import { useAppDispatch } from "./core/redux/store";

const FormSectionComponent = () => {
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
  );
};

export const FormSection = React.memo(FormSectionComponent);
