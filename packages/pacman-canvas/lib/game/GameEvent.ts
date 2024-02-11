import { GhostMode } from "../figures/ghosts/Ghost";

export type GameStateChangeListener = (event: GameStateEvent) => any;

export type GameState = {
  gameId: string;
  started: boolean;
  pause: boolean;
  gameOver: boolean;
  score: number;
  pillCount: number;
  level: number;
  lives: number;
  ghostMode: GhostMode;
};

export type GameStateEvent = {
  datetime: Date;
  eventName: string;
  payload: GameState;
};

export type GameOverlayMessageListener = (
  event: GameOverlayMessageEvent
) => any;

export type GameOverlayMessageEvent = {
  title: string;
  text: string;
  text2?: string;
};

/**
 * Dummy game event for testing and debugging
 */
export const dummyGameEvent: GameStateEvent = {
  datetime: new Date(),
  eventName: "dummy",
  payload: {
    gameId: "dummy",
    started: false,
    pause: true,
    gameOver: false,
    score: 0,
    pillCount: 0,
    level: 0,
    lives: 0,
    ghostMode: 0,
  },
};
