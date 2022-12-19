import { BetSpot, BettingFieldResultPayload } from "../types";

export const getMultipliers = (
  resultPayload: Pick<BettingFieldResultPayload, "multipliers">
) => {
  const multipliers = Object.entries(resultPayload.multipliers).map(
    (betSpot) => {
      return `${betSpot[0]}: ${Number(betSpot[1]).toFixed(2)}`;
    }
  );

  return multipliers;
};

export const getWinningBets = (bets: BetSpot[], multipliers: BetSpot[]) => {
  const winningBets = bets
    .filter((value) => {
      return multipliers.some((val) => {
        return Object.keys(value).every((key) => val.hasOwnProperty(key));
      });
    })
    .filter((val) => Object.values(val).join("") !== "");

  return winningBets;
};
