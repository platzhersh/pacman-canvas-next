import { cherriesSvgSrc } from "../../assets/img/gastronomy";
import { PACMAN_RADIUS } from "../../figures/Pacman";
import { Game, PILL_SIZE, POWERPILL_SIZE } from "../Game";
import { Food } from "../food/Food";
import { MapColumn } from "../map/mapData";

export const buildWall = (
  context: CanvasRenderingContext2D,
  gridX: number,
  gridY: number,
  width: number,
  height: number
) => {
  width = width * 2 - 1;
  height = height * 2 - 1;
  context.fillRect(
    PACMAN_RADIUS / 2 + gridX * 2 * PACMAN_RADIUS,
    PACMAN_RADIUS / 2 + gridY * 2 * PACMAN_RADIUS,
    width * PACMAN_RADIUS,
    height * PACMAN_RADIUS
  );
};

const drawPill = (
  game: Game,
  context: CanvasRenderingContext2D,
  column: MapColumn,
  dotPosY: number,
  pillSize: number
) => {
  context.arc(
    game.toPixelPos(column.col - 1) + PACMAN_RADIUS,
    game.toPixelPos(dotPosY - 1) + PACMAN_RADIUS,
    pillSize,
    0 * Math.PI,
    2 * Math.PI
  );
  context.moveTo(game.toPixelPos(column.col - 1), game.toPixelPos(dotPosY - 1));
};

export const clearCanvas = (context: CanvasRenderingContext2D) => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
};

export const renderContent = (
  game: Game
  // canvas_walls: HTMLCanvasElement
) => {
  const context = game.getCanvasContext2d();
  console.trace("renderContent", context, game);

  if (!context) {
    console.error("can't render, no context");
    return;
  }

  // Pills
  context.beginPath();
  context.fillStyle = "White";
  context.strokeStyle = "White";

  let dotPosY: number;
  game
    .getGridMap()
    .getMapData()
    .posY.forEach((row) => {
      dotPosY = row.row;
      row.posX.forEach((column) => {
        if (column.type === "⚪️") {
          drawPill(game, context, column, dotPosY, PILL_SIZE);
        }
        if (column.type === "💊") {
          drawPill(game, context, column, dotPosY, POWERPILL_SIZE);
        }
        if (column.type === "🍒") {
          // TODO: this doesn't work as supposed yet
          context.fill();
          context.closePath();
          context.beginPath();
          context.fillStyle = "red";
          context.strokeStyle = "red";
          drawPill(game, context, column, dotPosY, POWERPILL_SIZE);

          context.closePath();
          context.fill();

          const cherry = new Food(
            "cherries",
            300,
            cherriesSvgSrc,
            column.col - 1,
            dotPosY - 1
          );
          cherry.draw(context);

          context.beginPath();
          context.fillStyle = "White";
          context.strokeStyle = "White";
        }
      });
    });

  context.fill();

  // Walls
  // TODO: necessary?
  // context.drawImage(canvas_walls, 0, 0);

  if (game.isStarted()) {
    // Ghosts
    Object.values(game.getGhosts()).forEach((ghost) =>
      ghost.draw(game, context)
    );

    // Pac Man
    game.getPacman().draw(context);
  }
};

export const highlightGridFields = (
  context: CanvasRenderingContext2D,
  fields: { posX: number; posY: number }[],
  color?: string
) => {
  fields.forEach((f) => highlightGridField(context, f.posX, f.posY, color));
};

export const highlightGridField = (
  context: CanvasRenderingContext2D,
  gridPosX: number,
  gridPosY: number,

  color?: string
) => {
  context.save();
  context.lineWidth = 2;
  context.strokeStyle = color ?? "Yellow";

  context.beginPath();
  context.moveTo(gridPosX * 30, gridPosY * 30);
  context.lineTo(gridPosX * 30 + 30, gridPosY * 30);
  context.lineTo(gridPosX * 30 + 30, gridPosY * 30 + 30);
  context.lineTo(gridPosX * 30, gridPosY * 30 + 30);
  context.lineTo(gridPosX * 30, gridPosY * 30);
  context.closePath();
  context.stroke();
};

// TODO: only for debugging
export const renderGrid = (
  game: Game,
  gridPixelSize: number,
  color: string
) => {
  const context = game.getCanvasContext2d();

  if (!context) {
    console.error("can't render, no context");
    return;
  }

  context.save();
  context.lineWidth = 0.5;
  context.strokeStyle = color;

  const height = context.canvas.height;
  const width = context.canvas.width;

  // horizontal grid lines
  for (let i = 0; i <= height; i = i + gridPixelSize) {
    context.beginPath();
    context.moveTo(0, i);
    context.lineTo(width, i);
    context.closePath();
    context.stroke();
  }

  // vertical grid lines
  for (let i = 0; i <= width; i = i + gridPixelSize) {
    context.beginPath();
    context.moveTo(i, 0);
    context.lineTo(i, height);
    context.closePath();
    context.stroke();
  }

  context.restore();
};
