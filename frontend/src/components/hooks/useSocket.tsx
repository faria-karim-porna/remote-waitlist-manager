import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../core/redux/store";
import { shallowEqual } from "react-redux";
import { User } from "../core/dataTypes/types/userType";
import { UserAction } from "../core/redux/slices/userSlice";

export const useSocket = () => {
  const dispatch = useAppDispatch();
  const store = useAppSelector(
    (state) => ({
      isBusy: state.userApi.userFetch.isBusy,
      user: state.user.userInfo,
    }),
    shallowEqual
  );
  const [isSocketReady, setIsSocketReady] = useState(false);
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    if (store.user?.name) {
      newSocket.on("notification", (data: User) => {
        setIsSocketReady(true);
        dispatch(UserAction.setUserInfo({ ...store.user, ...data }));
      });

      if (newSocket) {
        newSocket.emit("join", store.user.name);
      }
    }

    return () => {
      if (isSocketReady) {
        setIsSocketReady(false);
        newSocket.close();
      }
    };
  }, [store.user]);
};
