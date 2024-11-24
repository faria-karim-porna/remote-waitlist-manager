import axios from "axios";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

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

  const clearLocalStorage = () => {
    localStorage.clear();
  };

  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [user, setUser] = useState<User>({});
  const [isSocketReady, setIsSocketReady] = useState(false);

  const fetchUser = async (userName: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/${userName}`);
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
          setUserInLocalStorage(name);
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
          clearLocalStorage();
          setUser({});
        }
      });
  };
  return (
    <div style={{ padding: "20px" }}>
      <h1>Restaurant Waitlist</h1>
      {!user.name ? (
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
