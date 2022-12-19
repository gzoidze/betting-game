import { LETTERS } from "./consts";
import { BetSpot } from "./types";

export const calculateTotalBets = (bets: BetSpot[]) => {
  return bets
    .map((bet) => Object.values(bet))
    .reduce((prevValue, currValue) => +prevValue + +currValue, 0);
};

export const getInitialGrid = (fieldLevel: string) => {
  const emptyArray = Array(+fieldLevel).fill("");
  const alphabetArray = LETTERS.slice(0, +fieldLevel);
  let resultArray: BetSpot[] = [];

  emptyArray.map((_, i, array) =>
    alphabetArray.map((_, index, arr) => {
      let key = arr[index] + (i + 1);
      let obj: BetSpot = {};
      obj[key] = array[index];
      resultArray.push(obj);
      return resultArray;
    })
  );

  return resultArray;
};
