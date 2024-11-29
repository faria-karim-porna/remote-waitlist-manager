import React, { useState } from "react";
import { setUserInSessionStorage } from "../storages/localStorage";
import { UserAction } from "../core/redux/slices/userSlice";
import { useAppDispatch } from "../core/redux/store";

const WaitListFormViewComponent = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState(1);
  const handleJoin = () => {
    fetch("http://localhost:5000/api/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, partySize }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          dispatch(UserAction.setUserInfo(data.user));
          setUserInSessionStorage(name);
        }
      });
  };
  return (
    <>
      <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="number" min="1" placeholder="Party size" value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} />
      <button onClick={() => handleJoin()}>Submit</button>
    </>
  );
};

export const WaitListFormView = React.memo(WaitListFormViewComponent);
