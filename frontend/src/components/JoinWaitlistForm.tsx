import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Updated import
import { useWaitlist } from "../contexts/WaitlistContext";
import { joinWaitlist } from "../api/waitlistApi";

const JoinWaitlistForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [size, setSize] = useState<number>(1);
  const navigate = useNavigate(); // Updated hook
  const { addToWaitlist } = useWaitlist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const party = await joinWaitlist(name, size);
      addToWaitlist(party);
      navigate("/queue"); // Updated navigation
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="form-container">
      <h1>Join the Waitlist</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="number" placeholder="Party size" value={size} onChange={(e) => setSize(Number(e.target.value))} min="1" required />
        <button type="submit">Join Waitlist</button>
      </form>
    </div>
  );
};

export default JoinWaitlistForm;
