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

  Fonts.drawDrawings();
  Hooks.callAll(`${constants.moduleName}:afterReady`);
});


