import CustomFonts from "./custom-fonts.js";

export default function registerSettings() {
    game.settings.register(CustomFonts.ID, "fonts", {
        name: game.i18n.localize("custom-fonts.settings.fonts.name"),
        hint: game.i18n.localize("custom-fonts.settings.fonts.hint"),
        scope: "world",
        config: true,
        default: "Grenze Gotisch, Lobster, Indie Flower",
        type: String,
        onChange: () => CustomFonts.init(),
    });

    game.settings.register(CustomFonts.ID, "directory", {
        name: game.i18n.localize("custom-fonts.settings.directory.name"),
        hint: game.i18n.localize("custom-fonts.settings.directory.hint"),
        scope: "world",
        config: true,
        default: "",
        type: String,
        filePicker: "folder",
        onChange: () => CustomFonts.init(),
    });
    game.settings.register(CustomFonts.ID, "localFiles", {
        scope: "world",
        config: false,
        type: Object,
        onChange: () => CustomFonts.init(),
    });

    game.settings.register(CustomFonts.ID, "primary", {
        name: game.i18n.localize("custom-fonts.settings.primary.name"),
        hint: game.i18n.localize("custom-fonts.settings.primary.hint"),
        scope: "world",
        config: true,
        default: "Signika",
        type: String,
        onChange: () => CustomFonts.init(),
    });
    game.settings.register(CustomFonts.ID, "mono", {
        name: game.i18n.localize("custom-fonts.settings.mono.name"),
        hint: game.i18n.localize("custom-fonts.settings.mono.hint"),
        scope: "world",
        config: true,
        default: "monospace",
        type: String,
        onChange: () => CustomFonts.init(),
    });

    game.settings.register(CustomFonts.ID, "crisperTextDrawings", {
        name: game.i18n.localize("custom-fonts.settings.crisperTextDrawings.name"),
        hint: game.i18n.localize("custom-fonts.settings.crisperTextDrawings.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        onChange: () => location.reload(),
    });

    game.settings.registerMenu(CustomFonts.ID, "downloadCSS", {
        name: game.i18n.localize("custom-fonts.settings.downloadCSS.name"),
        label: game.i18n.localize("custom-fonts.settings.downloadCSS.label"),
        hint: game.i18n.localize("custom-fonts.settings.downloadCSS.hint"),
        icon: "fas fa-download",
        type: class extends FormApplication {
            constructor(...args) {
                super(...args);
                (async () => saveDataToFile(await CustomFonts.generateCSS(), "text/css", "Custom Fonts"))();
            }
        },
    });
}
