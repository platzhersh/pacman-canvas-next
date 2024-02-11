import React, { useState } from "react";
import { Game } from "../../../game/Game";
import styles from "./GameOverlay.module.css";
import Logger from "js-logger";
import { GameOverlayMessageEvent } from "../../../game/GameEvent";

type GameOverlayProps = {
  readonly game: Game;
};
export const GameOverlay = ({ game }: GameOverlayProps) => {
  const [isPaused, setIsPaused] = useState<boolean>(true);

  const [overlayMessage, setOverlayMessage] = useState<GameOverlayMessageEvent>(
    { title: "Pacman Canvas", text: "Click to start" }
  );

  game.gameEvents.subscribe((event) => {
    Logger.info("DebugGameEvents gameEvents.subscribe", event);
    if (event.payload.pause !== isPaused) {
      setIsPaused(event.payload.pause);
    }
  });

  game.gameOverlayMessages.subscribe((event) => {
    Logger.info("DebugGameEvents gameOverlayMessages.subscribe", event);
    setOverlayMessage(event);
  });

  if (!isPaused) return null;

  return (
    <div id={styles["canvas-overlay-container"]}>
      <div id={styles["canvas-overlay-content"]}>
        <div id={styles["title"]}>{overlayMessage?.title}</div>
        <div>
          <p id="text">
            {overlayMessage?.text}
            {overlayMessage.text2 ? (
              <>
                <br />
                {overlayMessage.text2}
              </>
            ) : null}
          </p>
        </div>
      </div>
    </div>
  );
};
