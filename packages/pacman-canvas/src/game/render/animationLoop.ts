import { Game } from "../Game";

export const animationLoop = (game: Game) => () => {
  if (game.isGameOver()) return;

  console.trace("animationLoop", game);

  // const context = canvas.getContext("2d")!;
  const pacman = game.getPacman();

  // render on Canvas
  game.render();

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
  setTimeout(animationLoop(game), game.getRefreshRate());
};
