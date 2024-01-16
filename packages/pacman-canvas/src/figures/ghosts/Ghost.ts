import {
  dazzled2DownSvgSrc,
  dazzled2LeftSvgSrc,
  dazzled2RightSvgSrc,
  dazzled2SvgSrc,
  dazzled2UpSvgSrc,
  dazzledDownSvgSrc,
  dazzledLeftSvgSrc,
  dazzledRightSvgSrc,
  dazzledSvgSrc,
  dazzledUpSvgSrc,
  deadDownSvgSrc,
  deadLeftSvgSrc,
  deadRightSvgSrc,
  deadSvgSrc,
  deadUpSvgSrc,
} from "../../assets/img";
import { GHOST_POINTS, GRID_SIZE, Game, PACMAN_RADIUS } from "../../game/Game";
import { MapTileType } from "../../game/map/mapData";
import {
  highlightGridField,
  highlightGridFields,
} from "../../game/render/render";
import { Figure, isInRange } from "../Figure";
import { Pacman } from "../Pacman";
import { down, left, right, up } from "../directions";
import { Direction, DirectionDistance } from "../directions/Direction";
import { GhostImageSprite } from "./GhostImageSprite";

export const GHOSTS = {
  INKY: "inky",
  BLINKY: "blinky",
  PINKY: "pinky",
  CLYDE: "clyde",
};

export type GhostRegistry = {
  pinky: Ghost;
  inky: Ghost;
  blinky: Ghost;
  clyde: Ghost;
};

export enum GhostMode {
  Scatter = 0,
  Chase = 1,
}

export abstract class Ghost extends Figure {
  protected name: string;
  private startPosX: number;
  private startPosY: number;
  protected gridBaseX: number;
  protected gridBaseY: number;

  private imageSprite: GhostImageSprite;
  private deadImageSprite: GhostImageSprite;
  private dazzledImageSprite: GhostImageSprite;
  private dazzled2ImageSprite: GhostImageSprite;

  private ghostHouse: boolean = true;
  private dazzled: boolean = false;
  private dead: boolean = false;

  protected visualizeDirectionOptions: boolean = false;

  constructor(
    game: Game,
    name: string,
    gridPosX: number,
    gridPosY: number,
    imageSprite: GhostImageSprite,
    gridBaseX: number,
    gridBaseY: number
  ) {
    super();
    this.name = name;
    this.posX = gridPosX * GRID_SIZE;
    this.posY = gridPosY * GRID_SIZE;
    this.startPosX = gridPosX * GRID_SIZE;
    this.startPosY = gridPosY * GRID_SIZE;
    this.gridBaseX = gridBaseX;
    this.gridBaseY = gridBaseY;
    this.speed = game.getRegularGhostSpeed();

    this.imageSprite = imageSprite;
    this.deadImageSprite = new GhostImageSprite(
      deadSvgSrc,
      deadLeftSvgSrc,
      deadRightSvgSrc,
      deadUpSvgSrc,
      deadDownSvgSrc
    );
    this.dazzledImageSprite = new GhostImageSprite(
      dazzledSvgSrc,
      dazzledLeftSvgSrc,
      dazzledRightSvgSrc,
      dazzledUpSvgSrc,
      dazzledDownSvgSrc
    );
    this.dazzled2ImageSprite = new GhostImageSprite(
      dazzled2SvgSrc,
      dazzled2LeftSvgSrc,
      dazzled2RightSvgSrc,
      dazzled2UpSvgSrc,
      dazzled2DownSvgSrc
    );

    this.direction = right;
    this.radius = PACMAN_RADIUS;
  }

  public getStartPosX = () => this.startPosX;
  public getStartPosY = () => this.startPosY;

  public toggleDirectionOptionsVisualizations = () =>
    (this.visualizeDirectionOptions = !this.visualizeDirectionOptions);

