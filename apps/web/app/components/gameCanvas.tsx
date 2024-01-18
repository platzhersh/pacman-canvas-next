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
  GRID_SIZE,
  GameOverlayMessageEvent,
  GameOverlayMessageListener,
  GameStateChangeListener,
  GameStateEvent,
} from "@repo/pacman-canvas/src/game/Game";
import { FoodHandler } from "@repo/pacman-canvas/src/game/food/FoodHandler";
import { animationLoop } from "@repo/pacman-canvas/src/game/render/animationLoop";
import { useEffect, useRef, useState } from "react";
import styles from "./gameCanvas.module.css";

// as recommended on https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application
let didInit = false;

export default function GameCanvas() {
  const [gameStateSnapshotEvent, setGameStateSnapshotEvent] =
    useState<GameStateEvent | null>(null);
  const [overlayMessage, setOverlayMessage] = useState<GameOverlayMessageEvent>(
    { title: "Pacman Canvas", text: "Click to start" }
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);

  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const [canvasContext2, setCanvasContext2] =
    useState<CanvasRenderingContext2D | null>(null);

  const game: Game = getGameInstance();

  if (!didInit) {
    didInit = true;

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

    const onOverlayMessage: GameOverlayMessageListener = (
      event: GameOverlayMessageEvent
    ) => {
      setOverlayMessage(event);
    };

    game.registerGameOverlayMessageListener(onOverlayMessage);
  }
  useEffect(() => {

    if (canvasRef.current) {
      console.debug("canvasRef.current", canvasRef.current);
      const context = canvasRef.current.getContext("2d");
      console.debug("context", context);
      setCanvasContext(canvasRef.current.getContext("2d"));
    }

    if (canvasRef2.current) {
      console.debug("canvasRef2.current", canvasRef2.current);
      const context = canvasRef2.current.getContext("2d");
      console.debug("context", context);
      setCanvasContext2(canvasRef2.current.getContext("2d"));
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

  const foodHandler = new FoodHandler();

  return (
    <>
      <div style={{ background: "grey" }}>
        <section>
          <canvas
            //   ref={(c) => c ? setCanvasContext(c.getContext('2d')) : null}
            ref={canvasRef2}
            style={{ background: "black" }}
            id="myCanvas2"
            width="30"
            height="30"
          >
            <p>Canvas not supported</p>
          </canvas>
          <button
            onClick={() => {
              if (canvasContext2) {
                console.log("draw food", foodHandler, canvasContext2);
                canvasContext2.clearRect(0, 0, GRID_SIZE, GRID_SIZE);
                foodHandler.draw(canvasContext2, 0, 0, GRID_SIZE, GRID_SIZE);
              }
            }}
          >
            draw food
          </button>
          <button onClick={() => foodHandler.shuffle()}>shuffle</button>
          <button
            onClick={() =>
              canvasContext2?.clearRect(0, 0, GRID_SIZE, GRID_SIZE)
            }
          >
            clear
          </button>
        </section>
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
              <span>level: {gameStateSnapshotEvent.payload.level}</span>
              &nbsp;
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
            // disabled={!gameStateSnapshotEvent?.payload.started}
          >
            Restart Game
          </button>
          <button onClick={() => game.endGame()}>End Game</button>
          <button onClick={() => game.nextLevel()}>Next Level</button>
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
