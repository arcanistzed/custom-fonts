import CustomFonts from "./custom-fonts.js";

export default function registerSettings() {
    game.settings.register(CustomFonts.ID, "fonts", {
        name: game.i18n.localize("custom-fonts.settings.fonts.name"),
        hint: game.i18n.localize("custom-fonts.settings.fonts.hint"),
        scope: "world",
        config: true,
        default: "Grenze Gotisch, Lobster, Indie Flower",
        type: String,
        onChange: () => new CustomFonts(),
    });
    game.settings.register(CustomFonts.ID, "directory", {
        name: game.i18n.localize("custom-fonts.settings.directory.name"),
        hint: game.i18n.localize("custom-fonts.settings.directory.hint"),
        scope: "world",
        config: true,
        default: "fonts",
        type: String,
        filePicker: "folder",
        onChange: () => new CustomFonts(),
    });
    game.settings.register(CustomFonts.ID, "primary", {
        name: game.i18n.localize("custom-fonts.settings.primary.name"),
        hint: game.i18n.localize("custom-fonts.settings.primary.hint"),
        scope: "world",
        config: true,
        default: "Signika",
        type: String,
        onChange: () => new CustomFonts(),
    });
    game.settings.register(CustomFonts.ID, "mono", {
        name: game.i18n.localize("custom-fonts.settings.mono.name"),
        hint: game.i18n.localize("custom-fonts.settings.mono.hint"),
        scope: "world",
        config: true,
        default: "monospace",
        type: String,
        onChange: () => new CustomFonts(),
    });
}