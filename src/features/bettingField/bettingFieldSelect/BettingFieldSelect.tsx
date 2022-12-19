import { Select } from "antd";
import { FC } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectBettingGamePhase } from "../bettingFieldSlice";
import { DEFAULT_FIELD_LEVEL, selectoptions } from "../consts";
import { Phase } from "../types";

interface Props {
  handleSelectChange: (value: string) => void;
}

export const BettingFieldSelect: FC<Props> = ({ handleSelectChange }) => {
  const { payload: gamePhasePayload } = useAppSelector(selectBettingGamePhase);

  return (
    <div>
      <span>Please select a field Level</span>
      <Select
        defaultValue={DEFAULT_FIELD_LEVEL}
        size="small"
        style={{ width: 120, marginLeft: 10 }}
        onChange={handleSelectChange}
        options={selectoptions}
        disabled={gamePhasePayload.phase === Phase.BetsClosed}
      />
    </div>
  );
};
