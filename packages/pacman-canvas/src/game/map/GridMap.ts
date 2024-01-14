import { MapData, MapTileType, mapData } from "./mapData";

export class GridMap {
  private mapData: MapData;

  constructor() {
    this.mapData = structuredClone(mapData);
  }

  public resetMapData = () => (this.mapData = structuredClone(mapData));

  public getMapData = () => this.mapData;

  public getWidth = () => this.mapData.posY[0]?.posX.length ?? 0;
  public getHeight = () => this.mapData.posY.length;

  public getTileType = (posX: number, posY: number): MapTileType => {
    let maxX = this.getWidth() - 1;
    let maxY = this.getHeight() - 1;

    if (posX < 0) posX = maxX + posX;
    if (posX > maxX) posX = posX - maxX;
    if (posY < 0) posY = maxY + posY;
    if (posY > maxY) posY = posY - maxY;

    const mapTile = this.getMapData().posY[posY]?.posX[posX];

    if (!mapTile) throw Error(`No tile found at ${posX}, ${posY}`);

    return mapTile.type;
  };

  public setTileType = (x: number, y: number, type: MapTileType): boolean => {
    const row = this.getMapData().posY[y];
    const col = row?.posX[x];
    if (col) {
      col.type = type;
      return true;
    }
    return false;
  };

  public getTileTypeCount = (type: MapTileType): number => {
    let count = 0;
    this.getMapData().posY.forEach((row) => {
      row.posX.forEach((column) => {
        if (column.type === type) count++;
      });
    });
    return count;
  };
}
