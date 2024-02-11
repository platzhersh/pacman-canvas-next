import { inkySvgSrc } from "../../assets/img";
import {
  inkyLeftSvgSrc,
  inkyRightSvgSrc,
  inkyUpSvgSrc,
  inkyDownSvgSrc,
} from "../../assets/img/ghost/inky";
import { Game } from "../../game/Game";
import { Pacman } from "../Pacman";
import { up } from "../directions";
import { GHOSTS, Ghost } from "./Ghost";
import { GhostImageSprite } from "./GhostImageSprite";

export class Inky extends Ghost {
  constructor(game: Game) {
    const imageSprite = new GhostImageSprite(
      inkySvgSrc,
      inkyLeftSvgSrc,
      inkyRightSvgSrc,
      inkyUpSvgSrc,
      inkyDownSvgSrc
    );
    super(game, GHOSTS.INKY, 8, 5, imageSprite, 13, 11);
    this.setDirection(up);
  }

  // Inky starts after 30 pills and only from the third level on
  protected checkStartingConditions = (game: Game) => {
    if (game.getLevel() < 3 || game.getPillCount() > 104 - 30) {
      this.stop();
    } else {
      this.start();
    }
  };

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
