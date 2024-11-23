import axios from "axios";
import React, { useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

// const socket: Socket = io("http://localhost:5000", { withCredentials: true });
enum EnumStatus {
  None = "None",
  SeatIn = "Seat In",
  InWaitingList = "In Waiting List",
  ServiceCompleted = "Service Completed",
}

type User = {
  name?: string;
  partySize?: number;
  status?: EnumStatus;
  canCheckIn?: boolean;
  waitingPosition?: number;
};

const App: React.FC = () => {
  const setUserInLocalStorage = (name: string) => {
    localStorage.setItem("user", name);
  };
  const getUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user") ?? "";
    return storedUser;
  };
  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [user, setUser] = useState<User>({});
  const fetchUser = async (userName: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/${userName}`);
      console.log(response.data.user);
      setUser(response.data.user);
    } catch {
      setUser({});
    }
  };

  useEffect(() => {
    const userName = getUserFromLocalStorage();
    fetchUser(userName);
  }, []);

  useEffect(() => {
    // join the socket room using username
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
          setUserInLocalStorage(name);
        }
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Restaurant Waitlist</h1>
      {!getUserFromLocalStorage() ? (
        <>
          <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="number" min="1" placeholder="Party size" value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} />
          <button onClick={() => handleJoin()}>Submit</button>
        </>
      ) : user.canCheckIn ? (
        <button onClick={() => handleJoin()}>Check In</button>
      ) : user.status === EnumStatus.InWaitingList ? (
        <div>Your waiting position is {user?.waitingPosition}</div>
      ) : user.status === EnumStatus.SeatIn ? (
        <div>Enjoy Your Service</div>
      ) : user.status === EnumStatus.ServiceCompleted ? (
        <div>Thank You For Coming</div>
      ) : null}
    </div>
  );
};

export default App;
