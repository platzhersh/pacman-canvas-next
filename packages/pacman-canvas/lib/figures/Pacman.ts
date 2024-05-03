import Logger from "js-logger";
import {
  FRUIT_POINTS,
  Game,
  PACMAN_RADIUS,
  PILL_POINTS,
  POWERPILL_POINTS,
} from "../game/Game";
import { Sound } from "../game/Sound";
import { MapTileType } from "../game/map/mapData";
import { Figure, isInRange } from "./Figure";
import { ANGLE1_RIGHT, ANGLE2_RIGHT, ANGLE_DIFF, right } from "./directions";
import { Direction } from "./directions/Direction";
import { DirectionWatcher } from "./directions/DirectionWatcher";

const PACMAN_COLOR = "Yellow";
const PACMAN_INITIAL_LIVES = 3;
const BEASTMODE_TIME = 240;
const MOUTH_SPEED = 0.07;
const MOUTH_SPEED_DYING = 0.025;

export class Pacman extends Figure {
  protected name = "pacman";
  protected speed = 5;
  protected angle1 = ANGLE1_RIGHT;
  protected angle2 = ANGLE2_RIGHT;
  protected mouthDir = 1; /* Switches between 1 and -1, depending on mouth closing / opening */
  protected lives = PACMAN_INITIAL_LIVES;
  protected frozen = false; // used to play die Animation

  protected directionWatcher = new DirectionWatcher();
  protected direction: Direction = right;

  protected beastMode = false;
  protected beastModeTimer = 0;

  constructor() {
    super();
    this.radius = PACMAN_RADIUS;
    this.posY = 6 * 2 * this.radius;
    this.dirX = right.getDirX();
    this.dirY = right.getDirY();
  }

  public isFrozen = () => this.frozen;
  public freeze = () => {
    this.frozen = true;
  };
  public unfreeze = () => {
    this.frozen = false;
  };
  public getCenterX = () => {
    return this.posX + this.radius;
  };
  public getCenterY = () => {
    return this.posY + this.radius;
  };

  private checkPillCollisions = (
    game: Game,
    field: MapTileType,
    fieldAhead: MapTileType
  ) => {
    let gridX = this.getGridPosX();
    let gridY = this.getGridPosY();

    if (field === "⚪️" || field === "💊" || field === "🍒") {
      //Logger.info("Pill found at ("+gridX+"/"+gridY+"). Pacman at ("+this.posX+"/"+this.posY+")");
      if (
        (this.dirX === 1 &&
          isInRange(
            this.posX,
            game.toPixelPos(gridX) + this.radius - this.speed,
            game.toPixelPos(gridX + 1)
          )) ||
        (this.dirX === -1 &&
          isInRange(
            this.posX,
            game.toPixelPos(gridX),
            game.toPixelPos(gridX) + this.speed
          )) ||
        (this.dirY === 1 &&
          isInRange(
            this.posY,
            game.toPixelPos(gridY) + this.radius - this.speed,
            game.toPixelPos(gridY + 1)
          )) ||
        (this.dirY === -1 &&
          isInRange(
            this.posY,
            game.toPixelPos(gridY),
            game.toPixelPos(gridY) + this.speed
          )) ||
        fieldAhead === "🟦"
      ) {
        let newPoints;
        switch (field) {
          case "💊":
            Sound.play(game, "powerpill");
            newPoints = POWERPILL_POINTS;
            this.enableBeastMode(game);
            game.startGhostFrightened();
            break;
          case "⚪️":
            Sound.play(game, "waka");
            newPoints = PILL_POINTS;
            game.decrementPillCount();
            break;
          case "🍒":
            Sound.play(game, "waka");
            newPoints = FRUIT_POINTS;
            break;
        }

        game.getGridMap().setTileType(gridX, gridY, "null");
        game.addScore(newPoints);
      }
    }
  };

  public checkCollisions = (game: Game) => {
    if (this.stuckX === 0 && this.stuckY === 0 && !this.isFrozen()) {
      // Get the Grid Position of Pac
      const gridX = this.getGridPosX();
      const gridY = this.getGridPosY();
      let gridAheadX = gridX;
      let gridAheadY = gridY;

      // get the field 1 ahead to check wall collisions
      if (this.dirX === 1 && gridAheadX < 17) gridAheadX += 1;
      if (this.dirY === 1 && gridAheadY < 12) gridAheadY += 1;
      let fieldAhead = game.getMapContent(gridAheadX, gridAheadY);

      /*	Check Pill Collision			*/
      let field = game.getMapContent(gridX, gridY);
      this.checkPillCollisions(game, field, fieldAhead);

      /*	Check Wall Collision			*/
      this.checkWallCollision(fieldAhead, true, ["🟦", "door"]);
    }
  };

