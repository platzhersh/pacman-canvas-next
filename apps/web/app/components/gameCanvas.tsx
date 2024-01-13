"use client";

import { Game, helloPacman, renderContent } from "@repo/pacman-canvas";
import {
    blinkySvgSrc,
    clydeSvgSrc,
    dazzled2SvgSrc,
    dazzledSvgSrc,
    deadSvgSrc,
    inkySvgSrc,
    pinkySvgSrc
} from "@repo/pacman-canvas/src/assets/img";
import {
    down,
    left,
    right,
    up,
} from "@repo/pacman-canvas/src/figures/directions";
import {
    GameStateChangeListener,
    GameStateEvent,
} from "@repo/pacman-canvas/src/game/Game";
import { animationLoop } from "@repo/pacman-canvas/src/game/render/animationLoop";
import { useEffect, useRef, useState } from "react";
import { getGameInstance } from "./game";
import styles from "./gameCanvas.module.css";

export default function GameCanvas() {
  const [gameStateSnapshotEvent, setGameStateSnapshotEvent] = useState<GameStateEvent | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);

  const game: Game = getGameInstance();

  const onGameStateChange: GameStateChangeListener = (
    event: GameStateEvent
  ) => {
    console.log("onGameStateChange", event.eventName, event.datetime, event.payload);
    setGameStateSnapshotEvent(event);
  };

  game.registerGameStateChangeListener(onGameStateChange);

  useEffect(() => {
    // Your jQuery code goes here
    // Example: $('element').hide();
    // game = new Game();

    if (canvasRef.current) {
      console.log("canvasRef.current", canvasRef.current);
      const context = canvasRef.current.getContext("2d");
      console.log("context", context);
      setCanvasContext(canvasRef.current.getContext("2d"));
    }

    console.log("canvasContext", canvasContext);
    // game.buildWalls();
    // registerDocumentReadyCallback(game);
    // TODO: register key event handler

    // if (canvasContext) {
    //   renderContent(game, canvasContext);
    // }
  }, []);

  useEffect(() => {
    if (game && canvasContext) {
      game.setCanvasContext2d(canvasContext);
      renderContent(game);
    }
  }, [canvasContext]);

  useEffect(() => {
    console.log("gameStateSnapshot changed");
  }, [gameStateSnapshotEvent]);

  //   const pacman = game.getPacman();

  return (
    <>
      <div style={{ background: "grey" }}>
        <section>
          <div>
            {helloPacman()} {game.getId()}
          </div>
        </section>
        <section>
          <span>
            show overlay:{" "}
            {String(
              !gameStateSnapshotEvent || gameStateSnapshotEvent.payload.pause
            )}
          </span>
          &nbsp;
        </section>
        <section style={{ lineBreak: "auto" }}>
          <textarea
            readOnly
            rows={4}
            style={{ width: "100%", background: "black", color: "white" }}
            value={JSON.stringify(gameStateSnapshotEvent)}
          />
        </section>
        <section>
          {!gameStateSnapshotEvent && "no game events yet"}
          {gameStateSnapshotEvent && (
            <>
              <span>level: {gameStateSnapshotEvent.payload.level}</span>&nbsp;
              {/* <span>
                direction: {game.getPacman().getDirection().getName()}
              </span> */}
              &nbsp;
              {/* <span>refreshRate: {gameStateSnapshot.ref}</span>&nbsp; */}
              <span>
                started: {String(gameStateSnapshotEvent.payload.started)}
              </span>
              &nbsp;
              <span>
                paused: {String(gameStateSnapshotEvent.payload.pause)}
              </span>
              &nbsp;
              <span>
                gameOver: {String(gameStateSnapshotEvent.payload.gameOver)}
              </span>
              &nbsp;
            </>
          )}
        </section>
        <section>
          {/* <img src={inkyBase64} alt="inkyBase64" /> */}
          {/* {inkyBase64} */}
          <img src={inkySvgSrc} alt="inkySvg" />
          <img src={blinkySvgSrc} alt="blinkySvg" />
          <img src={pinkySvgSrc} alt="pinkySvg" />
          <img src={clydeSvgSrc} alt="clydeSvg" />
          <img src={deadSvgSrc} alt="deadSvgSrc" />
          <img src={dazzledSvgSrc} alt="dazzledSvgSrc" />
          <img src={dazzled2SvgSrc} alt="dazzled2SvgSrc" />

        </section>
      
        <section>
          <button onClick={() => game.pauseResume()}>Pause / Resume</button>
          <button
            onClick={() => game.newGame()}
            disabled={!gameStateSnapshotEvent?.payload.started}
          >
            Restart Game
          </button>
          <button onClick={() => game.endGame()}>End Game</button>
          <button onClick={() => game.buildWalls()}>Build Walls</button>
          <button onClick={() => game.toggleGridVisibility()}>
            Toggle Grid
          </button>
          <button onClick={() => animationLoop(game)()}>
            Next Animationloop
          </button>
        </section>
        <section>
          <div
            id={styles["canvas-container"]}
            onClick={() => {
              if (!game.isGameOver()) game.pauseResume();
            }}
          >
            {/* <button onClick={() => pacman.} */}
            {(!gameStateSnapshotEvent ||
              gameStateSnapshotEvent.payload.pause) && (
              <div id={styles["canvas-overlay-container"]}>
                <div id={styles["canvas-overlay-content"]}>
                  <div id={styles["title"]}>Pacman Canvas</div>
                  <div>
                    <p id="text">Click to Play</p>
                  </div>
                </div>
              </div>
            )}
            <canvas
              //   ref={(c) => c ? setCanvasContext(c.getContext('2d')) : null}
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
        <section>
          <div className="controls" id="game-buttons">
            <div>
              <button
                onClick={() => game.setPacmanDirection(up)}
                id="up"
                className="controlButton"
              >
                &uarr;
              </button>
            </div>
            <div>
              <button
                onClick={() => game.setPacmanDirection(left)}
                id="left"
                className="controlButton"
              >
                &larr;
              </button>
              <button
                onClick={() => game.setPacmanDirection(down)}
                id="down"
                className="controlButton"
              >
                &darr;
              </button>
              <button
                onClick={() => game.setPacmanDirection(right)}
                id="right"
                className="controlButton"
              >
                &rarr;
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}