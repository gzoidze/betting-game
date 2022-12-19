import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  BetSpot,
  BettingFieldBetPhase,
  BettingFieldResultPhase,
  BettingFiledSettings,
  Phase,
} from "./types";

export interface bettingFieldState {
  bettingSettings: BettingFiledSettings;
  bettingGamePhase: BettingFieldBetPhase;
  bettingResultPhase: BettingFieldResultPhase;
  bets: BetSpot[];
  previousBets: BetSpot[];
  previousFieldState: BetSpot[];
}

const initialState: bettingFieldState = {
  bettingSettings: {
    type: "settings",
    payload: {
      betLimits: { min: 0, max: 0 },
    },
    chips: [],
  },
  bettingGamePhase: {
    type: "game",
    payload: {
      balance: 0,
      phase: Phase.BetsOpen,
    },
  },
  bettingResultPhase: {
    type: "game",
    payload: {
      balance: 0,
      phase: Phase.result,
      multipliers: {},
      payout: 0,
    },
  },
  bets: [],
  previousBets: [],
  previousFieldState: [],
};

const bettingFieldSlice = createSlice({
  name: "bettingField",
  initialState,
  reducers: {
    receiveBettingSettings(state, action: PayloadAction<BettingFiledSettings>) {
      state.bettingSettings = action.payload;
    },
    receiveBettingGamePhase(
      state,
      action: PayloadAction<BettingFieldBetPhase>
    ) {
      state.bettingGamePhase = action.payload;
    },
    receiveBettingResultPhase(
      state,
      action: PayloadAction<BettingFieldResultPhase>
    ) {
      state.bettingResultPhase = action.payload;
    },
    receiveBets(state, action: PayloadAction<BetSpot[]>) {
      state.bets = action.payload;
    },
    receivePreviousBets(state, action: PayloadAction<BetSpot[]>) {
      state.previousBets = action.payload;
    },
    receivePreviousFieldState(state, action: PayloadAction<BetSpot[]>) {
      state.previousFieldState = action.payload;
    },
  },
});

export const {
  receiveBettingSettings,
  receiveBettingGamePhase,
  receiveBettingResultPhase,
  receiveBets,
  receivePreviousBets,
  receivePreviousFieldState,
} = bettingFieldSlice.actions;
export const selectBalance = (state: RootState) =>
  state.bettingField.bettingGamePhase.payload.balance;
export const selectBettingSettings = (state: RootState) =>
  state.bettingField.bettingSettings;
export const selectBettingGamePhase = (state: RootState) =>
  state.bettingField.bettingGamePhase;
export const selectBettingResultPhase = (state: RootState) =>
  state.bettingField.bettingResultPhase;
export const selectBets = (state: RootState) => state.bettingField.bets;
export const selectPreviousBets = (state: RootState) =>
  state.bettingField.previousBets;
export const selectPreviousFieldState = (state: RootState) =>
  state.bettingField.previousFieldState;

export default bettingFieldSlice.reducer;
