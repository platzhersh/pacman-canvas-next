import { Game } from "@repo/pacman-canvas";

let game: Game | null = null;

export const getGameInstance = () => {
  if (!game) {
    game = new Game();
  }
  return game;
};
