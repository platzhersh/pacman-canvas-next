import { Game } from "./Game";
import { onDocumentReady } from "./eventCallbacks/onDocumentReady";
import $ from "jquery";

export const runPacman = () => {
  const game = new Game();

  game.buildWalls();

  $(document).ready(onDocumentReady(game, game.getPacman()));
};
