import { BetSpot } from "../types";
import { calculateTotalBets } from "../utils";

export const hasBets = (bets: BetSpot[]) =>
  bets.some((val) => Object.values(val).join("") !== "");

export const getAction = (bets: BetSpot[], undo?: boolean) => {
  const actions = bets
    .filter((val) => Object.values(val).join("") !== "")
    .reduce((acc, val) => {
      const spots = Object.keys(val);
      const values = Object.values(val);
      return {
        ...acc,
        [spots[0]]: undo ? -1 : +values[0],
      };
    }, {});
  return actions;
};

export const repeatBtnTooltip = (
  isRepeatClicked: boolean,
  previousBets: BetSpot[]
) => {
  let repeatBtnTooltip = "";
  if (!hasBets(previousBets))
    return (repeatBtnTooltip = "There is no bets to repeat");
  if (isRepeatClicked) return (repeatBtnTooltip = "Button is already clicked");
  if (calculateTotalBets(previousBets))
    return (repeatBtnTooltip =
      "You dont have enough balance to repeat previous bet");
  return repeatBtnTooltip;
};
