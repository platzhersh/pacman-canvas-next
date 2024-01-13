import { dazzled2SVG, dazzledSVG, deadSVG } from "../assets/img";
import { GHOST_POINTS, Game } from "../game/Game";
import { MapTileType } from "../game/map/mapData";
import { Figure, isInRange } from "./Figure";
import { PACMAN_RADIUS } from "./Pacman";
import { down, left, right, up } from "./directions";
import { Direction } from "./directions/Direction";

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

export class Ghost extends Figure {
  private name: string;
  private startPosX: number;
  private startPosY: number;
  private gridBaseX: number;
  private gridBaseY: number;
  private images: any;
  private image: HTMLImageElement;

  private ghostHouse: boolean = true;
  private dazzled: boolean = false;
  private dead: boolean = false;

  private dazzleImg: HTMLImageElement;
  private dazzleImg2: HTMLImageElement;
  private deadImg: HTMLImageElement;

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
    this.images = JSON.parse(
      '{"normal" : {' +
        `"${GHOSTS.INKY}" : "0",` +
        `"${GHOSTS.PINKY}" : "1",` +
        `"${GHOSTS.BLINKY}" : "2",` +
        `"${GHOSTS.CLYDE}" : "3"` +
        "}," +
        '"frightened1" : {' +
        '"left" : "", "up": "", "right" : "", "down": ""},' +
        '"frightened2" : {' +
        '"left" : "", "up": "", "right" : "", "down": ""},' +
        '"dead" : {' +
        '"left" : "", "up": "", "right" : "", "down": ""}}'
    );
    this.image = new Image();
    this.image.src = imageSrc;
    this.dazzleImg = new Image();
    this.dazzleImg.src = dazzledSVG; //"img/dazzled.svg";
    this.dazzleImg2 = new Image();
    this.dazzleImg2.src = dazzled2SVG; //"img/dazzled2.svg";
    this.deadImg = new Image();
    this.deadImg.src = deadSVG; // "img/dead.svg";
    this.direction = right;
    this.radius = PACMAN_RADIUS;
  }

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
    } else
      context.drawImage(
        this.image,
        this.posX,
        this.posY,
        2 * this.radius,
        2 * this.radius
      );
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

  public move = (game: Game) => {
    this.checkDirectionChange(game);
    this.checkCollision(game);

    // leave Ghost House
    if (this.ghostHouse === true) {
      // Clyde does not start chasing before 2/3 of all pills are eaten and if level is < 4
      if (this.name == GHOSTS.CLYDE) {
        if (game.getLevel() < 4 || game.getPillCount() > 104 / 3) this.stop();
        else this.start();
      }
      // Inky starts after 30 pills and only from the third level on
      if (this.name == GHOSTS.INKY) {
        if (game.getLevel() < 3 || game.getPillCount() > 104 - 30) this.stop();
        else this.start();
      }

      if (this.getGridPosY() == 5 && this.inGrid()) {
        if (this.getGridPosX() == 7) this.setDirection(right);
        if (this.getGridPosX() == 8 || this.getGridPosX() == 9)
          this.setDirection(up);
        if (this.getGridPosX() == 10) this.setDirection(left);
      }
      if (
        this.getGridPosY() == 4 &&
        (this.getGridPosX() == 8 || this.getGridPosX() == 9) &&
        this.inGrid()
      ) {
        console.log("ghosthouse -> false");
        this.ghostHouse = false;
      }
    }

    if (!this.stop) {
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

  public checkCollision = (game: Game) => {
    const pacman = game.getPacman();
    /* Check Back to Home */
    if (
      this.dead &&
      this.getGridPosX() == this.startPosX / 30 &&
      this.getGridPosY() == this.startPosY / 30
    )
      this.reset(game);
    else if (
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

  /**
   * This function clearly needs reactoring and testing.
   * @param game
   * @returns
   */
  public getNextDirection = (game: Game) => {
    const pacman = game.getPacman();

    // target
    let tX: number = 0,
      tY: number = 0;
    // get next field
    let pX = this.getGridPosX();
    let pY = this.getGridPosY();
    game.getMapContent(pX, pY);

    // get target
    if (this.dead) {
      // go Home
      tX = this.startPosX / 30;
      tY = this.startPosY / 30;
    } else if (game.getGhostMode() === 0) {
      // Scatter Mode
      tX = this.gridBaseX;
      tY = this.gridBaseY;
    } else if (game.getGhostMode() === 1) {
      // Chase Mode

      switch (this.name) {
        // target: 4 ahead and 4 left of pacman
        case GHOSTS.PINKY:
          var pacmanDirection = pacman.getDirection();
          var pdirX =
            pacmanDirection.getDirX() == 0
              ? -pacmanDirection.getDirY()
              : pacmanDirection.getDirX();
          var pdirY =
            pacmanDirection.getDirY() == 0
              ? -pacmanDirection.getDirX()
              : pacmanDirection.getDirY();

          tX =
            (pacman.getGridPosX() + pdirX * 4) %
            (game.getCanvasWidth() / PACMAN_RADIUS + 1);
          tY =
            (pacman.getGridPosY() + pdirY * 4) %
            (game.getCanvasHeight() / PACMAN_RADIUS + 1);
          break;

        // target: pacman
        case GHOSTS.BLINKY:
          tX = pacman.getGridPosX();
          tY = pacman.getGridPosY();
          break;

        // target:
        case GHOSTS.INKY:
          tX = pacman.getGridPosX() + 2 * pacman.getDirection().getDirX();
          tY = pacman.getGridPosY() + 2 * pacman.getDirection().getDirY();

          const blinky = game.getGhosts().blinky;
          let vX = tX - blinky.getGridPosX();
          let vY = tY - blinky.getGridPosY();
          tX = Math.abs(blinky.getGridPosX() + vX * 2);
          tY = Math.abs(blinky.getGridPosY() + vY * 2);
          break;

        // target: pacman, until pacman is closer than 5 grid fields, then back to scatter
        case GHOSTS.CLYDE:
          tX = pacman.getGridPosX();
          tY = pacman.getGridPosY();
          let dist = Math.sqrt(Math.pow(pX - tX, 2) + Math.pow(pY - tY, 2));

          if (dist < 5) {
            tX = this.gridBaseX;
            tY = this.gridBaseY;
          }
          break;
      }
    }

    type DirectionDistance = {
      field: MapTileType;
      dir: Direction;
      distance: number;
    };

    const dir0: DirectionDistance = {
      field: game.getMapContent(pX, pY - 1),
      dir: up,
      distance: Math.sqrt(Math.pow(pX - tX, 2) + Math.pow(pY - 1 - tY, 2)),
    };

    const dir1: DirectionDistance = {
      field: game.getMapContent(pX, pY + 1),
      dir: down,
      distance: Math.sqrt(Math.pow(pX - tX, 2) + Math.pow(pY + 1 - tY, 2)),
    };

    const dir2: DirectionDistance = {
      field: game.getMapContent(pX + 1, pY),
      dir: right,
      distance: Math.sqrt(Math.pow(pX + 1 - tX, 2) + Math.pow(pY - tY, 2)),
    };

    const dir3: DirectionDistance = {
      field: game.getMapContent(pX - 1, pY),
      dir: left,
      distance: Math.sqrt(Math.pow(pX - 1 - tX, 2) + Math.pow(pY - tY, 2)),
    };

    const dirs: DirectionDistance[] = [dir0, dir1, dir2, dir3];

    // Sort possible directions by distance
    function compare(a: DirectionDistance, b: DirectionDistance) {
      if (a.distance < b.distance) return -1;
      if (a.distance > b.distance) return 1;
      return 0;
    }
    const dirs2 = dirs.toSorted(compare);

    let nextDirection: Direction = right;

    if (this.dead) {
      for (let i = dirs2.length - 1; i >= 0; i--) {
        if (
          dirs2[i].field !== "wall" &&
          !dirs2[i].dir.equals(this.getOppositeDirection())
        ) {
          nextDirection = dirs2[i].dir;
        }
      }
    } else {
      for (let i = dirs2.length - 1; i >= 0; i--) {
        if (
          dirs2[i].field !== "wall" &&
          dirs2[i].field !== "door" &&
          !dirs2[i].dir.equals(this.getOppositeDirection())
        ) {
          nextDirection = dirs2[i].dir;
        }
      }
    }
    this.directionWatcher.set(nextDirection);
    return nextDirection;
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
    console.log(
      "reverseDirection: " +
        this.direction.getName() +
        " to " +
        this.getOppositeDirection().getName()
    );
    this.directionWatcher.set(this.getOppositeDirection());
  };
}
