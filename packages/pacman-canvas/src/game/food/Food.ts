import { generateUID } from "../../utils/uuid";

export class Food {
  private id: string = generateUID();
  private name: string;
  private score: number;
  private image: HTMLImageElement;
  private posX: number;
  private posY: number;
  private radius: number = 50;

  constructor(
    name: string,
    score: number,
    imageSrc: string,
    posX: number,
    posY: number
  ) {
    this.name = name;
    this.score = score;
    this.image = new Image();
    this.image.src = imageSrc;
    this.posX = posX;
    this.posY = posY;
  }

  public draw = (context: CanvasRenderingContext2D) => {
    context.drawImage(
      this.image,
      this.posX,
      this.posY,
      2 * this.radius,
      2 * this.radius
    );
  };
}
