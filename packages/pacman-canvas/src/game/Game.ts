import { PACMAN_RADIUS, Pacman } from "../figures/Pacman";
import { Direction } from "../figures/directions/Direction";
import { Blinky } from "../figures/ghosts/Blinky";
import { Clyde } from "../figures/ghosts/Clyde";
import { GhostMode, GhostRegistry } from "../figures/ghosts/Ghost";
import { Inky } from "../figures/ghosts/Inky";
import { Pinky } from "../figures/ghosts/PInky";
import { generateUID } from "../utils/uuid";
import { Score } from "./Score";
import { Timer } from "./Timer";
import { onKeyDown } from "./eventCallbacks/onKeyDown";
import { GridMap } from "./map/GridMap";
import { MapTileType } from "./map/mapData";
import { animationLoop } from "./render/animationLoop";
import { buildWall, clearCanvas, renderGrid } from "./render/render";
import { renderContent } from "./render/render";

// global constants
const FINAL_LEVEL = 10;
export const PILL_POINTS = 10;
export const POWERPILL_POINTS = 50;
export const GHOST_POINTS = 100;
const HIGHSCORE_ENABLED = true;

export const PILL_SIZE = 3;
export const POWERPILL_SIZE = 6;

type GameInitMode = "NewGame" | "NewLevel";

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
export class Game {
  private gameId: string = generateUID();
  public getId = () => this.gameId;

  private timer = new Timer(); // TODO: implememnt properly, and submit with highscore
  private refreshRate = 33; // speed of the game, will increase in higher levels

  private started = false; // TODO: what's the purpose of this exactly?
  private pause = true;
  private gameOver = false;

  private score = new Score();
  private soundfx: boolean = false;
  private showGrid: boolean = false;
  private gridMap: GridMap = new GridMap();
  private pillCount: number = 0; // number of pills

  private level = 1;

  private canvasContext2d: CanvasRenderingContext2D | null = null;
  private wallColor = "Blue";

  // global pill states
  private pillSize = PILL_SIZE;
  private powerpillSizeMin = 2;
  private powerpillSizeMax = POWERPILL_SIZE;
  private powerpillSizeCurrent = this.powerpillSizeMax;
  private powerPillAnimationCounter = 0;

  // TODO: vibrant power pills
  public nextPowerPillSize = () => {
    /*if (this.powerPillAnimationCounter === 3) {
				this.powerPillAnimationCounter = 0;
				this.powerpillSizeCurrent = this.powerpillSizeMin + this.powerpillSizeCurrent % (this.powerpillSizeMax-this.powerpillSizeMin);
			} else {
				this.powerPillAnimationCounter++;
			}*/
    return this.powerpillSizeCurrent;
  };

  // pacman
  private pacman = new Pacman();
  public getPacman = () => this.pacman;

  // global ghost states
  private ghosts: GhostRegistry;
  private ghostFrightened = false;
  private ghostFrightenedTimer = 240;
  private ghostMode: GhostMode = GhostMode.Scatter; // 0 = Scatter, 1 = Chase
  private ghostModeTimer = 200; // decrements each animationLoop execution

  constructor(canvasContext2d?: CanvasRenderingContext2D) {
    if (canvasContext2d) this.canvasContext2d = canvasContext2d;
    this.ghosts = {
      pinky: new Pinky(this),
      inky: new Inky(this),
      clyde: new Clyde(this),
      blinky: new Blinky(this),
    };
    this.init("NewGame");
    this.registerKeyListener();
  }

  /* Game Functions */
  public toggleGridVisibility = () => (this.showGrid = !this.showGrid);
  public isGridVisible = () => this.showGrid;

  public getGhosts = () => this.ghosts;
  public resetGhosts = () =>
    Object.values(this.ghosts).forEach((g) => g.reset(this));
  public startGhosts = () =>
    Object.values(this.ghosts).forEach((g) => g.start());
  public dazzleGhosts = () =>
    Object.values(this.ghosts).forEach((g) => g.dazzle(this));
  public undazzleGhosts = () =>
    Object.values(this.ghosts).forEach((g) => g.undazzle(this));
  public moveGhosts = () =>
    Object.values(this.ghosts).forEach((g) => g.move(this));

  public startGhostFrightened = () => {
    console.debug("ghost frigthened 👻");
    this.ghostFrightened = true;
    this.ghostFrightenedTimer = 240;
    this.dazzleGhosts();
  };

