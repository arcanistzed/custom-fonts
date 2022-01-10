import CustomFonts from "./custom-fonts.js";
import { recursiveFileBrowse } from "./helpers.js";

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
        default: "",
        type: String,
        filePicker: "folder",
        onChange: async () => {
            // Try to get the list of files in the directory
            let files = [];
            try {
                // Get the custom directory from settings
                const directory = game.settings.get(CustomFonts.ID, "directory");
                // Get an array of all files in the directory and it's subdirectories
                files = await recursiveFileBrowse(directory);
            } catch (err) {
                Hooks.once("ready", () => ui.notifications.error(`${CustomFonts.ID} | ${game.i18n.format("custom-fonts.notifications.invalidDirectory", { error: err })}`));
            }
            game.settings.set(CustomFonts.ID, "localFiles", files);
        },
    });
    game.settings.register(CustomFonts.ID, "localFiles", {
        scope: "world",
        config: false,
        type: Object,
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