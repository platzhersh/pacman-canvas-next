import { blinkySvgSrc } from "../../assets/img";
import { Game } from "../../game/Game";
import { Pacman } from "../Pacman";
import { up } from "../directions";
import { GHOSTS, Ghost } from "./Ghost";

export class Blinky extends Ghost {
  constructor(game: Game) {
    super(game, GHOSTS.BLINKY, 9, 5, blinkySvgSrc, 15, 2);
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