  public getRegularGhostSpeed = () => (this.level > 4 ? 3 : 2);
  public getDazzledGhostSpeed = () => 2;

  public endGhostFrightened = () => {
    this.ghostFrightened = false;
    this.undazzleGhosts();
  };

  public getGhostMode = () => this.ghostMode;

  public toggleTargetVisualisations = () =>
    Object.values(this.getGhosts()).forEach((ghost) =>
      ghost.toggleDirectionOptionsVisualizations()
    );

  public checkGhostMode = (): void => {
    if (this.ghostFrightened) {
      this.ghostFrightenedTimer--;
      if (this.ghostFrightenedTimer === 0) {
        this.endGhostFrightened();
        this.ghostFrightenedTimer = 240;
        /*inky.reverseDirection();
					pinky.reverseDirection();
					clyde.reverseDirection();
					blinky.reverseDirection();*/
      }
    }
    // always decrement ghostMode timer
    this.ghostModeTimer--;
    if (this.ghostModeTimer === 0 && this.level > 1) {
      this.ghostMode ^= 1;
      this.ghostModeTimer = 200 + this.ghostMode * 450;

      this.onGameStateChange("ghostModeChanged");

      Object.values(this.getGhosts()).forEach((g) => g.reverseDirection());
    }
  };

  public getCanvasWidth = (): number => {
    const width = this.canvasContext2d?.canvas.width;
    if (!width) throw Error("No canvas width");
    return width;
  };
  public getCanvasHeight = (): number => {
    const height = this.canvasContext2d?.canvas.height;
    if (!height) throw Error("No canvas height");
    return height;
  };
  public getGridMap = () => this.gridMap;
  public getMapContent = (x: number, y: number) => {
    return this.gridMap.getTileType(x, y);
  };

  public setMapContent = (x: number, y: number, val: MapTileType) => {
    this.gridMap.setTileType(x, y, val);
  };

  public isSoundEnabled = () => this.soundfx;
  public toggleSound = () => {
    this.soundfx = !this.soundfx;
  };

  // TODO: test
  public reset = () => {
    this.score.set(0);
    this.pacman.resetLives();
    this.level = 1;

    this.pause = false;
    this.gameOver = false;

    this.onGameStateChange("reset");
  };

  public getRefreshRate = () => this.refreshRate;

  public setCanvasContext2d = (canvasContext2d: CanvasRenderingContext2D) => {
    console.debug("set canvas context");
    this.canvasContext2d = canvasContext2d;
    this.render();
  };
  public getCanvasContext2d = () => this.canvasContext2d;

  public newGame = () => {
    const r = confirm("Are you sure you want to restart?");
    if (r) {
      console.log("new Game");
      this.init("NewGame");
      this.forceResume();
    }
  };

  public nextLevel = () => {
    console.debug(
      `nextLevel: ${this.level + 1} current: ${
        this.level
      }, final: ${FINAL_LEVEL}`
    );
    if (this.level === FINAL_LEVEL) {
      console.debug("next level, " + FINAL_LEVEL + ", end game");
      this.endGame(true);
      //   this.showHighscoreForm();
    } else {
      this.level++;
      console.debug("🏁 Level " + this.level);
      this.pauseAndShowMessage(
        "Level " + this.level,
        this.getLevelTitle() + "<br/>(Click to continue!)"
      );
      this.init("NewLevel");
    }
  };

  public showContent = (id: string) => {};

  public getLevel = () => this.level;
  public getLevelTitle = () => {
    switch (this.level) {
      case 2:
        return '"The chase begins"';
      // activate chase / scatter switching
      case 3:
        return '"Inkys awakening"';
      // Inky starts leaving the ghost house
      case 4:
        return '"Clydes awakening"';
      // Clyde starts leaving the ghost house
      case 5:
        return '"need for speed"';
      // All the ghosts get faster from now on
      case 6:
        return '"hunting season 1"';
      // TODO: No scatter mood this time
      case 7:
        return '"the big calm"';
      // TODO: Only scatter mood this time
      case 8:
        return '"hunting season 2"';
      // TODO: No scatter mood and all ghosts leave instantly
      case 9:
        return '"ghosts on speed"';
      // TODO: Ghosts get even faster for this level
      case FINAL_LEVEL:
        return '"The final chase"';
      // TODO: Ghosts get even faster for this level
      default:
        return '"nothing new"';
    }
  };

