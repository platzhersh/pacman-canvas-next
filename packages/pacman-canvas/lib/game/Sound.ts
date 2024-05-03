import Logger from "js-logger";
import { Game } from "./Game";

export const Sound = {
  play: (game: Game, sound: string) => {
    if (game.isSoundEnabled()) {
      let audio = document.getElementById(sound);
      audio !== null
        ? (audio as any).play()
        : Logger.warn(sound + " not found");
    }
  },
};
