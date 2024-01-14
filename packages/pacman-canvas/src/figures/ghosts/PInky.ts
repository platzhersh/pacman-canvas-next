import { pinkySvgSrc } from "../../assets/img";
import { Game, PACMAN_RADIUS } from "../../game/Game";
import { Pacman } from "../Pacman";
import { right } from "../directions";
import { GHOSTS, Ghost } from "./Ghost";

export class Pinky extends Ghost {
  constructor(game: Game) {
    super(game, GHOSTS.PINKY, 7, 5, pinkySvgSrc, 2, 2);
    this.setDirection(right);
  }

  /**
   * target: 4 ahead and 4 left of pacman
   * @param game
   * @param pacman
   * @returns
   */
  protected getChaseModeTarget = (
    game: Game,
    pacman: Pacman
  ): [targetX: number, targetY: number] => {
    var pacmanDirection = pacman.getDirection();
    var pdirX =
      pacmanDirection.getDirX() === 0
        ? -pacmanDirection.getDirY()
        : pacmanDirection.getDirX();
    var pdirY =
      pacmanDirection.getDirY() === 0
        ? -pacmanDirection.getDirX()
        : pacmanDirection.getDirY();

    let targetX =
      (pacman.getGridPosX() + pdirX * 4) %
      (game.getCanvasWidth() / PACMAN_RADIUS + 1);
    let targetY =
      (pacman.getGridPosY() + pdirY * 4) %
      (game.getCanvasHeight() / PACMAN_RADIUS + 1);

    return [targetX, targetY];
  };
}
