import React from "react";
import { useAppSelector } from "../core/redux/store";
import { shallowEqual } from "react-redux";
import { LoadingView } from "./loadingView";
import { FormView } from "./formView";
import { WaitListView } from "./waitListView";
import { DineInView } from "./dineInView";
import { RejoinView } from "./rejoinView";
import { EnumStatus } from "../core/dataTypes/enums/userEnum";

const ViewsComponent = () => {
  const store = useAppSelector(
    (state) => ({
      isBusy: state.userApi.userFetch.isBusy,
      user: state.user.userInfo,
    }),
    shallowEqual
  );

  return (
    <>
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
    </>
  );
};

export const Views = React.memo(ViewsComponent);
