import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { EnumStatus } from "./components/core/dataTypes/enums/userEnum";
import { User } from "./components/core/dataTypes/types/userType";
import { useAppDispatch, useAppSelector } from "./components/core/redux/store";
import { fetchUser } from "./components/core/redux/apiSlices/userApiSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { shallowEqual } from "react-redux";
import { FormView } from "./components/views/formView";
import { clearSessionStorage, getUserFromSessionStorage } from "./components/storages/localStorage";
import { UserAction } from "./components/core/redux/slices/userSlice";
import { Header } from "./components/common/header";
import { DineInView } from "./components/views/dineInView";
import { RejoinView } from "./components/views/rejoinView";
import { WaitListView } from "./components/views/waitListView";
import { useSocket } from "./components/hooks/useSocket";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const store = useAppSelector(
    (state) => ({
      isBusy: state.userApi.userFetch.isBusy,
      user: state.user.userInfo,
    }),
    shallowEqual
  );

  useSocket();

  useEffect(() => {
    const userName = getUserFromSessionStorage();
    dispatch(fetchUser(userName))
      .then(unwrapResult)
      .then((response) => dispatch(UserAction.setUserInfo(response.data.user)));
  }, []);

  return (
    <div>
      {/* <Header /> */}
      {/* {store.isBusy ? (
        <div>Loading...</div>
      ) : !store.user?.name ? (
        <WaitListFormView />
      ) : store.user?.status === EnumStatus.InWaitingList && store.user?.canCheckIn ? (
        <button onClick={() => handleCheckIn(store.user?.name ?? "")}>Check In</button>
      ) : store.user?.status === EnumStatus.InWaitingList ? (
        <div>Your waiting position is {store.user?.waitingPosition}</div>
      ) : store.user?.status === EnumStatus.SeatIn ? (
        <div>Enjoy Your Service</div>
      ) : store.user?.status === EnumStatus.ServiceCompleted ? (
        <div>
          <div>Thank You For Coming</div>
          <button onClick={() => handleJoinAgain(store.user?.name ?? "")}>Join Again</button>
        </div>
      ) : null} */}
      <Header />
      <FormView />
      {/* <DineInView /> */}
      {/* <RejoinView /> */}
      {/* <WaitListView /> */}
    </div>
  );
};

export default App;
