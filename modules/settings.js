import constants from "./constants.mjs";
import Fonts from "./Fonts.js";

export default function registerSettings() {

  game.settings.register(constants.moduleName, "fonts", {
    name: "ForienCustomFonts.Settings.fonts.name",
    hint: "ForienCustomFonts.Settings.fonts.hint",
    scope: "world",
    config: true,
    default: 'Grenze Gotisch,Lobster,Indie Flower',
    type: String,
    onChange: () => Fonts.render({settings: true})
  });

  game.settings.register(constants.moduleName, "playersWelcomeScreen", {
    name: "ForienCustomFonts.Settings.playersWelcomeScreen.Enable",
    hint: "ForienCustomFonts.Settings.playersWelcomeScreen.EnableHint",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });
}