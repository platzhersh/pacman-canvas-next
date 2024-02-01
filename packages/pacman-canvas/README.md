# Pacman Canvas

[![npm version](https://badgen.net/npm/v/@platzh1rsch%2Fpacman-canvas)](https://www.npmjs.com/package/@platzh1rsch/pacman-canvas)

Basically https://pacman.platzh1rsch.ch/ as a npm package for simple integration into your website.

## Get started

![simple setup](https://raw.githubusercontent.com/platzhersh/pacman-canvas-next/2e36ce9bf42585e62fcf0161f73602beb7d01930/packages/pacman-canvas/img/simple-setup-react.png)

### React Example

```jsx
import type { Game } from "@platzh1rsch/pacman-canvas";
import { getGameInstance } from "@platzh1rsch/pacman-canvas";
import { useEffect, useRef, useState } from "react";
import styles from "./gameCanvas.module.css";


export default function GameCanvasSimple() {
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);


  const game: Game = getGameInstance();
  
  useEffect(() => {
    if (canvasRef.current) {
      setCanvasContext(canvasRef.current.getContext("2d"));
    }
  }, []);

  useEffect(() => {
    if (game && canvasContext) {
      game.setCanvasContext2d(canvasContext);
    }
  }, [canvasContext]);

  return (
    <>
      <div>
        <section>
          {/* Game controls */}
          <button onClick={() => game.pauseResume()}>Pause / Resume</button>
          <button
            onClick={() => game.newGame()}
          >
            Restart Game
          </button>
          <button onClick={() => game.endGame()}>End Game</button>
        </section>
        
        <section>
          <div
            id={styles["canvas-container"]}
            onClick={() => {
              game.pauseResume();
            }}
          >
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
      </div>
    </>
  );
}

``````