  public getDirection = () => this.direction;
  public getDirectionWatcher = () => this.directionWatcher;

  public checkDirectionChange = (game: Game) => {
    const nextDirection = this.directionWatcher.get();
    if (nextDirection !== null) {
      Logger.debug(`next Direction: ${nextDirection.getName()}`);

      if (this.stuckX === 1 && nextDirection === right)
        this.directionWatcher.set(null);
      else {
        // reset stuck events
        this.resetIsStuck();

        // only allow direction changes inside the grid
        if (this.inGrid()) {
          const nextTile = this.getNextTile(game, nextDirection);
          Logger.debug("checkNextTile: " + nextTile);

          if (nextTile !== "🟦") {
            this.setDirection(nextDirection);
            this.directionWatcher.set(null);
          }
        }
      }
    }
  };
  public getBeastModeTimer = () => this.beastModeTimer;
  public enableBeastMode = (game: Game) => {
    this.beastMode = true;
    this.beastModeTimer = BEASTMODE_TIME;
    Logger.debug("Beast Mode activated! 💊🦍");
    game.dazzleGhosts();
  };
  public disableBeastMode = (game: Game) => {
    this.beastMode = false;
    Logger.debug("Beast Mode is over! 🐹");
    game.undazzleGhosts();
  };

  public move = (game: Game) => {
    this.validatePosition();

    if (!this.isFrozen()) {
      if (this.beastModeTimer > 0) {
        this.beastModeTimer--;
      }
      if (this.beastModeTimer === 0 && this.beastMode)
        this.disableBeastMode(game);

      // move
      this.advancePosition();

      // Check if out of canvas
      this.checkAndAdjustOutOfCanvas(game);
    } else {
      this.dieAnimation(game);
    }
  };

  /**
   * mouth animation.
   * only works if pacman is not frozen and has a direction (is moving)
   */
  public eat = () => {
    if (!this.isFrozen() && !this.hasNoDirection()) {
      this.angle1 -= this.mouthDir * MOUTH_SPEED;
      this.angle2 += this.mouthDir * MOUTH_SPEED;

      const limitMax1 = this.direction.getAngle1();
      const limitMax2 = this.direction.getAngle2();
      const limitMin1 = this.direction.getAngle1() - 0.21;
      const limitMin2 = this.direction.getAngle2() + 0.21;

      if (this.angle1 < limitMin1 || this.angle2 > limitMin2) {
        this.mouthDir = -1;
      }
      if (this.angle1 >= limitMax1 || this.angle2 <= limitMax2) {
        this.mouthDir = 1;
      }
    }
  };

  public hasNoDirection = () => {
    return this.dirX === 0 && this.dirY === 0;
  };

  public stop = () => {
    this.dirX = 0;
    this.dirY = 0;
  };

  public reset = () => {
    this.unfreeze();
    this.posX = 0;
    this.posY = 6 * 2 * this.radius;
    this.setDirection(right);
    this.stop();
    this.resetIsStuck();
    //Logger.info("reset pacman");
  };

  public dieAnimation = (game: Game) => {
    this.angle1 += MOUTH_SPEED_DYING;
    this.angle2 -= MOUTH_SPEED_DYING;
    if (
      this.angle1 >= this.direction.getAngle1() + ANGLE_DIFF ||
      this.angle2 <= this.direction.getAngle2() - ANGLE_DIFF
    ) {
      this.dieFinal(game);
    }
  };

  public getLives = () => this.lives;
  public decrementLives = () => this.lives--;
  public resetLives = () => (this.lives = PACMAN_INITIAL_LIVES);

  public die = (game: Game) => {
    Sound.play(game, "die");
    this.freeze();
    this.dieAnimation(game);
  };

  public dieFinal = (game: Game) => {
    this.reset();
    game.resetGhosts();
    this.decrementLives();
    Logger.info("pacman died, lives remaining:", this.lives);
    if (this.lives <= 0) {
      game.endGame();
      //   game.showHighscoreForm();
    }
    // game.drawHearts(this.lives);
  };

  public draw = (context: CanvasRenderingContext2D) => {
    context.beginPath();
    context.fillStyle = PACMAN_COLOR;
    context.strokeStyle = PACMAN_COLOR;
    context.arc(
      this.getPosX() + PACMAN_RADIUS,
      this.getPosY() + PACMAN_RADIUS,
      this.radius,
      this.getAngle1() * Math.PI,
      this.getAngle2() * Math.PI
    );
    context.lineTo(this.getPosX() + this.radius, this.getPosY() + this.radius);
    context.stroke();
    context.fill();
  };
}
