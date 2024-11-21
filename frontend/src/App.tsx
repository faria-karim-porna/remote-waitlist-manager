import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Waitlist from "./Waitlist.tsx";
import JoinWaitlist from "./JoinWaitlist.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JoinWaitlist />} />
        <Route path="/waitlist" element={<Waitlist />} />
      </Routes>
    </Router>
  );
};

export default App;
