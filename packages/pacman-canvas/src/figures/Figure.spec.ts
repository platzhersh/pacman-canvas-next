import { GRID_SIZE, PACMAN_RADIUS } from "../game/Game";
import { Figure, isInRange } from "./Figure";
import { down, left, right, up } from "./directions";

class FigureImpl extends Figure {
  public checkDirectionChange = (game: any) => {};
  constructor() {
    super();
    this.radius = PACMAN_RADIUS;
  }
}

describe("isInRange", () => {
  test("should return true when x is equal to min", () => {
    expect(isInRange(5, 5, 10)).toEqual(true);
  });

  test("should return true when x is equal to max", () => {
    expect(isInRange(10, 5, 10)).toEqual(true);
  });

  test("should return true when x is between min and max", () => {
    expect(isInRange(7, 5, 10)).toEqual(true);
  });

  test("should return false when x is less than min", () => {
    expect(isInRange(4, 5, 10)).toEqual(false);
  });

  test("should return false when x is greater than max", () => {
    expect(isInRange(11, 5, 10)).toEqual(false);
  });
});

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

  describe("advance", () => {
    test("should advance position correctly in positive x direction (right)", () => {
      figure.setSpeed(5);
      figure.setDirection(right);
      figure.setPosition(0, 0);
      figure.advancePosition();

      expect(figure.getPosX()).toEqual(5);
      expect(figure.getPosY()).toEqual(0);
    });

    test("should advance position correctly in negative x direction (left)", () => {
      figure.setSpeed(5);
      figure.setDirection(left);
      figure.setPosition(10, 10);
      figure.advancePosition();

      expect(figure.getPosX()).toEqual(5);
      expect(figure.getPosY()).toEqual(10);
    });

    test("should advance position correctly in positive y directio (down)n", () => {
      figure.setSpeed(5);
      figure.setDirection(down);
      figure.setPosition(0, 0);
      figure.advancePosition();

      expect(figure.getPosX()).toEqual(0);
      expect(figure.getPosY()).toEqual(5);
    });

    test("should advance position correctly in negative y direction (up)", () => {
      figure.setSpeed(5);
      figure.setDirection(up);
      figure.setPosition(10, 10);
      figure.advancePosition();

      expect(figure.getPosX()).toEqual(10);
      expect(figure.getPosY()).toEqual(5);
    });
  });

  describe("out of canvas", () => {
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

  describe("inGrid", () => {
    test("should return true when posX and posY are multiples of GRID_SIZE", () => {
      figure.setPosition(GRID_SIZE * 2, GRID_SIZE * 3);
      expect(figure.inGrid()).toEqual(true);
    });

    test("should return false when posX is not a multiple of GRID_SIZE", () => {
      figure.setPosition(GRID_SIZE * 2 + 1, GRID_SIZE * 3);
      expect(figure.inGrid()).toEqual(false);
    });

    test("should return false when posY is not a multiple of GRID_SIZE", () => {
      figure.setPosition(GRID_SIZE * 2, GRID_SIZE * 3 + 1);
      expect(figure.inGrid()).toEqual(false);
    });

    test("should return false when neither posX nor posY are multiples of GRID_SIZE", () => {
      figure.setPosition(GRID_SIZE * 2 + 1, GRID_SIZE * 3 + 1);
      expect(figure.inGrid()).toEqual(false);
    });
  });
});
