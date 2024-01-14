import { generateUID } from "../../utils/uuid";
import { highlightGridField } from "../render/render";

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
    gridPosX: number,
    gridPosY: number
  ) {
    this.name = name;
    this.score = score;
    this.image = new Image();
    this.image.src = imageSrc;
    this.posX = gridPosX * 30;
    this.posY = gridPosY * 30;
  }

  public getGridPosX = () => this.posX / 30;
  public getGridPosY = () => this.posY / 30;

  public draw = (context: CanvasRenderingContext2D) => {
    console.log(
      "Food draw",
      this.image,
      this.posX,
      this.posY,
      this.radius,
      this.getGridPosX(),
      this.getGridPosY()
    );
    context.drawImage(
      this.image,
      this.posX,
      this.posY,
      2 * this.radius,
      2 * this.radius
    );
    highlightGridField(
      context,
      this.getGridPosX(),
      this.getGridPosY(),
      "orange"
    );
  };
}
