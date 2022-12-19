import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import bettingFiledReducer from "../features/bettingField/bettingFieldSlice";

export const store = configureStore({
  reducer: {
    bettingField: bettingFiledReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
