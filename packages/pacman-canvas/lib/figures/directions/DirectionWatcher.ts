import { Direction } from "./Direction";

export class DirectionWatcher {
  private dir: Direction | null = null;
  public set = (dir: Direction | null) => {
    this.dir = dir;
  };
  public get = () => {
    return this.dir;
  };
}
