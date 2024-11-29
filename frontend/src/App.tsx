import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { EnumStatus } from "./components/core/dataTypes/enums/userEnum";
import { User } from "./components/core/dataTypes/types/userType";
import { useAppDispatch, useAppSelector } from "./components/core/redux/store";
import { fetchUser } from "./components/core/redux/apiSlices/userApiSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { shallowEqual } from "react-redux";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const store = useAppSelector(
    (state) => ({
      isBusy: state.userApi.userFetch.isBusy,
    }),
    shallowEqual
  );
  const setUserInSessionStorage = (name: string) => {
    sessionStorage.setItem("user", name);
  };
  const getUserFromSessionStorage = () => {
    const storedUser = sessionStorage.getItem("user") ?? "";
    return storedUser;
  };

  const clearSessionStorage = () => {
    sessionStorage.clear();
  };

  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [user, setUser] = useState<User>({});
  const [isSocketReady, setIsSocketReady] = useState(false);

  // const fetchUser = async (userName: string) => {
  //   try {
  //     const response = await axios.get(`http://localhost:5000/api/user/${userName}`);
  //     setUser(response.data.user);
  //   } catch {
  //     setUser({});
  //   }
  // };

  useEffect(() => {
    const userName = getUserFromSessionStorage();
    dispatch(fetchUser(userName))
      .then(unwrapResult)
      .then((response) => setUser(response.data.user));
    fetchUser(userName);
  }, []);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    if (user.name) {
      newSocket.on("notification", (data: User) => {
        setIsSocketReady(true);
        setUser({ ...user, ...data });
      });

      if (newSocket) {
        newSocket.emit("join", user.name);
      }
    }

    return () => {
      if (isSocketReady) {
        setIsSocketReady(false);
        newSocket.close();
      }
    };
  }, [user]);

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
          setUser(data.user);
          setUserInSessionStorage(name);
        }
      });
  };

  const handleCheckIn = (name: string) => {
    fetch("http://localhost:5000/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      });
  };

  const handleJoinAgain = (name: string) => {
    fetch("http://localhost:5000/api/deleteUser", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          clearSessionStorage();
          setUser({});
        }
      });
  };
  return (
    <div style={{ padding: "20px" }}>
      <h1>Restaurant Waitlist</h1>
      {store.isBusy ? (
        <div>Loading...</div>
      ) : !user.name ? (
        <>
          <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="number" min="1" placeholder="Party size" value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} />
          <button onClick={() => handleJoin()}>Submit</button>
        </>
      ) : user.status === EnumStatus.InWaitingList && user.canCheckIn ? (
        <button onClick={() => handleCheckIn(user.name ?? "")}>Check In</button>
      ) : user.status === EnumStatus.InWaitingList ? (
        <div>Your waiting position is {user?.waitingPosition}</div>
      ) : user.status === EnumStatus.SeatIn ? (
        <div>Enjoy Your Service</div>
      ) : user.status === EnumStatus.ServiceCompleted ? (
        <div>
          <div>Thank You For Coming</div>
          <button onClick={() => handleJoinAgain(user.name ?? "")}>Join Again</button>
        </div>
      ) : null}
    </div>
  );
};

export default App;
