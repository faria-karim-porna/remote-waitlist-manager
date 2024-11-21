import React, { useState } from "react";
import axios from "axios";

const JoinWaitlist: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [size, setSize] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/waitlist/join", { name, size }).then(() => {
      setName("");
      setSize(1);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="number" min="1" value={size} onChange={(e) => setSize(Number(e.target.value))} />
      <button type="submit">Join Waitlist</button>
    </form>
  );
};

export default JoinWaitlist;
