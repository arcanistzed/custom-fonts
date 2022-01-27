import CustomFonts from "./custom-fonts.js";

export default function registerSettings() {
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
    game.settings.registerMenu(CustomFonts.ID, "clearPresets", {
        name: game.i18n.localize("custom-fonts.settings.clearPresets.name"),
        label: game.i18n.localize("custom-fonts.settings.clearPresets.label"),
        hint: game.i18n.localize("custom-fonts.settings.clearPresets.hint"),
        icon: "fas fa-eraser",
        type: class extends FormApplication {
            constructor(...args) {
                super(...args);
                game.settings.set(CustomFonts.ID, "presetDirectories", []);
            }
        },
    });

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
    game.settings.register(CustomFonts.ID, "presetDirectories", {
        scope: "world",
        config: false,
        default: [],
        type: Array,
    });
    game.settings.register(CustomFonts.ID, "localFiles", {
        scope: "world",
        config: false,
        type: Array,
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

    game.settings.register(CustomFonts.ID, "sharperTextDrawings", {
        name: game.i18n.localize("custom-fonts.settings.sharperTextDrawings.name"),
        hint: game.i18n.localize("custom-fonts.settings.sharperTextDrawings.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        onChange: () => location.reload(),
    });
    game.settings.register(CustomFonts.ID, "missingFonts", {
        name: game.i18n.localize("custom-fonts.settings.missingFonts.name"),
        hint: game.i18n.localize("custom-fonts.settings.missingFonts.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });
}
