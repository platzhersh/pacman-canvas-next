import React from "react";
import { Game } from "../../../main";
import { down, left, right, up } from "../../../figures/directions";
import styles from "./PacmanDirectionControls.module.css";

type PacmanDirectionControlsProps = { 
    readonly game: Game;
};

export const  PacmanDirectionControls = ({game}: PacmanDirectionControlsProps) => { 

    return <section>
    <div className={styles["controls"]} id="game-buttons">
      <div>
        <button
          onClick={() => game.setPacmanDirection(up)}
          id="up"
          className={styles["controlButton"]}
        >
          &uarr;
        </button>
      </div>
      <div>
        <button
          onClick={() => game.setPacmanDirection(left)}
          id="left"
          className={styles["controlButton"]}
        >
          &larr;
        </button>
        <button
          onClick={() => game.setPacmanDirection(down)}
          id="down"
          className={styles["controlButton"]}
        >
          &darr;
        </button>
        <button
          onClick={() => game.setPacmanDirection(right)}
          id="right"
          className={styles["controlButton"]}
        >
          &rarr;
        </button>
      </div>
    </div>
  </section>
};