  public setPause = (val: boolean) => {
    this.pause = val;
    this.onGameStateChange("setPause");
  };

  public pauseAndShowMessage = (title: string, text: string) => {
    this.timer.stop();
    this.pause = true;
    // this.showMessage(title, text);
    this.onGameStateChange("PauseAndShowMessage");
  };

  public validateScoreWithLevel = () => {
    const maxLevelPointsPills = 104 * PILL_POINTS;
    const maxLevelPointsPowerpills = 4 * POWERPILL_POINTS;
    const maxLevelPointsGhosts = 4 * 4 * GHOST_POINTS;
    const maxLevelPoints =
      maxLevelPointsPills + maxLevelPointsPowerpills + maxLevelPointsGhosts;

    const scoreIsValid = this.score.get() / this.level <= maxLevelPoints;
    console.debug(
      "validate score. score: " + this.score.get() + ", level: " + this.level,
      scoreIsValid
    );
    return scoreIsValid;
  };

  public getScore = () => this.score.get();
  public addScore = (score: number) => {
    this.score.add(score);
    this.onGameStateChange("addScore");
  };

  /* game controls */

  /**
   *
   */
  public startGame = () => {
    // start timer
    this.timer.start();

    this.pause = false;
    this.started = true;
    console.log("🚀 Game started!");
    console.debug("🏁 Level " + this.level);
    this.onGameStateChange("forceStartAnimationLoop");

    animationLoop(this)();
  };

  public isStarted = () => this.started;
  public isPaused = () => this.pause;
  public isGameOver = () => this.gameOver;

  public forcePause = () => {
    this.timer.stop();
    this.pauseAndShowMessage("Pause", "Click to Resume");
  };

  public forceResume = () => {
    this.pause = false;
    this.timer.start();
    this.onGameStateChange("ForceResume");
  };

  public pauseResume = () => {
    if (this.gameOver) {
      console.warn("Cannot pause / resume. GameOver set to true.");
      return;
    }
    if (!this.started) {
      this.startGame();
    } else if (this.pause) {
      this.forceResume();
    } else {
      this.pauseAndShowMessage("Pause", "Click to Resume");
    }
  };

  public getPillCount = () => this.getGridMap().getTileTypeCount("⚪️");
  public decrementPillCount = () => this.pillCount--;

  public init = (state: GameInitMode) => {
    console.debug("init game " + state);

    // get Level Map
    this.gridMap.resetMapData();
    this.pillCount = this.getPillCount();

    // TODO: why are there 2 state checks?
    if (state === "NewGame") {
      this.timer.reset();
      this.reset();
    }
    this.pacman.reset();

    // this.drawHearts(this.pacman.getLives());

    this.ghostFrightened = false;
    this.ghostFrightenedTimer = 240;
    this.ghostMode = GhostMode.Scatter; // 0 = Scatter, 1 = Chase
    this.ghostModeTimer = 200; // decrements each animationLoop execution

    this.onGameStateChange(`Init${state}`);

    // initalize Ghosts, avoid memory flooding
    this.resetGhosts();
    this.startGhosts();
  };

  public checkForLevelUp = () => {
    if (this.pillCount === 0 && this.started) {
      this.nextLevel();
    }
  };

  public endGame = (allLevelsCompleted = false) => {
    console.info(
      "❌ Game Over by " + (allLevelsCompleted ? "WIN 🏆" : "LOSS 💀")
    );
    this.pause = true;
    this.gameOver = true;
    this.onGameStateChange("EndGame");
  };

  public toPixelPos = (gridPos: number) => {
    return gridPos * 30;
  };

  public toGridPos = (pixelPos: number) => {
    return (pixelPos % 30) / 30;
  };

  // Player Control API
  public setPacmanDirection = (direction: Direction) => {
    this.pacman.getDirectionWatcher().set(direction);
  };

  public getGameStateSnapshot = (): GameState => {
    return {
      gameId: this.gameId,
      started: this.started,
      pause: this.pause,
      gameOver: this.gameOver,
      score: this.score.get(),
      pillCount: this.pillCount,
      level: this.level,
      lives: this.pacman.getLives(),
      ghostMode: this.ghostMode,
    };
  };

