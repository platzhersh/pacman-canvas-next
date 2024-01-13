import { Game } from "../game/Game";
import { down, left, right, up } from "./directions";
import { Direction } from "./directions/Direction";
import { DirectionWatcher } from "./directions/DirectionWatcher";

/**
 * Checks if x is greater or equal min, and smaller or equal max
 * @param x
 * @param min
 * @param max
 * @returns
 */
export const isInRange = (x: number, min: number, max: number) => {
  return x >= min && x <= max;
};

export class Figure {
  protected posX: number = 0;
  protected posY: number = 0;
  protected speed: number = 0;
  protected angle1 = 0;
  protected angle2 = 0;

  protected dirX: number = 0;
  protected dirY: number = 0;
  protected direction: Direction = right;

  protected radius: number = 0;

  protected isStopped: boolean = true;
  protected directionWatcher: DirectionWatcher = new DirectionWatcher();

  public getNextDirection = (game: Game) => {
    console.log("Figure getNextDirection");
  };

  public inGrid = () => {
    if (
      this.posX % (2 * this.radius) === 0 &&
      this.posY % (2 * this.radius) === 0
    )
      return true;
    return false;
  };

  public checkDirectionChange = (game: Game) => {
    const currentDirection = this.directionWatcher.get();
    if (this.inGrid() && currentDirection === null) this.getNextDirection(game);
    if (currentDirection !== null && this.inGrid()) {
      this.setDirection(currentDirection);
      this.directionWatcher.set(null);
    }
  };

  public getOppositeDirection = (): Direction => {
    if (this.direction.equals(up)) return down;
    else if (this.direction.equals(down)) return up;
    else if (this.direction.equals(right)) return left;
    else if (this.direction.equals(left)) return right;
    throw Error("Invalid Direction");
  };

  public move = (game: any) => {
    if (!this.stop) {
      this.posX += this.speed * this.dirX;
      this.posY += this.speed * this.dirY;

      // Check if out of canvas
      if (this.posX >= game.width - this.radius)
        this.posX = this.speed - this.radius;
      if (this.posX <= 0 - this.radius)
        this.posX = game.width - this.speed - this.radius;
      if (this.posY >= game.height - this.radius)
        this.posY = this.speed - this.radius;
      if (this.posY <= 0 - this.radius)
        this.posY = game.height - this.speed - this.radius;
    }
  };

  public stop = () => {
    this.isStopped = true;
  };

  public start = () => {
    this.isStopped = false;
  };

  public getRadius = () => this.radius;

  public getPosX = () => this.posX;
  public getPosY = () => this.posY;

  public getAngle1 = () => this.angle1;
  public getAngle2 = () => this.angle2;

  public getGridPosX = () => {
    return (this.posX - (this.posX % 30)) / 30;
  };
  public getGridPosY = () => {
    return (this.posY - (this.posY % 30)) / 30;
  };
  public setDirection = (dir: Direction) => {
    this.dirX = dir.getDirX();
    this.dirY = dir.getDirY();
    this.angle1 = dir.getAngle1();
    this.angle2 = dir.getAngle2();
    this.direction = dir;
  };
  public setPosition = (x: number, y: number) => {
    this.posX = x;
    this.posY = y;
  };
}
