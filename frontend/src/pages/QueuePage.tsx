import React, { useState, useEffect } from "react";
import { useWaitlist } from "../contexts/WaitlistContext";
import PartyList from "../components/PartyList";
import Notification from "../components/Notification";
import useWebSocket from "../hooks/useWebSocket";

interface Party {
  _id: string;
  name: string;
  size: number;
  status: string;
}

const QueuePage: React.FC = () => {
  const { waitlist } = useWaitlist(); // waitlist should have a type
  const [partyId, setPartyId] = useState<string | null>(null);

  // Set the current party ID (this should come from the context or API after joining)
  useEffect(() => {
    if (waitlist.length > 0) {
      const lastParty = waitlist[waitlist.length - 1] as Party;
      setPartyId(lastParty._id);
    }
  }, [waitlist]);

  useWebSocket(partyId);

  return (
    <div className="queue-page">
      <PartyList />
      <Notification />
    </div>
  );
};

export default QueuePage;
