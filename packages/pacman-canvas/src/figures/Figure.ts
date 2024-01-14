import { Game } from "../game/Game";
import { down, left, right, up } from "./directions";
import { Direction, DirectionFieldAhead } from "./directions/Direction";
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

/**
 * Abstract parent class for Ghost and Pacman
 */
export abstract class Figure {
  protected name: string = "figure";
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

  protected getFieldAhead = (
    game: Game,
    useDirectionWatcher?: boolean
  ): DirectionFieldAhead => {
    let gridX = this.getGridPosX();
    let gridY = this.getGridPosY();
    // const gridAheadX = gridX + this.dirX;
    // const gridAheadY = gridY + this.dirY;
    let gridAheadX = gridX;
    let gridAheadY = gridY;

    const nextDirection = this.directionWatcher.get();
    const [dirX, dirY] =
      nextDirection && useDirectionWatcher
        ? [nextDirection.getDirX(), nextDirection.getDirY()]
        : [this.dirX, this.dirY];

    // get the field 1 ahead to check wall collisions
    if (dirX === 1 && gridAheadX < 17) gridAheadX += 1;
    if (dirY === 1 && gridAheadY < 12) gridAheadY += 1;
    const fieldAhead = game.getMapContent(gridAheadX, gridAheadY);

    return {
      field: fieldAhead,
      dirX: dirX,
      dirY: dirY,
      posX: gridAheadX,
      posY: gridAheadY,
    };
  };

  // TODO: difference to getFieldAhead is unclear
  protected getNextTile = (game: Game, nextDirection: Direction) => {
    //console.log("changeDirection to "+directionWatcher.get().name);

    // check if possible to change direction without getting stuck
    console.debug("x: " + this.getGridPosX() + " + " + nextDirection.getDirX());
    console.debug("y: " + this.getGridPosY() + " + " + nextDirection.getDirY());
    let x = this.getGridPosX() + (nextDirection.getDirX() ?? 0);
    let y = this.getGridPosY() + (nextDirection.getDirY() ?? 0);
    if (x <= -1) x = game.getCanvasWidth() / (this.radius * 2) - 1;
    if (x >= game.getCanvasWidth() / (this.radius * 2)) x = 0;
    if (y <= -1) x = game.getCanvasHeight() / (this.radius * 2) - 1;
    if (y >= game.getCanvasHeight() / (this.radius * 2)) y = 0;

    console.debug("x: " + x);
    console.debug("y: " + y);

    return game.getGridMap().getTileType(x, y);
  };

  public abstract checkDirectionChange: (game: Game) => void;
  public setNextDirection: (game: Game) => void = (game: Game) => {
    throw Error("not implemented");
  };

  /**
   *
   * @returns true if current position is aligned with grid
   */
  public inGrid = () =>
    this.posX % (2 * this.radius) === 0 && this.posY % (2 * this.radius) === 0;

  public getOppositeDirection = (): Direction => {
    if (this.direction.equals(up)) return down;
    else if (this.direction.equals(down)) return up;
    else if (this.direction.equals(right)) return left;
    else if (this.direction.equals(left)) return right;
    throw Error("Invalid Direction");
  };

  public move = (game: any) => {
    if (!this.isStopped) {
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
    console.log(
      `${this.name} stopped at ${this.posX}, ${
        this.posY
      } / ${this.getGridPosX()}, ${this.getGridPosY()} (inGrid: ${this.inGrid()}, direction: ${this.direction.getName()})`
    );
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
