import Logger from "js-logger";
import { Game } from "../Game";

export const animationLoop = (game: Game) => () => {
  if (game.isGameOver() || !game.isStarted()) return;

  Logger.debug("animationLoop", game);
  // render on Canvas
  game.render();

  // if (game.dieAnimation == 1) pacman.dieAnimation(game);
  if (!game.isPaused()) {
    // const context = canvas.getContext("2d")!;
    const pacman = game.getPacman();
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
  setTimeout(animationLoop(game), game.getRefreshRate());
};
