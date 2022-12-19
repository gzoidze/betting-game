import { Dispatch, FC, SetStateAction, useState } from "react";
import { Button, Tooltip } from "antd";
import styles from "./BettingFieldActions.module.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  receiveBets,
  receivePreviousBets,
  receivePreviousFieldState,
  selectBets,
  selectPreviousBets,
  selectPreviousFieldState,
} from "../bettingFieldSlice";
import { calculateTotalBets } from "../utils";
import { getAction, hasBets, repeatBtnTooltip } from "./utils";
import { BetSpot } from "../types";

interface Props {
  webSocket: WebSocket;
  setTotalBets: Dispatch<SetStateAction<number>>;
  setCurrentBalance: Dispatch<SetStateAction<number>>;
  initialBalance: number;
  currentBalance: number;
}

export const BettingFieldActions: FC<Props> = ({
  webSocket,
  setTotalBets,
  setCurrentBalance,
  initialBalance,
  currentBalance,
}) => {
  const [isRepeatClicked, setIsRepeatClicked] = useState(false);
  const [isUndoClicked, setIsUndoClicked] = useState(false);
  const bets = useAppSelector(selectBets);
  const previousBets = useAppSelector(selectPreviousBets);
  const previousFieldState = useAppSelector(selectPreviousFieldState);
  const dispatch = useAppDispatch();
  const totalBets = calculateTotalBets(bets);

  const isDoubleBtnDisabled = totalBets * 2 > currentBalance || !hasBets(bets);
  const isRepeatBtnDisabled =
    calculateTotalBets(previousBets) > initialBalance ||
    !hasBets(previousBets) ||
    isRepeatClicked;

  const handleStartGameClick = () => {
    const previousBets = [...bets];

    webSocket.send(
      JSON.stringify({
        type: "startGame",
      })
    );
    dispatch(receivePreviousBets(previousBets));
  };

  const handleDoubleClick = () => {
    let betsCopy = [...bets];
    const doubledBets = betsCopy.map((val) => {
      if (Object.values(val).join("") !== "") {
        return {
          [Object.keys(val).join("")]: `${+Object.values(val).join("") * 2}`,
        };
      }

      return val;
    }) as BetSpot[];

    const total = calculateTotalBets(doubledBets);

    dispatch(receiveBets(doubledBets));
    dispatch(receivePreviousFieldState(bets));
    setTotalBets(total);
    setCurrentBalance(initialBalance - total);

    const action = getAction(betsCopy);

    webSocket.send(
      JSON.stringify({
        type: "placeBet",
        action,
      })
    );
  };

  const handleReapetClick = () => {
    setIsRepeatClicked(true);
    dispatch(receiveBets(previousBets));
    dispatch(receivePreviousFieldState(bets));
    const total = calculateTotalBets(previousBets);

    setTotalBets(total);
    setCurrentBalance(initialBalance - total);

    const action = getAction(previousBets);

    webSocket.send(
      JSON.stringify({
        type: "placeBet",
        action,
      })
    );
  };

  const handleUndoClick = () => {
    const total = calculateTotalBets(previousFieldState);
    setIsUndoClicked(true);
    dispatch(receivePreviousFieldState(previousFieldState));
    dispatch(receiveBets(previousFieldState));
    setTotalBets(total);
    setCurrentBalance(initialBalance - total);

    const obj1 = getAction(bets);
    const obj2 = getAction(previousFieldState);

    const removeddKey = Object.keys(obj1).filter(
      (key) => !Object.keys(obj2).includes(key)
    );
    const action =
      removeddKey.length === 1
        ? {
            [removeddKey[0]]: -1,
          }
        : getAction(bets, true);

    webSocket.send(
      JSON.stringify({
        type: "placeBet",
        action,
      })
    );
  };

  return (
    <div className={styles.bettingActions}>
      <Tooltip
        title={!hasBets(bets) ? "Please make a bet to start a game" : ""}
      >
        <Button onClick={handleStartGameClick} disabled={!hasBets(bets)}>
          Start Game
        </Button>
      </Tooltip>
      <Tooltip
        title={
          isUndoClicked
            ? "Button is already clicked"
            : !hasBets(bets)
            ? "No changes to make undo"
            : ""
        }
      >
        <Button
          disabled={!hasBets(bets) || isUndoClicked}
          onClick={handleUndoClick}
        >
          Undo
        </Button>
      </Tooltip>
      <Tooltip
        title={
          isRepeatBtnDisabled
            ? repeatBtnTooltip(isRepeatClicked, previousBets)
            : ""
        }
      >
        <Button onClick={handleReapetClick} disabled={isRepeatBtnDisabled}>
          Repeat
        </Button>
      </Tooltip>
      <Tooltip
        title={
          !hasBets(bets)
            ? "Please make a bet to double it"
            : totalBets * 2 > currentBalance
            ? "You dont have enough balance to double the bet"
            : ""
        }
      >
        <Button onClick={handleDoubleClick} disabled={isDoubleBtnDisabled}>
          Double Bets
        </Button>
      </Tooltip>
    </div>
  );
};
