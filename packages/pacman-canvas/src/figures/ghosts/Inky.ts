import { inkySvgSrc } from "../../assets/img";
import { Game } from "../../game/Game";
import { Pacman } from "../Pacman";
import { GHOSTS, Ghost } from "./Ghost";

export class Inky extends Ghost {
  constructor(game: Game) {
    super(game, GHOSTS.INKY, 8, 5, inkySvgSrc, 13, 11);
  }

  protected getChaseModeTarget = (
    game: Game,
    pacman: Pacman
  ): [targetX: number, targetY: number] => {
    let targetX = pacman.getGridPosX() + 2 * pacman.getDirection().getDirX();
    let targetY = pacman.getGridPosY() + 2 * pacman.getDirection().getDirY();

    const blinky = game.getGhosts().blinky;
    let vX = targetX - blinky.getGridPosX();
    let vY = targetY - blinky.getGridPosY();
    targetX = Math.abs(blinky.getGridPosX() + vX * 2);
    targetY = Math.abs(blinky.getGridPosY() + vY * 2);

    return [targetX, targetY];
  };
}
