import { generateUID } from "../../utils/uuid";
import { GRID_SIZE } from "../Game";
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
    this.posX = gridPosX * GRID_SIZE;
    this.posY = gridPosY * GRID_SIZE;
  }

  public getGridPosX = () => this.posX / GRID_SIZE;
  public getGridPosY = () => this.posY / GRID_SIZE;

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
