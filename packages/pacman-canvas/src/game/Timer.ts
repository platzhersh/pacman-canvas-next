export class Timer {
  private time_diff = 0;
  private time_start = 0;
  private time_stop = 0;
  public start = () => {
    this.time_start = new Date().getTime();
  };
  public stop = () => {
    this.time_stop = new Date().getTime();
    this.time_diff += this.time_stop - this.time_start;
    this.time_stop = 0;
    this.time_start = 0;
  };
  public reset = () => {
    this.time_diff = 0;
    this.time_start = 0;
    this.time_stop = 0;
  };
  public get_time_diff = () => {
    return this.time_diff;
  };
}
