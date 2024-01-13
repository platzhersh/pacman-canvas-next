import { clydeSvgSrc } from "../../assets/img";
import { Game } from "../../game/Game";
import { Pacman } from "../Pacman";
import { GHOSTS, Ghost } from "./Ghost";

export class Clyde extends Ghost {
  constructor(game: Game) {
    super(game, GHOSTS.CLYDE, 10, 5, clydeSvgSrc, 2, 11);
  }

  /**
   * target: pacman, until pacman is closer than 5 grid fields, then back to scatter
   */
  protected getChaseModeTarget = (
    _game: Game,
    pacman: Pacman
  ): [targetX: number, targetY: number] => {
    let targetX = pacman.getGridPosX();
    let targetY = pacman.getGridPosY();
    let dist = Math.sqrt(
      Math.pow(this.getGridPosX() - targetX, 2) +
        Math.pow(this.getGridPosY() - targetY, 2)
    );

    if (dist < 5) {
      targetX = this.gridBaseX;
      targetY = this.gridBaseY;
    }

    return [targetX, targetY];
  };
}
