import React, { useState } from "react";
import { setUserInSessionStorage } from "../storages/localStorage";
import { UserAction } from "../core/redux/slices/userSlice";
import { useAppDispatch } from "../core/redux/store";
import cover1 from "../../assets/images/formViewCover1.png";
import cover2 from "../../assets/images/formViewCover2.jpg";

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
    <div className="waitlist-form-view">
      <div className="d-flex justify-content-between">
        <img src={cover1} className="waitlist-form-cover-photo" />
        <div className="waitlist-form-container">
          <label>Enter Your Name</label>
          <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="number" min="1" placeholder="Party size" value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} />
          <button onClick={() => handleJoin()}>Submit</button>
        </div>
        <img src={cover2} className="waitlist-form-cover-photo" />
      </div>
    </div>
  );
};

export const WaitListFormView = React.memo(WaitListFormViewComponent);
