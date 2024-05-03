import React from "react";
import { Game } from "../../../main";
import {
    blinkySvgSrc,
    cherriesSvgSrc,
    clydeSvgSrc,
    dazzled2SvgSrc,
    dazzledSvgSrc,
    deadSvgSrc,
    inkySvgSrc,
    pinkySvgSrc,
  } from "../../../assets/img";
type DebugSvgControlsProps = {
    readonly game: Game;
}
export const DebugSvgControls = ({game}: DebugSvgControlsProps) => {


    return <section>
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
};