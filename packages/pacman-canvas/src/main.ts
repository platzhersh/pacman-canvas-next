/*-------------------------------------------------------------------

	___________    ____   _____ _____    ____  
	\____ \__  \ _/ ___\ /     \\__  \  /    \ 
	|  |_> > __ \\  \___|  Y Y  \/ __ \|   |  \
	|   __(____  /\___  >__|_|  (____  /___|  /
	|__|       \/     \/      \/     \/     \/ .platzh1rsch.ch
	
	author: platzh1rsch		(www.platzh1rsch.ch)
	
-------------------------------------------------------------------*/

import { Game } from "./game/Game";
import { getGameInstance } from "./game/main";

export const helloPacman = () => {
  return "Hello Pacman";
};

export { Game, getGameInstance };

export default getGameInstance;
