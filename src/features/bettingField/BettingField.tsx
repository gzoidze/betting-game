import { useEffect, useMemo, useState } from "react";
import { BettingSpot } from "./bettingSpot/BettingSpot";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { Spin } from "antd";
import {
  receiveBettingSettings,
  receiveBettingGamePhase,
  receiveBets,
  selectBalance,
  selectBettingSettings,
  selectBettingGamePhase,
  receiveBettingResultPhase,
  selectBets,
  receivePreviousBets,
} from "./bettingFieldSlice";
import { DEFAULT_FIELD_LEVEL } from "./consts";
import styles from "./BettingField.module.css";
import { Phase } from "./types";
import { BettingFieldActions } from "./bettingFieldActions/BettingFieldActions";
import { BettingFieldSelect } from "./bettingFieldSelect/BettingFieldSelect";
import { BettingFieldInfo } from "./bettingFieldInfo/BettingFieldInfo";
import { getInitialGrid } from "./utils";

export const BettingField = () => {
  const initialBalance = useAppSelector(selectBalance);
  const { type: bettingSettingsType } = useAppSelector(selectBettingSettings);
  const { payload: gamePhasePayload } = useAppSelector(selectBettingGamePhase);
  const bets = useAppSelector(selectBets);
  const dispatch = useAppDispatch();

  const [fieldLevel, setFieldLevel] = useState(DEFAULT_FIELD_LEVEL);
  const [totalBets, setTotalBets] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  const webSocketUrl = `wss://hometask.me/?field=${+fieldLevel * +fieldLevel}`;
  const webSocket = useMemo(() => new WebSocket(webSocketUrl), [webSocketUrl]);

  useEffect(() => {
    setTotalBets(0);
    dispatch(receiveBets(getInitialGrid(fieldLevel)));
    setCurrentBalance(initialBalance);
  }, [dispatch, fieldLevel, initialBalance]);

  useEffect(() => {
    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === bettingSettingsType) {
        dispatch(receiveBettingSettings(data));
      } else if (data.payload.phase === Phase.result) {
        dispatch(receiveBettingResultPhase(data));
      } else {
        dispatch(receiveBettingGamePhase(data));
      }
    };

    return () => {
      webSocket.close();
    };
  }, [bettingSettingsType, dispatch, webSocketUrl, webSocket]);

  if (!initialBalance || !(gamePhasePayload.phase === Phase.BetsOpen)) {
    return (
      <div className={styles.spinner}>
        <Spin tip="Loading..." />
      </div>
    );
  }

  const handleSelectChange = (value: string) => {
    dispatch(receiveBets(getInitialGrid(fieldLevel)));
    dispatch(receivePreviousBets([]));
    setCurrentBalance(initialBalance);
    setTotalBets(0);
    setFieldLevel(value);
  };

  return (
    <div className={styles.BettingField}>
      <h1>Welcome to the betting game</h1>
      <BettingFieldSelect handleSelectChange={handleSelectChange} />
      <BettingFieldInfo currentBalance={currentBalance} totalBets={totalBets} />
      <div
        className={styles.BettingGrid}
        style={{
          width: fieldLevel === "5" ? 300 : 600,
          height: fieldLevel === "5" ? 300 : 600,
          gridTemplateColumns: `repeat(${fieldLevel}, 1fr)`,
          gridTemplateRows: `repeat(${fieldLevel}, 1fr)`,
        }}
      >
        {bets.map((betSpot, index) => (
          <BettingSpot
            key={index}
            setTotalBets={setTotalBets}
            currentBalance={currentBalance}
            setCurrentBalance={setCurrentBalance}
            betSpot={Object.keys(betSpot).join("")}
            betSpotValue={Object.values(betSpot).join("")}
            webSocket={webSocket}
            fieldLevel={fieldLevel}
          />
        ))}
      </div>
      {gamePhasePayload.phase === Phase.BetsOpen && (
        <BettingFieldActions
          webSocket={webSocket}
          setTotalBets={setTotalBets}
          setCurrentBalance={setCurrentBalance}
          initialBalance={initialBalance}
          currentBalance={currentBalance}
        />
      )}
    </div>
  );
};
