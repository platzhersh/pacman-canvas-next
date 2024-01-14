import { dazzled2SvgSrc, dazzledSvgSrc, deadSvgSrc } from "../../assets/img";
import { GHOST_POINTS, Game } from "../../game/Game";
import { MapTileType } from "../../game/map/mapData";
import {
  highlightGridField,
  highlightGridFields,
} from "../../game/render/render";
import { Figure, isInRange } from "../Figure";
import { PACMAN_RADIUS, Pacman } from "../Pacman";
import { down, left, right, up } from "../directions";
import { Direction, DirectionDistance } from "../directions/Direction";

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
  private image: HTMLImageElement;

  private ghostHouse: boolean = true;
  private dazzled: boolean = false;
  private dead: boolean = false;

  private dazzleImg: HTMLImageElement;
  private dazzleImg2: HTMLImageElement;
  private deadImg: HTMLImageElement;

  protected visualizeDirectionOptions: boolean = false;

  constructor(
    game: Game,
    name: string,
    gridPosX: number,
    gridPosY: number,
    imageSrc: string,
    gridBaseX: number,
    gridBaseY: number
  ) {
    super();
    this.name = name;
    this.posX = gridPosX * 30;
    this.posY = gridPosY * 30;
    this.startPosX = gridPosX * 30;
    this.startPosY = gridPosY * 30;
    this.gridBaseX = gridBaseX;
    this.gridBaseY = gridBaseY;
    this.speed = game.getRegularGhostSpeed();
    // this.images = JSON.parse(
    //   '{"normal" : {' +
    //     `"${GHOSTS.INKY}" : "0",` +
    //     `"${GHOSTS.PINKY}" : "1",` +
    //     `"${GHOSTS.BLINKY}" : "2",` +
    //     `"${GHOSTS.CLYDE}" : "3"` +
    //     "}," +
    //     '"frightened1" : {' +
    //     '"left" : "", "up": "", "right" : "", "down": ""},' +
    //     '"frightened2" : {' +
    //     '"left" : "", "up": "", "right" : "", "down": ""},' +
    //     '"dead" : {' +
    //     '"left" : "", "up": "", "right" : "", "down": ""}}'
    // );
    this.image = new Image();
    this.image.src = imageSrc;
    this.dazzleImg = new Image();
    this.dazzleImg.src = dazzledSvgSrc; //"img/dazzled.svg";
    this.dazzleImg2 = new Image();
    this.dazzleImg2.src = dazzled2SvgSrc; //"img/dazzled2.svg";
    this.deadImg = new Image();
    this.deadImg.src = deadSvgSrc; // "img/dead.svg";
    this.direction = right;
    this.radius = PACMAN_RADIUS;
  }

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
  public draw = (game: Game, context: CanvasRenderingContext2D) => {
    const beastModeTimer = game.getPacman().getBeastModeTimer();

    if (this.dead) {
      context.drawImage(
        this.deadImg,
        this.posX,
        this.posY,
        2 * this.radius,
        2 * this.radius
      );
    } else if (this.dazzled) {
      if (beastModeTimer < 50 && beastModeTimer % 8 > 1) {
        context.drawImage(
          this.dazzleImg2,
          this.posX,
          this.posY,
          2 * this.radius,
          2 * this.radius
        );
      } else {
        context.drawImage(
          this.dazzleImg,
          this.posX,
          this.posY,
          2 * this.radius,
          2 * this.radius
        );
      }
    } else {
      context.drawImage(
        this.image,
        this.posX,
        this.posY,
        2 * this.radius,
        2 * this.radius
      );
    }

    if (this.visualizeDirectionOptions) {
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
      highlightGridField(
        context,
        fieldAhead.posX,
        fieldAhead.posY,
        "limegreen"
      );
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
    this.directionWatcher.set(null);
    this.undazzle(game);
  };

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

  private checkGhostHouse = (game: Game) => {
    // leave Ghost House
    if (this.ghostHouse === true) {
      // Clyde does not start chasing before 2/3 of all pills are eaten and if level is < 4
      if (this.name === GHOSTS.CLYDE) {
        if (game.getLevel() < 4 || game.getPillCount() > 104 / 3) {
          this.stop();
        } else {
          this.start();
        }
      }
      // Inky starts after 30 pills and only from the third level on
      if (this.name === GHOSTS.INKY) {
        if (game.getLevel() < 3 || game.getPillCount() > 104 - 30) {
          this.stop();
        } else {
          this.start();
        }
      }

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
        this.getGridPosY() === 4 &&
        (this.getGridPosX() === 8 || this.getGridPosX() === 9) &&
        this.inGrid()
      ) {
        console.debug(`🏰 ${this.name} leaving the ghosthouse`);
        this.ghostHouse = false;
      }
    }
  };

  public move = (game: Game) => {
    this.checkDirectionChange(game);
    this.checkCollisions(game);

    // check wall collision
    const fieldAhead = this.getFieldAhead(game);
    if (fieldAhead.field === "🟦") {
      console.warn(`${this.name}: fieldAhead ${JSON.stringify(fieldAhead)}`);
      this.directionWatcher.set(null);
      // this.stop();
    }

    if (!this.isStopped) {
      // Move
      this.posX += this.speed * this.dirX;
      this.posY += this.speed * this.dirY;

      // Check if out of canvas
      if (this.posX >= game.getCanvasWidth() - this.radius)
        this.posX = this.speed - this.radius;
      if (this.posX <= 0 - this.radius)
        this.posX = game.getCanvasWidth() - this.speed - this.radius;
      if (this.posY >= game.getCanvasHeight() - this.radius)
        this.posY = this.speed - this.radius;
      if (this.posY <= 0 - this.radius)
        this.posY = game.getCanvasHeight() - this.speed - this.radius;
    }
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
      this.getGridPosX() === this.startPosX / 30 &&
      this.getGridPosY() === this.startPosY / 30
    ) {
      this.reset(game);
    }
  };

  public checkCollisions = (game: Game) => {
    this.checkPacmanCollision(game);
    this.checkGhostHouseCollision(game);
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
      targetX = this.startPosX / 30;
      targetY = this.startPosY / 30;
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

    let nextDirection = orderedDirectionOptions[0]?.relativeDirection;

    if (!nextDirection) {
      console.warn(
        "No valid direction option! (possibly back at ghosthouse)",
        this.ghostHouse
      );
      this.directionWatcher.set(null);
      return;
    }

    this.directionWatcher.set(nextDirection);
  };

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
