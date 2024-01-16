import {
  blinkySvgSrc,
  blinkyLeftSvgSrc,
  blinkyRightSvgSrc,
  blinkyUpSvgSrc,
  blinkyDownSvgSrc,
} from "../../assets/img/ghost/blinky";
import { Game } from "../../game/Game";
import { Pacman } from "../Pacman";
import { up } from "../directions";
import { GHOSTS, Ghost } from "./Ghost";
import { GhostImageSprite } from "./GhostImageSprite";

export class Blinky extends Ghost {
  constructor(game: Game) {
    const imageSprite = new GhostImageSprite(
      blinkySvgSrc,
      blinkyLeftSvgSrc,
      blinkyRightSvgSrc,
      blinkyUpSvgSrc,
      blinkyDownSvgSrc
    );
    super(game, GHOSTS.BLINKY, 9, 5, imageSprite, 15, 2);
    this.setDirection(up);
  }

  // target: go straight for pacman
  protected getChaseModeTarget = (
    _game: Game,
    pacman: Pacman
  ): [targetX: number, targetY: number] => [
    pacman.getGridPosX(),
    pacman.getGridPosY(),
  ];
}
