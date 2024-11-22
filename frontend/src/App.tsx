import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

const socket: Socket = io("http://localhost:5000", { withCredentials: true });

const App: React.FC = () => {
  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [queue, setQueue] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [readyState, setReadyState] = useState(false);

  useEffect(() => {
    socket.on("queueStatus", (newQueue: any) => {
      setReadyState(true);
      setQueue(newQueue);
    });

    return () => {
      if (readyState) {
        setReadyState(false);
        socket.disconnect();
      }
    };
  }, []);

  const handleJoin = () => {
    axios.post("http://localhost:5000/join", { name, partySize }).then(() => {
      setName("");
      setPartySize(1);
    });
    // const response = await fetch("http://localhost:5000/join", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ name, partySize }),
    // });

    // if (response.ok) {
    //   setStatus("Successfully joined the waitlist");
    // } else {
    //   setStatus("Failed to join the waitlist");
    // }
  };

  const handleCheckIn = async (id: string) => {
    const response = await fetch("http://localhost:5000/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setStatus("Checked in successfully");
    } else {
      setStatus("Failed to check in");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Restaurant Waitlist</h1>
      <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="number" min="1" placeholder="Party size" value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} />
      <button onClick={() => handleJoin()}>Join Waitlist</button>

      <h2>Status: {status}</h2>

      <h3>Current Queue</h3>
      <ul>
        {queue.map((entry) => (
          <li key={entry._id}>
            {entry.name} (Party size: {entry.partySize})
            {!entry.checkedIn && <button onClick={() => handleCheckIn(entry._id)}>Check In</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
