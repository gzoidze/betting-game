interface BettingFieldSettingPayload {
  betLimits: {
    min: number;
    max: number;
  };
}

export enum Phase {
  BetsOpen = "BetsOpen",
  BetsClosed = "BetsClosed",
  result = "GameResult",
}

export interface BettingFieldBetsPayload {
  phase: Phase;
  balance: number;
}

export interface BettingFiledSettings {
  type: string;
  payload: BettingFieldSettingPayload;
  chips: number[];
}

export interface BettingFieldBetPhase {
  type: string;
  payload: BettingFieldBetsPayload;
}

export interface BettingFieldResultPayload {
  phase: Phase;
  balance: number;
  multipliers: BetSpot;
  payout: number;
}

export interface BettingFieldResultPhase {
  type: string;
  payload: BettingFieldResultPayload;
}

export interface BetSpot {
  [x: string]: string | number;
}
