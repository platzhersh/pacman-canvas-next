"use client";

import Logger from "js-logger";
import React, { useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import getGameInstance, { Game, helloPacman } from "../../main";
import styles from "./PacmanCanvas.module.css";
import { DebugFoodControls } from "./components/DebugFoodControls";
import { DebugGameControls } from "./components/DebugGameControls";
import { DebugGameEvents } from "./components/DebugGameEvents";
import { DebugSvgControls } from "./components/DebugSvgControls";
import { GameControls } from "./components/GameControls";
import { GameOverlay } from "./components/GameOverlay";
import { PacmanDirectionControls } from "./components/PacmanDirectionControls";

// as recommended on https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application
let didInit = false;

type PacmanCanvasProps = {
  readonly debug?: boolean;
  readonly showDirectionControls?: boolean;
};

export const PacmanCanvas = ({ debug, showDirectionControls = true }: PacmanCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);

  const [game, _] = useState<Game>(getGameInstance());

  // register listeners, but only once
  if (!didInit) {
    Logger.info("registering listeners");
    didInit = true;
    game.setup();
  }

  useEffect(() => {
    Logger.info("useEffect [] didInit", didInit);
    if (canvasRef.current) {
      debug && Logger.debug("canvasRef.current", canvasRef.current);
      const context = canvasRef.current.getContext("2d");
      debug && Logger.debug("context", context);
      setCanvasContext(canvasRef.current.getContext("2d"));
    }

    debug && Logger.debug("canvasContext", canvasContext);
  }, []);

  // detect changes in canvasContext
  useEffect(() => {
    if (game && canvasContext) {
      game.setCanvasContext2d(canvasContext);
    }
  }, [canvasContext]);


  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <div className={styles['main']}>
        <div className={styles['game']}>
        {debug && (
          <section>
            <DebugFoodControls />
          </section>
        )}
        {debug && (<>didInit: {String(didInit)}</>)}
        {debug && (
          <section>
            <div>
              {helloPacman()} {game.getId()}
            </div>
          </section>
        )}
        {debug && (
          <DebugGameEvents game={game} />
        )}
        {debug && <DebugSvgControls game={game} />}
        {<GameControls game={game} />}
        {debug && <DebugGameControls game={game} />}

        <section className={styles['content']}>
          <div
            id={styles["canvas-container"]}
            onClick={() => {
              game.pauseResume();
            }}
          >
            <GameOverlay game={game} />
            <canvas
              ref={canvasRef}
              style={{ background: "black" }}
              id="myCanvas"
              width="540"
              height="390"
            >
              <p>Canvas not supported</p>
            </canvas>
          </div>
        </section>
        {showDirectionControls && <PacmanDirectionControls game={game} />}
      </div></div>
    </ErrorBoundary>
  );
};
