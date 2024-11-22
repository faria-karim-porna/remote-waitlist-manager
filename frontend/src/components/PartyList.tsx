import React from "react";
import { useWaitlist } from "../contexts/WaitlistContext";

const PartyList: React.FC = () => {
  const { waitlist } = useWaitlist();

  return (
    <div className="party-list">
      <h2>Current Waitlist</h2>
      <ul>
        {waitlist.map((party) => (
          <li key={party._id}>
            {party.name} - Party of {party.size}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PartyList;
