import {
  appleSvgSrc,
  cherriesSvgSrc,
  friesSvgSrc,
  strawberrySvgSrc,
} from "../../assets/img/gastronomy";

export class FoodHandler {
  private cherryImage: HTMLImageElement = new Image();
  private strawberryImage: HTMLImageElement = new Image();
  private friesImage: HTMLImageElement = new Image();
  private appleImage: HTMLImageElement = new Image();

  private currentFoodImage: HTMLImageElement = this.cherryImage;

  constructor() {
    this.cherryImage.src = cherriesSvgSrc;
    this.strawberryImage.src = strawberrySvgSrc;
    this.friesImage.src = friesSvgSrc;
    this.appleImage.src = appleSvgSrc;

    this.shuffle();
  }

  public shuffle = () => {
    this.currentFoodImage = this.getRandomFoodImage();
  };

  private getRandomFoodImage = (): HTMLImageElement => {
    const random = Math.random();
    if (random < 0.25) return this.cherryImage;
    if (random < 0.5) return this.strawberryImage;
    if (random < 0.75) return this.friesImage;
    return this.appleImage;
  };

  public draw = (
    context: CanvasRenderingContext2D,
    posX: number,
    posY: number,
    width: number,
    height: number
  ) => {
    context.drawImage(this.currentFoodImage, posX, posY, width, height);
  };
}
