import { PACMAN_RADIUS } from "../game/Game";
import { Figure } from "./Figure";

class FigureImpl extends Figure {
  public checkDirectionChange = (game: any) => {};
  constructor() {
    super();
    this.radius = PACMAN_RADIUS;
  }
}

describe("Figure", () => {
  let game: any;
  let figure: FigureImpl;

  beforeEach(() => {
    game = {
      getCanvasWidth: () => 540,
      getCanvasHeight: () => 390,
    };
    figure = new FigureImpl();
  });

  test("should adjust position if out of canvas on the right", () => {
    const posX = game.getCanvasWidth() + figure.getRadius() + 1;
    const posY = 0;
    figure.setPosition(posX, posY);
    figure.checkAndAdjustOutOfCanvas(game);

    expect(figure.getPosX()).toBeLessThan(posX);
    expect(figure.getPosX()).toBeLessThan(game.getCanvasWidth());
    expect(figure.getPosX()).toEqual(posX - game.getCanvasWidth());
  });
  test("should adjust position if out of canvas on the left", () => {
    const posX = -figure.getRadius() - 1;
    const posY = 0;
    figure.setPosition(posX, posY);
    figure.checkAndAdjustOutOfCanvas(game);

    expect(figure.getPosX()).toBeGreaterThan(posX);
    expect(figure.getPosX()).toBeGreaterThanOrEqual(0);
    expect(figure.getPosX()).toEqual(game.getCanvasWidth() + posX);
  });

  test("should adjust position if out of canvas at the bottom", () => {
    const posX = 0;
    const posY = game.getCanvasHeight() + figure.getRadius() + 1;
    figure.setPosition(posX, posY);
    figure.checkAndAdjustOutOfCanvas(game);

    expect(figure.getPosY()).toBeLessThan(posY);
    expect(figure.getPosY()).toBeLessThan(game.getCanvasHeight());
    expect(figure.getPosY()).toEqual(posY - game.getCanvasHeight());
  });

  test("should adjust position if out of canvas at the top", () => {
    const posX = 0;
    const posY = -figure.getRadius() - 1;
    figure.setPosition(posX, posY);
    figure.checkAndAdjustOutOfCanvas(game);

    expect(figure.getPosY()).toBeGreaterThanOrEqual(0);
    expect(figure.getPosY()).toEqual(game.getCanvasHeight() + posY);
  });
});