  public onGameStateChange = (eventName: string) => {
    console.log("onGameStateChange", eventName);
    const payload = this.getGameStateSnapshot();
    this.gameStateChangeListeners.forEach((listenerFn) =>
      listenerFn({ eventName, datetime: new Date(), payload })
    );
  };

  private gameStateChangeListeners: GameStateChangeListener[] = [];

  public registerGameStateChangeListener = (
    listenerFn: GameStateChangeListener
  ) => {
    this.gameStateChangeListeners.push(listenerFn);
  };

  public registerKeyListener = () => {
    window.addEventListener("keydown", onKeyDown(this), true);
  };

  public render = () => {
    const context = this.getCanvasContext2d();

    if (!context) {
      console.error("can't render, no context");
      return;
    }

    clearCanvas(context);
    this.buildWalls();
    if (this.isGridVisible()) renderGrid(this, PACMAN_RADIUS, "red");
    renderContent(this);
  };

  /* ------------ Start Pre-Build Walls  ------------ */
  /**
   * TODO: move to render?
   * TODO: does not change in re-renderings, so it would be nice to only draw this once
   */
  public buildWalls = () => {
    if (this.ghostMode === GhostMode.Scatter) this.wallColor = "Blue";
    else this.wallColor = "Red";

    if (!this.canvasContext2d) {
      throw Error("No context found to draw on");
    }

    const context_walls = this.canvasContext2d;

    context_walls.fillStyle = this.wallColor;
    context_walls.strokeStyle = this.wallColor;

    //horizontal outer
    buildWall(context_walls, 0, 0, 18, 1);
    buildWall(context_walls, 0, 12, 18, 1);

    // vertical outer
    buildWall(context_walls, 0, 0, 1, 6);
    buildWall(context_walls, 0, 7, 1, 6);
    buildWall(context_walls, 17, 0, 1, 6);
    buildWall(context_walls, 17, 7, 1, 6);

    // ghost base
    buildWall(context_walls, 7, 4, 1, 1);
    buildWall(context_walls, 6, 5, 1, 2);
    buildWall(context_walls, 10, 4, 1, 1);
    buildWall(context_walls, 11, 5, 1, 2);
    buildWall(context_walls, 6, 6, 6, 1);

    // ghost base door
    context_walls?.fillRect(
      8 * 2 * PACMAN_RADIUS,
      PACMAN_RADIUS / 2 + 4 * 2 * PACMAN_RADIUS + 5,
      4 * PACMAN_RADIUS,
      1
    );

    // single blocks
    buildWall(context_walls, 4, 0, 1, 2);
    buildWall(context_walls, 13, 0, 1, 2);

    buildWall(context_walls, 2, 2, 1, 2);
    buildWall(context_walls, 6, 2, 2, 1);
    buildWall(context_walls, 15, 2, 1, 2);
    buildWall(context_walls, 10, 2, 2, 1);

    buildWall(context_walls, 2, 3, 2, 1);
    buildWall(context_walls, 14, 3, 2, 1);
    buildWall(context_walls, 5, 3, 1, 1);
    buildWall(context_walls, 12, 3, 1, 1);
    buildWall(context_walls, 3, 3, 1, 3);
    buildWall(context_walls, 14, 3, 1, 3);

    buildWall(context_walls, 3, 4, 1, 1);
    buildWall(context_walls, 14, 4, 1, 1);

    buildWall(context_walls, 0, 5, 2, 1);
    buildWall(context_walls, 3, 5, 2, 1);
    buildWall(context_walls, 16, 5, 2, 1);
    buildWall(context_walls, 13, 5, 2, 1);

    buildWall(context_walls, 0, 7, 2, 2);
    buildWall(context_walls, 16, 7, 2, 2);
    buildWall(context_walls, 3, 7, 2, 2);
    buildWall(context_walls, 13, 7, 2, 2);

    buildWall(context_walls, 4, 8, 2, 2);
    buildWall(context_walls, 12, 8, 2, 2);
    buildWall(context_walls, 5, 8, 3, 1);
    buildWall(context_walls, 10, 8, 3, 1);

    buildWall(context_walls, 2, 10, 1, 1);
    buildWall(context_walls, 15, 10, 1, 1);
    buildWall(context_walls, 7, 10, 4, 1);
    buildWall(context_walls, 4, 11, 2, 2);
    buildWall(context_walls, 12, 11, 2, 2);
    /* ------------ End Pre-Build Walls  ------------ */
  };
}
