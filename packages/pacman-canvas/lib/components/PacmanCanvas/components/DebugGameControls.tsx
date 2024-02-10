import React from "react";
import { Game } from "../../../main";
import { animationLoop } from "../../../game/render/animationLoop";

type DebugGameControlsProps = { 
    readonly game: Game;
};
export const DebugGameControls = ({game}: DebugGameControlsProps) => { 

    return <section>
    {/* Rendering options */}
    <button onClick={() => game.buildWalls()}>Build Walls</button>
    <button onClick={() => game.toggleGridVisibility()}>Toggle Grid</button>
    <button onClick={() => game.toggleTargetVisualisations()}>
      Toggle Target Viz
    </button>
    <button onClick={() => animationLoop(game)()}>
      Next Animationloop
    </button>
  </section>
};