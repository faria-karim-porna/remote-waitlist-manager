import React, { useEffect, useState } from "react";
import axios from "axios";

interface Party {
  _id: string;
  name: string;
  size: number;
}

const Waitlist: React.FC = () => {
  const [waitlist, setWaitlist] = useState<Party[]>([]);

  useEffect(() => {
    axios.get<Party[]>("http://localhost:5000/api/waitlist").then((res) => setWaitlist(res.data));
  }, []);

  const checkIn = (id: string) => {
    axios.post(`http://localhost:5000/api/waitlist/checkin/${id}`).then(() => {
      setWaitlist(waitlist.filter((party) => party._id !== id));
    });
  };

  return (
    <div>
      <h1>Waitlist</h1>
      <ul>
        {waitlist.map((party) => (
          <li key={party._id}>
            {party.name} - {party.size} people
            <button onClick={() => checkIn(party._id)}>Check-In</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Waitlist;
