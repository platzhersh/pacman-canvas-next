import { Pacman } from "../../figures/Pacman";
import { logger } from "../../logger";
import { Game } from "../Game";
import { renderContent } from "../render/render";
import { onKeyDown } from "./onKeyDown";

const hideAdressbar = () => {
  console.log("hide adressbar");
  $("html").scrollTop(1);
  $("body").scrollTop(1);
};

export const onDocumentReady = (game: Game, pacman: Pacman) => () => {
  if (!["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    logger.disableLogger();
  }

  $.ajaxSetup({
    mimeType: "application/json",
  });

  $.ajaxSetup({
    beforeSend: function (xhr) {
      if (xhr.overrideMimeType) {
        xhr.overrideMimeType("application/json");
      }
    },
  });

  // Hide address bar
  hideAdressbar();

  // TODO: Check this whole appcache thing
  // if (window.applicationCache != null) checkAppCache();

  /* -------------------- EVENT LISTENERS -------------------------- */

  // Listen for resize changes
  /*window.addEventListener("resize", function() {
        // Get screen size (inner/outerWidth, inner/outerHeight)
        // deactivated because of problems
        if ((window.outerHeight < window.outerWidth) && (window.outerHeight < 720)) {
        game.pauseAndShowMessage("Rotate Device","Your screen is too small to play in landscape view.");
        console.log("rotate your device to portrait!");
        }
    }, false);*/

  // --------------- Controls

  // Keyboard
  window.addEventListener("keydown", onKeyDown(pacman, game), true);

  // pause / resume game on canvas click
  $("#canvas-container").click(function () {
    if (!game.isGameOver()) game.pauseResume();
  });

  // Menu
  $(document).on("click", ".button#newGame", function (event) {
    game.newGame();
  });
  $(document).on("click", ".button#instructions", function (event) {
    game.showContent("instructions-content");
  });
  $(document).on("click", ".button#info", function (event) {
    game.showContent("info-content");
  });
  // back button
  $(document).on("click", ".button#back", function (event) {
    game.showContent("game-content");
  });
  // toggleSound
  $(document).on("click", ".controlSound", function (event) {
    game.toggleSound();
  });

  const canvas: HTMLCanvasElement = $("#myCanvas").get(0) as HTMLCanvasElement;
  const context = canvas?.getContext("2d");

  /* --------------- GAME INITIALISATION ------------------------------------
    
        TODO: put this into Game object and change code to accept different setups / levels
    
    -------------------------------------------------------------------------- */

  game.init("NewGame");

  renderContent(game, context!);
};
