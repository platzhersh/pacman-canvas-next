import { down, left, right, up } from "../../figures/directions";
import { Game } from "../Game";

export const onKeyDown = (game: Game) => (evt: KeyboardEvent) => {
  const pacman = game.getPacman();

  switch (evt.keyCode) {
    case 38: // UP Arrow Key pressed
      evt.preventDefault();
    case 87: // W pressed
      pacman.getDirectionWatcher().set(up);
      break;
    case 40: // DOWN Arrow Key pressed
      evt.preventDefault();
    case 83: // S pressed
      pacman.getDirectionWatcher().set(down);
      break;
    case 37: // LEFT Arrow Key pressed
      evt.preventDefault();
    case 65: // A pressed
      pacman.getDirectionWatcher().set(left);
      break;
    case 39: // RIGHT Arrow Key pressed
      evt.preventDefault();
    case 68: // D pressed
      pacman.getDirectionWatcher().set(right);
      break;
    case 78: // N pressed
      game.setPause(true);
      game.newGame();
      break;
    case 77: // M pressed
      game.toggleSound();
      break;
    case 8: // Backspace pressed -> show Game Content
    case 27: // ESC pressed -> show Game Content
      evt.preventDefault();
      game.showContent("game-content");
      break;
    case 32: // SPACE pressed -> pause / resume Game
      console.debug("SPACE pressed");
      evt.preventDefault();
      if (!game.isGameOver) game.pauseResume();
      break;
  }
};
