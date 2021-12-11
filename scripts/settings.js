import Fonts from "./fonts.js";

export default function registerSettings() {
  game.settings.register(Fonts.ID, "fonts", {
    name: "custom-fonts.settings.fonts.name",
    hint: "custom-fonts.settings.fonts.hint",
    scope: "world",
    config: true,
    default: 'Grenze Gotisch,Lobster,Indie Flower',
    type: String,
    onChange: () => Fonts.render({ settings: true })
  });
}