  public dazzle = (game: Game) => {
    this.changeSpeed(game.getDazzledGhostSpeed());
    // ensure ghost doesnt leave grid
    if (this.posX > 0) this.posX = this.posX - (this.posX % this.speed);
    if (this.posY > 0) this.posY = this.posY - (this.posY % this.speed);
    this.dazzled = true;
  };
  public undazzle = (game: Game) => {
    // only change speed if ghost is not "dead"
    if (!this.dead) this.changeSpeed(game.getRegularGhostSpeed());
    // ensure ghost doesnt leave grid
    if (this.posX > 0) this.posX = this.posX - (this.posX % this.speed);
    if (this.posY > 0) this.posY = this.posY - (this.posY % this.speed);
    this.dazzled = false;
  };

  private drawImageSprite = (
    sprite: GhostImageSprite,
    context: CanvasRenderingContext2D
  ) => {
    sprite.draw(
      context,
      this.posX,
      this.posY,
      this.dirX,
      this.dirY,
      this.radius * 2,
      this.radius * 2
    );
  };

  private drawImage = (
    context: CanvasRenderingContext2D,
    beastModeTimer: number
  ) => {
    // dead
    if (this.isDead()) {
      this.drawImageSprite(this.deadImageSprite, context);
      return;
    }
    // dazzled
    if (this.isDazzled()) {
      if (beastModeTimer < 50 && beastModeTimer % 8 > 1) {
        this.drawImageSprite(this.dazzled2ImageSprite, context);
      } else {
        this.drawImageSprite(this.dazzledImageSprite, context);
      }
      return;
    }
    // default
    this.drawImageSprite(this.imageSprite, context);
  };

  private drawDebugInformation = (
    game: Game,
    context: CanvasRenderingContext2D
  ) => {
    const directionOptions = this.getValidDirectionOptions(game, 0, 0);
    // higight all direction options
    highlightGridFields(context, directionOptions);
    // higight gridPos
    highlightGridField(
      context,
      this.getGridPosX(),
      this.getGridPosY(),
      "magenta"
    );
    // chase mode target
    const [tX, tY] = this.getChaseModeTarget(game, game.getPacman());
    highlightGridField(context, tX, tY, "red");
    // scatter mode target
    highlightGridField(context, this.gridBaseX, this.gridBaseY, "blue");
    // next tile
    const fieldAhead = this.getFieldAhead(game, true);
    highlightGridField(context, fieldAhead.posX, fieldAhead.posY, "limegreen");
  };

  public draw = (game: Game, context: CanvasRenderingContext2D) => {
    const beastModeTimer = game.getPacman().getBeastModeTimer();
    this.drawImage(context, beastModeTimer);

    if (this.visualizeDirectionOptions) {
      this.drawDebugInformation(game, context);
    }
  };
  public getCenterX = () => {
    return this.posX + this.radius;
  };
  public getCenterY = () => {
    return this.posY + this.radius;
  };

  public reset = (game: Game) => {
    this.dead = false;
    this.posX = this.startPosX;
    this.posY = this.startPosY;
    this.ghostHouse = true;
    this.dirX = 0;
    this.dirY = 0;
    this.direction = right;
    this.directionWatcher.set(null);
    this.undazzle(game);
  };

  public isInGhostHouse = () => this.ghostHouse;
  public isDead = () => this.dead;
  public isDazzled = () => this.dazzled;

  public die = (game: Game) => {
    if (!this.dead) {
      game.addScore(GHOST_POINTS);
      //this.reset();
      this.dead = true;
      this.changeSpeed(game.getRegularGhostSpeed());
    }
  };
  public changeSpeed = (s: number) => {
    // adjust gridPosition to new speed
    this.posX = Math.round(this.posX / s) * s;
    this.posY = Math.round(this.posY / s) * s;
    this.speed = s;
  };

