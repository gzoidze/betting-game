import {
  Dispatch,
  FC,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import styles from "./BettingSpot.module.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Phase } from "../types";
import {
  receiveBets,
  receivePreviousFieldState,
  selectBalance,
  selectBets,
  selectBettingGamePhase,
  selectBettingSettings,
} from "../bettingFieldSlice";

import { DEFAULT_FIELD_LEVEL } from "../consts";
import { calculateTotalBets } from "../utils";

interface Props {
  setTotalBets: Dispatch<SetStateAction<number>>;
  currentBalance: number;
  setCurrentBalance: Dispatch<SetStateAction<number>>;
  betSpot: string;
  betSpotValue: string;
  webSocket: WebSocket;
  fieldLevel: string;
}

export const BettingSpot: FC<Props> = ({
  setTotalBets,
  currentBalance,
  setCurrentBalance,
  betSpot,
  betSpotValue,
  webSocket,
  fieldLevel,
}) => {
  const [betValue, setBetValue] = useState(betSpotValue);
  const { payload: gamePhasePayload } = useAppSelector(selectBettingGamePhase);
  const { payload: settingsPayload } = useAppSelector(selectBettingSettings);
  const { betLimits } = settingsPayload;
  const initialBalance = useAppSelector(selectBalance);
  const bets = useAppSelector(selectBets);
  const dispatch = useAppDispatch();

  const bettingSportClass =
    fieldLevel === DEFAULT_FIELD_LEVEL
      ? styles.bettingSpot5
      : styles.bettingSpot10;

  useEffect(() => {
    setBetValue(betSpotValue);
  }, [betSpotValue]);

  const handleInputChange = (e: SyntheticEvent) => {
    const value = Number((e.target as HTMLInputElement).value);
    const changedBetSportIndex = bets.findIndex(
      (bet) => Object.keys(bet).join("") === betSpot
    );
    const betsCopy = [...bets];

    if (value > currentBalance) {
      betsCopy[changedBetSportIndex] = {
        [betSpot]: "",
      };

      window.alert(`You dont have enough balance to make such bet.`);
      dispatch(receiveBets(betsCopy));
      return;
    } else if (value < betLimits.min) {
      betsCopy[changedBetSportIndex] = {
        [betSpot]: `${betLimits.min}`,
      };
      dispatch(receiveBets(betsCopy));
      return;
    }

    betsCopy[changedBetSportIndex] = {
      [betSpot]: `${value}`,
    };

    dispatch(receivePreviousFieldState(bets));
    dispatch(receiveBets(betsCopy));

    webSocket.send(
      JSON.stringify({
        type: "placeBet",
        action: {
          [betSpot]: value,
        },
      })
    );
  };

  const handleInputBlur = () => {
    const total = calculateTotalBets(bets);
    if (total > initialBalance) return;

    setTotalBets(total);
    setCurrentBalance(initialBalance - total);
  };

  return (
    <div className={`${styles.bettingSpot}  ${bettingSportClass}`}>
      <input
        className={styles.bettingSpotInput}
        value={betValue}
        onChange={(e) => handleInputChange(e)}
        onBlur={handleInputBlur}
        min={betLimits.min}
        max={betLimits.max}
        placeholder={betSpot}
        type="number"
        disabled={gamePhasePayload.phase !== Phase.BetsOpen}
      />
    </div>
  );
};
