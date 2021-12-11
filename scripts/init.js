import registerSettings from "./settings.js";
import Fonts from "./fonts.js";

Hooks.once('init', () => {
  registerSettings();
  Fonts.render();
});

Hooks.once("canvasReady", () => {
  setTimeout(Fonts.drawDrawings, 2000);
});

Hooks.on("updateDrawing", (_scene, _drawing, update, _options, _user) => {
  console.log(arguments)
  if (update.fontFamily) setTimeout(Fonts.drawDrawings, 2000);
});

