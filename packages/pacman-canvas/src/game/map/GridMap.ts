import { MapData, MapTileType, mapData } from "./mapData";

export class GridMap {
  private mapData: MapData = mapData;

  public getMapData = () => this.mapData;

  public getWidth = () => this.mapData.posY[0]?.posX.length ?? 0;
  public getHeight = () => this.mapData.posY.length;

  public getTileType = (x: number, y: number): MapTileType => {
    let maxX = this.getWidth() - 1;
    let maxY = this.getHeight() - 1;

    if (x < 0) x = maxX + x;
    if (x > maxX) x = x - maxX;
    if (y < 0) y = maxY + y;
    if (y > maxY) y = y - maxY;

    const mapTile = this.mapData.posY[y]?.posX[x];

    if (!mapTile) throw Error(`No tile found at ${x}, ${y}`);

    return mapTile.type;
  };

  public setTileType = (x: number, y: number, type: MapTileType): boolean => {
    const row = this.mapData.posY[y];
    const col = row?.posX[x];
    if (col) {
      col.type = type;
      return true;
    }
    return false;
  };

  public getTileTypeCount = (type: MapTileType): number => {
    let count = 0;
    this.mapData.posY.forEach((row) => {
      row.posX.forEach((column) => {
        if (column.type === type) count++;
      });
    });
    return count;
  };
}
