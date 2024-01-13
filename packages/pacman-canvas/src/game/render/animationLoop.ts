import { Game } from "../Game";
import { renderContent } from "./render";

export const animationLoop = (game: Game, canvas: HTMLCanvasElement) => {
  // if (gameOver) return;

  const context = canvas.getContext("2d")!;
  const pacman = game.getPacman();

  // enable next line to show grid
  // renderGrid(pacman.radius, "red");
  renderContent(game, context);

  // if (game.dieAnimation == 1) pacman.dieAnimation(game);
  if (!game.isPaused()) {
    // Make changes before next loop
    pacman.move(game);
    pacman.eat();
    pacman.checkDirectionChange(game);
    pacman.checkCollisions(game); // has to be the LAST method called on pacman

    game.moveGhosts();

    game.checkGhostMode();

    // All dots collected?
    game.checkForLevelUp();
  }

  //requestAnimationFrame(animationLoop);
  setTimeout(animationLoop, game.getRefreshRate());
};
