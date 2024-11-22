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
  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState(1);
  // const [queue, setQueue] = useState<any[]>([]);

  // const [readyState, setReadyState] = useState(false);
  const [user, setUser] = useState<User>({});

  const setUserInLocalStorage = (name: string) => {
    localStorage.setItem("user", name);
  };

  const getUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user") ?? "";
    return storedUser;
  };

  useEffect(() => {
    if (getUserFromLocalStorage()) {
      // call api
      // setUser(name);
    }
  }, []);

  // useEffect(() => {
  //   socket.emit("check-seats", user);
  //   socket.on("seats-available", (data) => {
  //     if (data.message) {
  //       // setCanCheckIn(true);
  //     }
  //   });
  //   return () => {
  //     if (readyState) {
  //       setReadyState(false);
  //       socket.disconnect();
  //     }
  //   };
  // }, [user]);

  const handleJoin = () => {
    fetch("http://localhost:5000/join", {
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

  // const handleCheckIn = async (id: string) => {
  //   const response = await fetch("http://localhost:5000/checkin", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ id }),
  //   });

  //   if (response.ok) {
  //     setStatus("Checked in successfully");
  //   } else {
  //     setStatus("Failed to check in");
  //   }
  // };

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
      ) : (
        <div>Thank You For Coming</div>
      )}
    </div>
  );
};

export default App;
