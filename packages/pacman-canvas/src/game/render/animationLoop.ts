import { Game } from "../Game";
import { renderContent, renderGrid } from "./render";

export const animationLoop = (game: Game) => () => {
  if (game.isGameOver()) return;

  console.log("animationLoop", game);

  // const context = canvas.getContext("2d")!;
  const pacman = game.getPacman();

  // enable next line to show grid
  if (game.isGridVisible()) renderGrid(game, pacman.getRadius(), "red");
  renderContent(game);

  // if (game.dieAnimation == 1) pacman.dieAnimation(game);
  if (!game.isPaused()) {
    console.log("move");
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
