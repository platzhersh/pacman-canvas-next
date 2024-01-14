export class Logger {
  private originalConsoleLog: any = null;
  private originalConsoleDebug: any = null;

  public enableLogger = () => {
    if (this.originalConsoleLog === null) return;

    window["console"]["log"] = this.originalConsoleLog;
    console.log("console.log enabled");

    if (this.originalConsoleDebug === null) return;

    window["console"]["debug"] = this.originalConsoleDebug;
    console.log("console.debug enabled");
  };

  public disableLogger = () => {
    console.log("console.log disabled");
    this.originalConsoleLog = console.log;
    window["console"]["log"] = function () {};
    this.originalConsoleDebug = console.debug;
    window["console"]["debug"] = function () {};
  };
}
