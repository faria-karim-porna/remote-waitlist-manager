import { AnyAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import { createSelectorHook, TypedUseSelectorHook, useDispatch } from "react-redux";
import { UserReducer } from "./slices/userSlice";
import { UserApiReducer } from "./apiSlices/userApiSlice";

export const RootReducer = combineReducers({
  user: UserReducer,
  userApi: UserApiReducer,
});

const ActionAppTypeResetStore = "RESET_APP_REDUX_STORE";

export const ActionApp = {
  ResetStore: (): AnyAction => ({ type: ActionAppTypeResetStore }),
};

const AppReducer: (...param: Parameters<typeof RootReducer>) => ReturnType<typeof RootReducer> = (state, action) => {
  if (action.type === ActionAppTypeResetStore) {
    state = undefined;
  }
  return RootReducer(state, action);
};

export const AppStore = configureStore({
  reducer: AppReducer as typeof RootReducer,
  // Enalbe Dev Tools only on development environment
  // devTools: process.env.NODE_ENV === "development",
});

export type WaitingListAppState = ReturnType<typeof RootReducer>;
export type WaitingListAppDispatch = typeof AppStore.dispatch;
export const useAppDispatch = () => useDispatch<WaitingListAppDispatch>();
export const useAppSelector = createSelectorHook() as TypedUseSelectorHook<WaitingListAppState>;
