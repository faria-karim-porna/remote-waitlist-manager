import React, { createContext, useState, useContext, ReactNode } from "react";

type Party = {
  _id: string;
  name: string;
  size: number;
};

type WaitlistContextType = {
  waitlist: Party[];
  message: string;
  addToWaitlist: (party: Party) => void;
  updateMessage: (msg: string) => void;
};

type WaitlistProviderProps = {
  children: ReactNode;
};

const WaitlistContext = createContext<WaitlistContextType | undefined>(undefined);

export const WaitlistProvider: React.FC<WaitlistProviderProps> = ({ children }) => {
  const [waitlist, setWaitlist] = useState<Party[]>([]);
  const [message, setMessage] = useState<string>("");

  const addToWaitlist = (party: Party) => {
    setWaitlist((prevWaitlist) => [...prevWaitlist, party]);
  };

  const updateMessage = (msg: string) => {
    setMessage(msg);
  };

  return <WaitlistContext.Provider value={{ waitlist, message, addToWaitlist, updateMessage }}>{children}</WaitlistContext.Provider>;
};

export const useWaitlist = (): WaitlistContextType => {
  const context = useContext(WaitlistContext);
  if (!context) {
    throw new Error("useWaitlist must be used within a WaitlistProvider");
  }
  return context;
};
