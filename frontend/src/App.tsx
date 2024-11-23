import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Define the type for a notification
// interface Notification {
//   message: string; // Adjust this based on the structure of notifications
// }

const App: React.FC = () => {
  // Use a more specific type for the socket state
  const [socket, setSocket] = useState<Socket | null>(null);
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = io("http://localhost:5000"); // Replace with your server's URL
    setSocket(newSocket);

    // Listen for notifications
    newSocket.on("notification", (data: string) => {
      setNotifications((prev) => [...prev, data]);
    });

    // return () => {
    //   newSocket.close();
    // };
  }, []);

  const joinRoom = () => {
    if (name && socket) {
      socket.emit("join", name); // Join the room with the specified name
    }
  };

  const sendNotification = () => {
    if (name && message && socket) {
      socket.emit("notify", { name, message }); // Notify the room
      setMessage(""); // Clear the input
    }
  };

  return (
    <div>
      <h1>React Socket.IO Example</h1>
      <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={joinRoom}>Join</button>

      <input type="text" placeholder="Enter message" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendNotification}>Notify</button>

      <h2>Notifications:</h2>
      <ul>
        {notifications.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
