import { Game } from "./Game";

let game: Game | null = null;

export const getGameInstance = () => {
  if (!game) {
    game = new Game();
  }
  return game;
};

export { Game };
