import { isInRange } from "../../figures/Figure";

export type MapData = {
  posY: MapRow[];
};

export type MapRow = {
  row: number;
  posX: MapColumn[];
};

export type MapColumn = {
  col: number;
  type: MapTileType;
};

export type MapTileType = "🟦" | "⚪️" | "💊" | "door" | "null" | "ghosthouse";

type GridMapCoordinate = {
  posY: number;
  row: number;
  posX: number;
  col: number;
};
export const isInDoorGridPos = (posX: number, posY: number) => {
  const doorGridPosY = 4;
  const doorGridPosXFirst = 8;
  const doorGridPosXLast = 9;

  return (
    posY === doorGridPosY &&
    isInRange(posX, doorGridPosXFirst, doorGridPosXLast)
  );
};

export const ghosthouseGridPosY = 5;
export const ghosthouseGridPosXFirst = 7;
export const ghosthouseGridPosXLast = 10;

export const mapData: MapData = {
  posY: [
    {
      row: 1,
      posX: [
        { col: 1, type: "🟦" },
        { col: 2, type: "🟦" },
        { col: 3, type: "🟦" },
        { col: 4, type: "🟦" },
        { col: 5, type: "🟦" },
        { col: 6, type: "🟦" },
        { col: 7, type: "🟦" },
        { col: 8, type: "🟦" },
        { col: 9, type: "🟦" },
        { col: 10, type: "🟦" },
        { col: 11, type: "🟦" },
        { col: 12, type: "🟦" },
        { col: 13, type: "🟦" },
        { col: 14, type: "🟦" },
        { col: 15, type: "🟦" },
        { col: 16, type: "🟦" },
        { col: 17, type: "🟦" },
        { col: 18, type: "🟦" },
      ],
    },
    {
      row: 2,
      posX: [
        { col: 1, type: "🟦" },
        { col: 2, type: "💊" },
        { col: 3, type: "⚪️" },
        { col: 4, type: "⚪️" },
        { col: 5, type: "🟦" },
        { col: 6, type: "⚪️" },
        { col: 7, type: "⚪️" },
        { col: 8, type: "⚪️" },
        { col: 9, type: "⚪️" },
        { col: 10, type: "⚪️" },
        { col: 11, type: "⚪️" },
        { col: 12, type: "⚪️" },
        { col: 13, type: "⚪️" },
        { col: 14, type: "🟦" },
        { col: 15, type: "⚪️" },
        { col: 16, type: "⚪️" },
        { col: 17, type: "💊" },
        { col: 18, type: "🟦" },
      ],
    },
    {
      row: 3,
      posX: [
        { col: 1, type: "🟦" },
        { col: 2, type: "⚪️" },
        { col: 3, type: "🟦" },
        { col: 4, type: "⚪️" },
        { col: 5, type: "⚪️" },
        { col: 6, type: "⚪️" },
        { col: 7, type: "🟦" },
        { col: 8, type: "🟦" },
        { col: 9, type: "⚪️" },
        { col: 10, type: "⚪️" },
        { col: 11, type: "🟦" },
        { col: 12, type: "🟦" },
        { col: 13, type: "⚪️" },
        { col: 14, type: "⚪️" },
        { col: 15, type: "⚪️" },
        { col: 16, type: "🟦" },
        { col: 17, type: "⚪️" },
        { col: 18, type: "🟦" },
      ],
    },
    {
      row: 4,
      posX: [
        { col: 1, type: "🟦" },
        { col: 2, type: "⚪️" },
        { col: 3, type: "🟦" },
        { col: 4, type: "🟦" },
        { col: 5, type: "⚪️" },
        { col: 6, type: "🟦" },
        { col: 7, type: "⚪️" },
        { col: 8, type: "⚪️" },
        { col: 9, type: "⚪️" },
        { col: 10, type: "⚪️" },
        { col: 11, type: "⚪️" },
        { col: 12, type: "⚪️" },
        { col: 13, type: "🟦" },
        { col: 14, type: "⚪️" },
        { col: 15, type: "🟦" },
        { col: 16, type: "🟦" },
        { col: 17, type: "⚪️" },
        { col: 18, type: "🟦" },
      ],
    },
    {
      row: 5,
      posX: [
        { col: 1, type: "🟦" },
        { col: 2, type: "⚪️" },
        { col: 3, type: "⚪️" },
        { col: 4, type: "🟦" },
        { col: 5, type: "⚪️" },
        { col: 6, type: "⚪️" },
        { col: 7, type: "⚪️" },
        { col: 8, type: "🟦" },
        { col: 9, type: "door" },
        { col: 10, type: "door" },
        { col: 11, type: "🟦" },
        { col: 12, type: "⚪️" },
        { col: 13, type: "⚪️" },
        { col: 14, type: "⚪️" },
        { col: 15, type: "🟦" },
        { col: 16, type: "⚪️" },
        { col: 17, type: "⚪️" },
        { col: 18, type: "🟦" },
      ],
    },
    {
      row: 6,
      posX: [
        { col: 1, type: "🟦" },
        { col: 2, type: "🟦" },
        { col: 3, type: "⚪️" },
        { col: 4, type: "🟦" },
        { col: 5, type: "🟦" },
        { col: 6, type: "⚪️" },
        { col: 7, type: "🟦" },
        { col: 8, type: "ghosthouse" },
        { col: 9, type: "ghosthouse" },
        { col: 10, type: "ghosthouse" },
        { col: 11, type: "ghosthouse" },
        { col: 12, type: "🟦" },
        { col: 13, type: "⚪️" },
        { col: 14, type: "🟦" },
        { col: 15, type: "🟦" },
        { col: 16, type: "⚪️" },
        { col: 17, type: "🟦" },
        { col: 18, type: "🟦" },
      ],
    },
    {
      row: 7,
      posX: [
        { col: 1, type: "⚪️" },
        { col: 2, type: "⚪️" },
        { col: 3, type: "⚪️" },
        { col: 4, type: "⚪️" },
        { col: 5, type: "⚪️" },
        { col: 6, type: "⚪️" },
        { col: 7, type: "🟦" },
        { col: 8, type: "🟦" },
        { col: 9, type: "🟦" },
        { col: 10, type: "🟦" },
        { col: 11, type: "🟦" },
        { col: 12, type: "🟦" },
        { col: 13, type: "⚪️" },
        { col: 14, type: "⚪️" },
        { col: 15, type: "⚪️" },
        { col: 16, type: "⚪️" },
        { col: 17, type: "⚪️" },
        { col: 18, type: "⚪️" },
      ],
    },
    {
      row: 8,
      posX: [
        { col: 1, type: "🟦" },
        { col: 2, type: "🟦" },
        { col: 3, type: "⚪️" },
        { col: 4, type: "🟦" },
        { col: 5, type: "🟦" },
        { col: 6, type: "⚪️" },
        { col: 7, type: "⚪️" },
        { col: 8, type: "⚪️" },
        { col: 9, type: "⚪️" },
        { col: 10, type: "⚪️" },
        { col: 11, type: "⚪️" },
        { col: 12, type: "⚪️" },
        { col: 13, type: "⚪️" },
        { col: 14, type: "🟦" },
        { col: 15, type: "🟦" },
        { col: 16, type: "⚪️" },
        { col: 17, type: "🟦" },
        { col: 18, type: "🟦" },
      ],
    },
    {
      row: 9,
      posX: [
        { col: 1, type: "🟦" },
        { col: 2, type: "🟦" },
        { col: 3, type: "⚪️" },
        { col: 4, type: "🟦" },
        { col: 5, type: "🟦" },
        { col: 6, type: "🟦" },
        { col: 7, type: "🟦" },
        { col: 8, type: "🟦" },
        { col: 9, type: "⚪️" },
        { col: 10, type: "⚪️" },
        { col: 11, type: "🟦" },
        { col: 12, type: "🟦" },
        { col: 13, type: "🟦" },
        { col: 14, type: "🟦" },
        { col: 15, type: "🟦" },
        { col: 16, type: "⚪️" },
        { col: 17, type: "🟦" },
        { col: 18, type: "🟦" },
      ],
    },
    {
      row: 10,
      posX: [
        { col: 1, type: "🟦" },
        { col: 2, type: "⚪️" },
        { col: 3, type: "⚪️" },
        { col: 4, type: "⚪️" },
        { col: 5, type: "🟦" },
        { col: 6, type: "🟦" },
        { col: 7, type: "⚪️" },
        { col: 8, type: "⚪️" },
        { col: 9, type: "⚪️" },
        { col: 10, type: "⚪️" },
        { col: 11, type: "⚪️" },
        { col: 12, type: "⚪️" },
        { col: 13, type: "🟦" },
        { col: 14, type: "🟦" },
        { col: 15, type: "⚪️" },
        { col: 16, type: "⚪️" },
        { col: 17, type: "⚪️" },
        { col: 18, type: "🟦" },
      ],
    },
    {
      row: 11,
      posX: [
        { col: 1, type: "🟦" },
        { col: 2, type: "⚪️" },
        { col: 3, type: "🟦" },
        { col: 4, type: "⚪️" },
        { col: 5, type: "⚪️" },
        { col: 6, type: "⚪️" },
        { col: 7, type: "⚪️" },
        { col: 8, type: "🟦" },
        { col: 9, type: "🟦" },
        { col: 10, type: "🟦" },
        { col: 11, type: "🟦" },
        { col: 12, type: "⚪️" },
        { col: 13, type: "⚪️" },
        { col: 14, type: "⚪️" },
        { col: 15, type: "⚪️" },
        { col: 16, type: "🟦" },
        { col: 17, type: "⚪️" },
        { col: 18, type: "🟦" },
      ],
    },
    {
      row: 12,
      posX: [
        { col: 1, type: "🟦" },
        { col: 2, type: "💊" },
        { col: 3, type: "⚪️" },
        { col: 4, type: "⚪️" },
        { col: 5, type: "🟦" },
        { col: 6, type: "🟦" },
        { col: 7, type: "⚪️" },
        { col: 8, type: "⚪️" },
        { col: 9, type: "⚪️" },
        { col: 10, type: "⚪️" },
        { col: 11, type: "⚪️" },
        { col: 12, type: "⚪️" },
        { col: 13, type: "🟦" },
        { col: 14, type: "🟦" },
        { col: 15, type: "⚪️" },
        { col: 16, type: "⚪️" },
        { col: 17, type: "💊" },
        { col: 18, type: "🟦" },
      ],
    },
    {
      row: 13,
      posX: [
        { col: 1, type: "🟦" },
        { col: 2, type: "🟦" },
        { col: 3, type: "🟦" },
        { col: 4, type: "🟦" },
        { col: 5, type: "🟦" },
        { col: 6, type: "🟦" },
        { col: 7, type: "🟦" },
        { col: 8, type: "🟦" },
        { col: 9, type: "🟦" },
        { col: 10, type: "🟦" },
        { col: 11, type: "🟦" },
        { col: 12, type: "🟦" },
        { col: 13, type: "🟦" },
        { col: 14, type: "🟦" },
        { col: 15, type: "🟦" },
        { col: 16, type: "🟦" },
        { col: 17, type: "🟦" },
        { col: 18, type: "🟦" },
      ],
    },
  ],
};
