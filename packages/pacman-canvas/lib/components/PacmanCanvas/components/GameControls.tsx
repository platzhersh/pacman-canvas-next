import React from "react";
import { Game } from "../../../main";

type GameControlsProps = { 
    readonly game: Game;
};
export const GameControls = ({game}: GameControlsProps) => { 
    
    return <section>
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
  
};