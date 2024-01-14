import { Game, PILL_POINTS, POWERPILL_POINTS } from "../game/Game";
import { Sound } from "../game/Sound";
import { MapTileType } from "../game/map/mapData";
import { Figure, isInRange } from "./Figure";
import { right } from "./directions";
import { Direction } from "./directions/Direction";
import { DirectionWatcher } from "./directions/DirectionWatcher";

export const PACMAN_RADIUS = 15;
const PACMAN_INITIAL_LIVES = 3;

export class Pacman extends Figure {
  protected name = "pacman";
  protected speed = 5;
  protected angle1 = 0.25;
  protected angle2 = 1.75;
  protected mouth = 1; /* Switches between 1 and -1, depending on mouth closing / opening */
  protected lives = PACMAN_INITIAL_LIVES;
  protected stuckX = 0;
  protected stuckY = 0;
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

    if (field === "⚪️" || field === "💊") {
      //console.log("Pill found at ("+gridX+"/"+gridY+"). Pacman at ("+this.posX+"/"+this.posY+")");
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
        let s;
        if (field === "💊") {
          Sound.play(game, "powerpill");
          s = POWERPILL_POINTS;
          this.enableBeastMode(game);
          game.startGhostFrightened();
        } else {
          Sound.play(game, "waka");
          s = PILL_POINTS;
          game.decrementPillCount();
        }
        game.getGridMap().setTileType(gridX, gridY, "null");
        game.addScore(s);
      }
    }
  };

  public checkCollisions = (game: Game) => {
    if (this.stuckX === 0 && this.stuckY === 0 && !this.frozen) {
      // Get the Grid Position of Pac
      let gridX = this.getGridPosX();
      let gridY = this.getGridPosY();
      let gridAheadX = gridX;
      let gridAheadY = gridY;

      let field = game.getMapContent(gridX, gridY);

      // get the field 1 ahead to check wall collisions
      if (this.dirX === 1 && gridAheadX < 17) gridAheadX += 1;
      if (this.dirY === 1 && gridAheadY < 12) gridAheadY += 1;
      let fieldAhead = game.getMapContent(gridAheadX, gridAheadY);

      /*	Check Pill Collision			*/
      this.checkPillCollisions(game, field, fieldAhead);

      /*	Check Wall Collision			*/
      if (fieldAhead === "🟦" || fieldAhead === "door") {
        this.stuckX = this.dirX;
        this.stuckY = this.dirY;
        this.stop();
        // get out of the wall
        if (this.stuckX === 1 && (this.posX % 2) * this.radius !== 0) {
          this.posX -= this.speed;
        }
        if (this.stuckY === 1 && (this.posY % 2) * this.radius !== 0) {
          this.posY -= this.speed;
        }

        if (this.stuckX === -1) {
          this.posX += this.speed;
        }
        if (this.stuckY === -1) {
          this.posY += this.speed;
        }
      }
    }
  };

  public getDirection = () => this.direction;
  public getDirectionWatcher = () => this.directionWatcher;

  public checkDirectionChange = (game: Game) => {
    const nextDirection = this.directionWatcher.get();
    if (nextDirection !== null) {
      console.groupCollapsed("checkDirectionChange");
      console.debug(`next Direction: ${nextDirection.getName()}`);

      if (this.stuckX === 1 && nextDirection === right)
        this.directionWatcher.set(null);
      else {
        // reset stuck events
        this.stuckX = 0;
        this.stuckY = 0;

        // only allow direction changes inside the grid
        if (this.inGrid()) {
          const nextTile = this.getNextTile(game, nextDirection);
          console.debug("checkNextTile: " + nextTile);

          if (nextTile !== "🟦") {
            this.setDirection(nextDirection);
            this.directionWatcher.set(null);
          }
        }
      }
      console.groupEnd();
    }
  };
  public getBeastModeTimer = () => this.beastModeTimer;
  public enableBeastMode = (game: Game) => {
    this.beastMode = true;
    this.beastModeTimer = 240;
    console.debug("Beast Mode activated! 💊🦍");
    game.dazzleGhosts();
  };
  public disableBeastMode = (game: Game) => {
    this.beastMode = false;
    console.debug("Beast Mode is over! 🐹");
    game.undazzleGhosts();
  };

  public move = (game: Game) => {
    if (!this.frozen) {
      if (this.beastModeTimer > 0) {
        this.beastModeTimer--;
        //console.log("Beast Mode: "+this.beastModeTimer);
      }
      if (this.beastModeTimer === 0 && this.beastMode)
        this.disableBeastMode(game);

      this.posX += this.speed * this.dirX;
      this.posY += this.speed * this.dirY;

      // Check if out of canvas
      if (this.posX >= game.getCanvasWidth() - this.radius)
        this.posX = 5 - this.radius;
      if (this.posX <= 0 - this.radius)
        this.posX = game.getCanvasWidth() - 5 - this.radius;
      if (this.posY >= game.getCanvasHeight() - this.radius)
        this.posY = 5 - this.radius;
      if (this.posY <= 0 - this.radius)
        this.posY = game.getCanvasHeight() - 5 - this.radius;
    } else this.dieAnimation(game);
  };

  public eat = () => {
    if (!this.frozen) {
      // TODO: what should this check??
      if (this.dirX === 0 && this.dirY === 0) {
        this.angle1 -= this.mouth * 0.07;
        this.angle2 += this.mouth * 0.07;

        const limitMax1 = this.direction.getAngle1();
        const limitMax2 = this.direction.getAngle2();
        const limitMin1 = this.direction.getAngle1() - 0.21;
        const limitMin2 = this.direction.getAngle2() + 0.21;

        if (this.angle1 < limitMin1 || this.angle2 > limitMin2) {
          this.mouth = -1;
        }
        if (this.angle1 >= limitMax1 || this.angle2 <= limitMax2) {
          this.mouth = 1;
        }
      }
    }
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
    this.stuckX = 0;
    this.stuckY = 0;
    //console.log("reset pacman");
  };

  public dieAnimation = (game: Game) => {
    this.angle1 += 0.05;
    this.angle2 -= 0.05;
    if (
      this.angle1 >= this.direction.getAngle1() + 0.7 ||
      this.angle2 <= this.direction.getAngle2() - 0.7
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
    console.log("pacman died, lives remaining:", this.lives);
    if (this.lives <= 0) {
      game.endGame();
      //   game.showHighscoreForm();
    }
    // game.drawHearts(this.lives);
  };

  public draw = (context: CanvasRenderingContext2D) => {
    context.beginPath();
    context.fillStyle = "Yellow";
    context.strokeStyle = "Yellow";
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
