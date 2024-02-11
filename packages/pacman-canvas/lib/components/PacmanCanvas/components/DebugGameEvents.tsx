"use client";

import React, { useState } from "react";
import { Game } from "../../../game/Game";
import Logger from "js-logger";
import { GameStateEvent, dummyGameEvent } from "../../../game/GameEvent";

type DebugGameEventsProps = {
    readonly game: Game;
};

export const DebugGameEvents = ({
  game,
}: DebugGameEventsProps) => {
  const [gameEvent, setGameEvent] = useState<GameStateEvent>(dummyGameEvent)

  game.gameEvents.subscribe((event) => {
    Logger.info("DebugGameEvents gameEvents.subscribe", event);
    setGameEvent(event);
  });

  return (
    <>
      <section style={{ lineBreak: "auto" }}>
        <textarea
          readOnly
          rows={4}
          style={{ width: "100%", background: "black", color: "white" }}
          value={JSON.stringify(gameEvent)}
        />
      </section>
      <section>
        {!gameEvent && "no game events yet"}
        {gameEvent && (
          <>
            <span>level: {gameEvent.payload.level}</span>
            &nbsp;
            <span>
              started: {String(gameEvent.payload.started)}
            </span>
            &nbsp;
            <span>paused: {String(gameEvent.payload.pause)}</span>
            &nbsp;
            <span>
              gameOver: {String(gameEvent.payload.gameOver)}
            </span>
            &nbsp;
          </>
        )}
      </section>
    </>
  );
};
