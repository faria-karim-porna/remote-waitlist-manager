import React, { useEffect } from "react";
import { useAppDispatch } from "./components/core/redux/store";
import { fetchUser } from "./components/core/redux/apiSlices/userApiSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { getUserFromLocalStorage } from "./components/storages/localStorage";
import { UserAction } from "./components/core/redux/slices/userSlice";
import { Header } from "./components/common/header";
import { useSocket } from "./components/hooks/useSocket";
import { Views } from "./components/views/views";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  useSocket();
  const userName = getUserFromLocalStorage();
  useEffect(() => {
    dispatch(fetchUser(userName ?? ""))
      .then(unwrapResult)
      .then((response) => {
        if (response) {
          dispatch(UserAction.setUserInfo(response));
        }
      });
  }, []);

  return (
    <div>
      <Header />
      <Views />
    </div>
  );
};

export default App;