  public checkDirectionChange = (game: Game) => {
    // if (this.isStopped) return;
    this.checkGhostHouse(game);
    if (!this.ghostHouse) this.setNextDirection(game);

    let nextDirection = this.directionWatcher.get();
    // if (!nextDirection) {
    //   this.setNextDirection(game);
    //   nextDirection = this.directionWatcher.get();
    // }
    console.log(`${this.name} next direction ${nextDirection?.getName()}`);
    if (nextDirection !== null && this.inGrid()) {
      const nextTile = this.getNextTile(game, nextDirection);
      console.debug("checkNextTile: " + nextTile);

      if (nextTile !== "🟦") {
        this.setDirection(nextDirection);
        this.directionWatcher.set(null);
      }
    }
  };

  protected abstract checkStartingConditions: (game: Game) => void;

  private checkGhostHouse = (game: Game) => {
    if (this.ghostHouse === true) {
      this.checkStartingConditions(game);

      // leave Ghost House, lead ghosts in right direction
      if (this.getGridPosY() === 5 && this.inGrid()) {
        if (this.getGridPosX() === 7) {
          this.directionWatcher.set(right);
        }
        if (this.getGridPosX() === 8 || this.getGridPosX() === 9) {
          this.directionWatcher.set(up);
        }
        if (this.getGridPosX() === 10) {
          this.directionWatcher.set(left);
        }
      }
      if (
        game
          .getGridMap()
          .getTileType(this.getGridPosX(), this.getGridPosY()) === "door" &&
        this.inGrid()
      ) {
        console.debug(`🏰 ${this.name} leaving the ghosthouse`);
        this.ghostHouse = false;
      }
    }
  };

  public move = (game: Game) => {
    this.validatePosition();
    this.checkDirectionChange(game);

    // validate position

    if (!this.isStopped) {
      // Move
      this.advancePosition();

      // Check if out of canvas
      this.checkAndAdjustOutOfCanvas(game);
    }
    // check collisions
    this.checkCollisions(game);
  };

  private checkPacmanCollision = (game: Game) => {
    const pacman = game.getPacman();

    if (
      /* Check Ghost / Pacman Collision			*/
      isInRange(
        pacman.getCenterX(),
        this.getCenterX() - 10,
        this.getCenterX() + 10
      ) &&
      isInRange(
        pacman.getCenterY(),
        this.getCenterY() - 10,
        this.getCenterY() + 10
      )
    ) {
      if (!this.dazzled && !this.dead) {
        pacman.die(game);
      } else {
        this.die(game);
      }
    }
  };

  private checkGhostHouseCollision = (game: Game) => {
    // if (this.gridBaseY === 5 && this.gridBaseX >= 7 && this.gridBaseX <= 10) {
    //   console.log(`${}`);
    // }
    /* Check Back to Home */
    if (
      this.dead &&
      this.getGridPosX() === this.startPosX / GRID_SIZE &&
      this.getGridPosY() === this.startPosY / GRID_SIZE
    ) {
      this.reset(game);
    }
  };

  public checkCollisions = (game: Game) => {
    this.checkPacmanCollision(game);
    this.checkGhostHouseCollision(game);

    // check wall collision
    const fieldAhead = this.getFieldAhead(game, true);
    if (fieldAhead.field === "🟦") {
      console.warn(`${this.name}: fieldAhead ${JSON.stringify(fieldAhead)}`);
      // this.directionWatcher.set(null);
      // this.stop();
    }
    this.checkWallCollision(fieldAhead.field, false, ["🟦"]);
    this.resetIsStuck();
  };

  /**
   * every ghost type has to implement their own target strategy for chase mode
   */
  protected abstract getChaseModeTarget: (
    game: Game,
    pacman: Pacman
  ) => [targetX: number, targetY: number];

  /**
   * Get all the relevant information about the field in relativeDirection to the ghosts current position.
   * @param game
   * @param relativeDirection
   * @param targetX
   * @param targetY
   * @returns
   */
  private getDirectionDistance = (
    game: Game,
    relativeDirection: Direction,
    targetX: number,
    targetY: number
  ): DirectionDistance => {
    const posX = this.getGridPosX() + relativeDirection.getDirX();
    const posY = this.getGridPosY() + relativeDirection.getDirY();

    return {
      field: game.getMapContent(posX, posY),
      posX,
      posY,
      relativeDirection,
      distance: Math.sqrt(
        Math.pow(posX - targetX, 2) + Math.pow(posY - targetY, 2)
      ),
    };
  };

