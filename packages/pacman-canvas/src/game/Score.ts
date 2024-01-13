import $ from "jquery";

export class Score {
  private score = 0;
  public set = (i: number) => {
    this.score = i;
  };
  public get = () => this.score;

  public add = (i: number) => {
    this.score += i;
  };
  public refresh = (h: string) => {
    $(h).html("Score: " + this.score);
  };
}
