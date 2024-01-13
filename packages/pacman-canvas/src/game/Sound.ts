import { Game } from "./Game";

export const Sound = {
  play: (game: Game, sound: string) => {
    if (game.isSoundEnabled()) {
      let audio = document.getElementById(sound);
      audio !== null
        ? (audio as any).play()
        : console.log(sound + " not found");
    }
  },
};
