import constants from "./constants.mjs";
import registerSettings from "./settings.js";
import Fonts from "./Fonts.js";

Hooks.once('init', () => {
  registerSettings();
  Fonts.render();

  Hooks.callAll(`${constants.moduleName}:afterInit`);
});

Hooks.once('setup', () => {

  Hooks.callAll(`${constants.moduleName}:afterSetup`);
});

Hooks.once("ready", () => {

  Hooks.callAll(`${constants.moduleName}:afterReady`);
});

Hooks.once("canvasReady", () => {

  setTimeout(Fonts.drawDrawings, 2000);
  Hooks.callAll(`${constants.moduleName}:afterCanvasReady`);
});

Hooks.on("updateDrawing", (scene, drawing, update, options, user) => {
  if (update.fontFamily) setTimeout(Fonts.drawDrawings, 2000);
});

