export type DirectionName = "up" | "right" | "down" | "left";
export type DirectionVelocity = -1 | 0 | 1;

export class Direction {
  private name: DirectionName;
  private angle1: number;
  private angle2: number;
  private dirX: DirectionVelocity;
  private dirY: DirectionVelocity;

  constructor(
    name: DirectionName,
    angle1: number,
    angle2: number,
    dirX: DirectionVelocity,
    dirY: DirectionVelocity
  ) {
    this.name = name;
    this.angle1 = angle1;
    this.angle2 = angle2;
    this.dirX = dirX;
    this.dirY = dirY;
  }

  public getName = () => this.name;
  public getDirX = () => this.dirX;
  public getDirY = () => this.dirY;
  public getAngle1 = () => this.angle1;
  public getAngle2 = () => this.angle2;

  public equals = (dir: Direction) => {
    return JSON.stringify(this) == JSON.stringify(dir);
  };
}
