import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WaitlistProvider } from "./contexts/WaitlistContext";
import HomePage from "./pages/HomePage";
import QueuePage from "./pages/QueuePage";

const App: React.FC = () => {
  return (
    <WaitlistProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/queue" element={<QueuePage />} />
        </Routes>
      </Router>
    </WaitlistProvider>
  );
};

export default App;
