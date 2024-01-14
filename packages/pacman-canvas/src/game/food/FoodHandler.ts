import { inkySvgSrc } from "../../assets/img";
import { cherriesSvgSrc } from "../../assets/img/gastronomy";
import { PACMAN_RADIUS } from "../../figures/Pacman";

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
      posX * 30,
      posY * 30,
      2 * PACMAN_RADIUS,
      2 * PACMAN_RADIUS
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
    posX * 30,
    posY * 30,
    2 * PACMAN_RADIUS,
    2 * PACMAN_RADIUS
  );
};
