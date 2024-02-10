import { Direction } from "./Direction";

export const ANGLE_DIFF = 0.7;

export const ANGLE1_UP = 1.75;
export const ANGLE2_UP = 1.25;

export const ANGLE1_LEFT = 1.25;
export const ANGLE2_LEFT = 0.75;

export const ANGLE1_DOWN = 0.75;
export const ANGLE2_DOWN = 0.25;

export const ANGLE1_RIGHT = 0.25;
export const ANGLE2_RIGHT = 1.75;

export const up = new Direction("up", ANGLE1_UP, ANGLE2_UP, 0, -1); // UP
export const left = new Direction("left", ANGLE1_LEFT, ANGLE2_LEFT, -1, 0); // LEFT
export const down = new Direction("down", ANGLE1_DOWN, ANGLE2_DOWN, 0, 1); // DOWN
export const right = new Direction("right", ANGLE1_RIGHT, ANGLE2_RIGHT, 1, 0); // RIGHT
