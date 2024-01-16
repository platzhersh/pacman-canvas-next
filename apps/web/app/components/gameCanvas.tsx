"use client";

import getGameInstance, { Game, helloPacman } from "@repo/pacman-canvas";
import {
    blinkySvgSrc,
    clydeSvgSrc,
    dazzled2SvgSrc,
    dazzledSvgSrc,
    deadSvgSrc,
    inkySvgSrc,
    pinkySvgSrc,
} from "@repo/pacman-canvas/src/assets/img";
import { cherriesSvgSrc } from "@repo/pacman-canvas/src/assets/img/gastronomy";
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
import styles from "./gameCanvas.module.css";

export default function GameCanvas() {
  const [gameStateSnapshotEvent, setGameStateSnapshotEvent] =
    useState<GameStateEvent | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);

  const game: Game = getGameInstance();

  const onGameStateChange: GameStateChangeListener = (
    event: GameStateEvent
  ) => {
    console.log(
      "onGameStateChange",
      event.eventName,
      event.datetime,
      event.payload
    );
    setGameStateSnapshotEvent(event);
  };

  game.registerGameStateChangeListener(onGameStateChange);

  useEffect(() => {
    // Your jQuery code goes here
    // Example: $('element').hide();
    // game = new Game();

    if (canvasRef.current) {
      console.debug("canvasRef.current", canvasRef.current);
      const context = canvasRef.current.getContext("2d");
      console.debug("context", context);
      setCanvasContext(canvasRef.current.getContext("2d"));
    }

    console.debug("canvasContext", canvasContext);
  }, []);

  useEffect(() => {
    if (game && canvasContext) {
      game.setCanvasContext2d(canvasContext);
    }
  }, [canvasContext]);

  useEffect(() => {
    console.debug("gameStateSnapshot changed");
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
          <img
            onClick={() =>
              game.getGhosts().inky.toggleDirectionOptionsVisualizations()
            }
            src={inkySvgSrc}
            title="Inky"
            alt="inkySvg"
          />
          <img
            onClick={() =>
              game.getGhosts().blinky.toggleDirectionOptionsVisualizations()
            }
            src={blinkySvgSrc}
            title="Blinky"
            alt="blinkySvg"
          />
          <img
            onClick={() =>
              game.getGhosts().pinky.toggleDirectionOptionsVisualizations()
            }
            src={pinkySvgSrc}
            title="Pinky"
            alt="pinkySvg"
          />
          <img
            onClick={() =>
              game.getGhosts().clyde.toggleDirectionOptionsVisualizations()
            }
            src={clydeSvgSrc}
            title="Clyde"
            alt="clydeSvg"
          />
          <img src={deadSvgSrc} title="Dead" alt="deadSvgSrc" />
          <img src={dazzledSvgSrc} title="Dazzled" alt="dazzledSvgSrc" />
          <img src={dazzled2SvgSrc} title="Dazzled2" alt="dazzled2SvgSrc" />
          <img
            onClick={() => game.setMapContent(9, 9, "🍒")}
            src={cherriesSvgSrc}
            title="cherries"
            alt="cherries"
            width="60"
            height="60"
          />
        </section>

        <section>
          {/* Game controls */}
          <button onClick={() => game.pauseResume()}>Pause / Resume</button>
          <button
            onClick={() => game.newGame()}
            disabled={!gameStateSnapshotEvent?.payload.started}
          >
            Restart Game
          </button>
          <button onClick={() => game.endGame()}>End Game</button>
        </section>
        <section>
          {/* Rendering options */}
          <button onClick={() => game.buildWalls()}>Build Walls</button>
          <button onClick={() => game.toggleGridVisibility()}>
            Toggle Grid
          </button>
          <button onClick={() => game.toggleTargetVisualisations()}>
            Toggle Target Viz
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
