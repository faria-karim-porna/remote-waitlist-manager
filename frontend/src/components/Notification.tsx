import React from "react";
import { useWaitlist } from "../contexts/WaitlistContext";

const Notification: React.FC = () => {
  const { message } = useWaitlist();

  return message ? (
    <div className="notification">
      <p>{message}</p>
    </div>
  ) : null;
};

export default Notification;
