import { down, left, right, up } from "../directions";
import { Direction } from "../directions/Direction";

export class GhostImageSprite {
  private default: HTMLImageElement = new Image();
  private left: HTMLImageElement = new Image();
  private right: HTMLImageElement = new Image();
  private up: HTMLImageElement = new Image();
  private down: HTMLImageElement = new Image();

  constructor(
    defaultSrc: string,
    leftSrc: string,
    rightSrc: string,
    upSrc: string,
    downSrc: string
  ) {
    this.default.src = defaultSrc;
    this.left.src = leftSrc;
    this.right.src = rightSrc;
    this.up.src = upSrc;
    this.down.src = downSrc;
  }

  public draw = (
    context: CanvasRenderingContext2D,
    posX: number,
    posY: number,
    dirX: number,
    dirY: number,
    width: number,
    height: number
  ) => {
    const image = this.getImage(dirX, dirY);

    context.drawImage(image, posX, posY, width, height);
  };

  private getImage = (dirX: number, dirY: number) => {
    if (left.dirEquals(dirX, dirY)) return this.left;
    if (right.dirEquals(dirX, dirY)) return this.right;
    if (up.dirEquals(dirX, dirY)) return this.up;
    if (down.dirEquals(dirX, dirY)) return this.down;
    return this.default;
  };
}
