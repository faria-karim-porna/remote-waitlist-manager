// src/App.tsx
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:5000"); // Replace with your backend server URL

const App: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Listen for 'message' events from the server
    socket.on("message", (message: string) => {
      console.log("message", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Messages from Server</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