  private getDirectionOptions = (
    game: Game,
    targetX: number,
    targetY: number
  ) => [
    this.getDirectionDistance(game, up, targetX, targetY),
    this.getDirectionDistance(game, down, targetX, targetY),
    this.getDirectionDistance(game, right, targetX, targetY),
    this.getDirectionDistance(game, left, targetX, targetY),
  ];

  private getValidDirectionOptions = (
    game: Game,
    targetX: number,
    targetY: number
  ) => {
    const blockedTileTypes: MapTileType[] = this.dead ? ["🟦"] : ["🟦", "door"];

    return this.getDirectionOptions(game, targetX, targetY).filter(
      (dirOptiom) =>
        !blockedTileTypes.includes(dirOptiom.field) &&
        !dirOptiom.relativeDirection.equals(this.getOppositeDirection())
    );
  };
  /**
   * Pathfinding
   * This function clearly needs reactoring documentation and testing.
   * Sets next direction in direction Watcher.
   * @param game
   * @returns
   */
  public setNextDirection = (game: Game): void => {
    const pacman = game.getPacman();

    // target
    let targetX: number = 0,
      targetY: number = 0;
    // get next field
    let currentPosX = this.getGridPosX();
    let currentPosY = this.getGridPosY();
    game.getMapContent(currentPosX, currentPosY);

    // get target
    if (this.dead) {
      // go Home
      targetX = this.startPosX / GRID_SIZE;
      targetY = this.startPosY / GRID_SIZE;
    } else if (game.getGhostMode() === GhostMode.Scatter) {
      // Scatter Mode
      targetX = this.gridBaseX;
      targetY = this.gridBaseY;
    } else if (game.getGhostMode() === GhostMode.Chase) {
      // Chase Mode
      [targetX, targetY] = this.getChaseModeTarget(game, pacman);
    }

    const validDirectionOptions = this.getValidDirectionOptions(
      game,
      targetX,
      targetY
    );

    // Sort possible directions by distance
    const compare = (a: DirectionDistance, b: DirectionDistance) => {
      if (a.distance < b.distance) return -1;
      if (a.distance > b.distance) return 1;
      return 0;
    };
    const orderedDirectionOptions = validDirectionOptions.toSorted(compare);

    /**
     * TODO: there are cases where there are multiple options with the exact same distance,
     * it would be cool to then randomly pick one of the two instead of always going for the same one
     * */
    let nextDirection = orderedDirectionOptions[0]?.relativeDirection;

    if (!nextDirection) {
      console.warn(
        `${this.name}: No valid direction option! (possibly back at ghosthouse)`,
        this.ghostHouse
      );
      this.directionWatcher.set(null);
      return;
    }

    this.directionWatcher.set(nextDirection);
  };

  public getDirectionWatcherValue = () => this.directionWatcher.get();

  public setRandomDirection = () => {
    const dir = Math.floor(Math.random() * 10 + 1) % 5;

    switch (dir) {
      case 1:
        if (this.getOppositeDirection().equals(up)) this.setDirection(down);
        else this.setDirection(up);
        break;
      case 2:
        if (this.getOppositeDirection().equals(down)) this.setDirection(up);
        else this.setDirection(down);
        break;
      case 3:
        if (this.getOppositeDirection().equals(right)) this.setDirection(left);
        else this.setDirection(right);
        break;
      case 4:
        if (this.getOppositeDirection().equals(left)) this.setDirection(right);
        else this.setDirection(left);
        break;
    }
  };

  public reverseDirection = () => {
    console.debug(
      "reverseDirection: " +
        this.direction.getName() +
        " to " +
        this.getOppositeDirection().getName()
    );
    this.directionWatcher.set(this.getOppositeDirection());
  };
}
