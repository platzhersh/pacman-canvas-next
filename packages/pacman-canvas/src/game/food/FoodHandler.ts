import { inkySvgSrc } from "../../assets/img";
import { cherriesSvgSrc } from "../../assets/img/gastronomy";
import { GRID_SIZE } from "../Game";

export type FoodConfig = {
  name: string;
  imageSrc: string;
  score: number;
};

export const foodConfig = {
  name: "cherries",
  imageSrc: cherriesSvgSrc,
  score: 300,
};

export class FoodHandler {
  constructor() {}

  public magic = (
    context: CanvasRenderingContext2D,
    posX: number,
    posY: number
  ) => {
    // context.save();
    const cherriesImg = new Image();
    console.log("magic", posX, posY);
    cherriesImg.src = inkySvgSrc;
    context.drawImage(
      cherriesImg,
      posX * GRID_SIZE,
      posY * GRID_SIZE,
      GRID_SIZE,
      GRID_SIZE
    );
  };
}

export const drawCherries = (
  context: CanvasRenderingContext2D,
  posX: number,
  posY: number,
  img: HTMLImageElement
) => {
  //   const cherriesImg = new Image();
  //   cherriesImg.src = inkySvgSrc;
  context.drawImage(
    img,
    posX * GRID_SIZE,
    posY * GRID_SIZE,
    GRID_SIZE,
    GRID_SIZE
  );
};
