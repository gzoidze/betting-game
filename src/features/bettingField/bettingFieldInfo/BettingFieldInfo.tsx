import { FC } from "react";
import {
  selectBettingResultPhase,
  selectPreviousBets,
} from "../bettingFieldSlice";
import { useAppSelector } from "../../../app/hooks";
import styles from "./BettingFieldInfo.module.css";
import { getMultipliers, getWinningBets } from "./utils";

interface Props {
  currentBalance: number;
  totalBets: number;
}

export const BettingFieldInfo: FC<Props> = ({ currentBalance, totalBets }) => {
  const previousBets = useAppSelector(selectPreviousBets);
  const { payload: resultPhasePayload } = useAppSelector(
    selectBettingResultPhase
  );
  let multipliers = getMultipliers(resultPhasePayload).map((str) => {
    let parts = str.split(": ");
    return { [parts[0]]: parts[1] };
  });
  const winningBets = getWinningBets(previousBets, multipliers);

  const showMultipliers = getMultipliers(resultPhasePayload).map(
    (val, _, arr) => {
      const betSpot = val.slice(0, 3);
      const betSpotValue = val.slice(3);

      return (
        <span key={betSpot}>
          {betSpot} {betSpotValue}
          {arr[arr.length - 1] === val ? "." : ", "}
        </span>
      );
    }
  );

  const showWinningBets = () => {
    const bets = winningBets.map((val, i, arr) => {
      const betSpot = Object.keys(val).join("");
      const betSpotValue = Number(Object.values(val).join("")).toFixed(2);

      return (
        <span key={betSpot}>
          {betSpot}: {betSpotValue}
          {Object.keys(arr[arr.length - 1]).join("") === betSpot ? "." : ", "}
        </span>
      );
    });

    return bets;
  };

  return (
    <div className={styles.balance}>
      <p>Your balance is {currentBalance.toFixed(2)}</p>
      <p>Total bet is {totalBets.toFixed(2)}</p>
      {resultPhasePayload.payout > 0 && (
        <p>
          Payout from previous round: {resultPhasePayload.payout.toFixed(2)}
        </p>
      )}
      {Object.keys(resultPhasePayload.multipliers).length !== 0 && (
        <p>Multipliers from previous round: {showMultipliers}</p>
      )}
      {winningBets.length !== 0 && (
        <p className={styles.winningBet}>
          Winning bets from previous round: {showWinningBets()}
        </p>
      )}
    </div>
  );
};
