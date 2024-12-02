import React, { useEffect } from "react";
import { EnumStatus } from "./components/core/dataTypes/enums/userEnum";
import { useAppDispatch, useAppSelector } from "./components/core/redux/store";
import { fetchUser } from "./components/core/redux/apiSlices/userApiSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { shallowEqual } from "react-redux";
import { FormView } from "./components/views/formView";
import { getUserFromSessionStorage } from "./components/storages/localStorage";
import { UserAction } from "./components/core/redux/slices/userSlice";
import { Header } from "./components/common/header";
import { DineInView } from "./components/views/dineInView";
import { RejoinView } from "./components/views/rejoinView";
import { WaitListView } from "./components/views/waitListView";
import { useSocket } from "./components/hooks/useSocket";
import { LoadingView } from "./components/views/loadingView";

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
    if (userName) {
      dispatch(fetchUser(userName))
        .then(unwrapResult)
        .then((response) => dispatch(UserAction.setUserInfo(response.data.user)));
    }
  }, []);

  return (
    <div>
      <Header />
      {store.isBusy ? (
        <LoadingView />
      ) : !store.user?.name ? (
        <FormView />
      ) : store.user?.status === EnumStatus.InWaitingList ? (
        <WaitListView />
      ) : store.user?.status === EnumStatus.SeatIn ? (
        <DineInView />
      ) : store.user?.status === EnumStatus.ServiceCompleted ? (
        <RejoinView />
      ) : null}
    </div>
  );
};

export default App;
