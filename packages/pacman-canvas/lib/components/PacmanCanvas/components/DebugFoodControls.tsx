import React, { useEffect, useRef, useState } from "react";
import { GRID_SIZE } from "../../../game/Game";
import { FoodHandler } from "../../../game/food/FoodHandler";
import Logger from "js-logger";

export const DebugFoodControls = () => {
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const [foodCanvasContext, setFoodCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef2.current) {
      Logger.debug("canvasRef2.current", canvasRef2.current);
      const context = canvasRef2.current.getContext("2d");
      Logger.debug("context", context);
      setFoodCanvasContext(canvasRef2.current.getContext("2d"));
    }

    Logger.debug("foodCanvasContext", foodCanvasContext);
  }, []);

  const foodHandler = new FoodHandler();

  return (
    <>
      <canvas
        //   ref={(c) => c ? setCanvasContext(c.getContext('2d')) : null}
        ref={canvasRef2}
        style={{ background: "black" }}
        id="myCanvas2"
        width="30"
        height="30"
      >
        <p>Canvas not supported</p>
      </canvas>
      <button
        onClick={() => {
          if (foodCanvasContext) {
            Logger.info("draw food", foodHandler, foodCanvasContext);
            foodCanvasContext.clearRect(0, 0, GRID_SIZE, GRID_SIZE);
            foodHandler.draw(foodCanvasContext, 0, 0, GRID_SIZE, GRID_SIZE);
          }
        }}
      >
        draw food
      </button>
      <button onClick={() => foodHandler.shuffle()}>shuffle</button>
      <button
        onClick={() => foodCanvasContext?.clearRect(0, 0, GRID_SIZE, GRID_SIZE)}
      >
        clear
      </button>
    </>
  );
};
