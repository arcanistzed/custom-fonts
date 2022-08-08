import CustomFonts from "./custom-fonts.js";
import { recursiveFontFileBrowse, doOnceReady } from "./helpers.js";

export default function registerPresets() {
	return [...game.modules.values()]
		.filter(m => m.active && m.data.flags["custom-fonts"])
		.map(p => new CustomFontsPreset(p));
}

class CustomFontsPreset {
	constructor(module) {
		this.data = module.data;
		doOnceReady(() => this.load(this.data.flags["custom-fonts"]));
	}

	get name() {
		return this.data.name;
	}
	get title() {
		return this.data.title;
	}
	get path() {
		return `modules/${this.data.name}/`;
	}

	findNewFonts(fonts, existing) {
		return fonts.filter(f => !existing.includes(f));
	}

	/**
	 * @typedef {Object} Preset
	 * @property {string[]} fonts
	 * @property {string} directory
	 * @property {string} primary
	 * @property {string} mono
	 */

	/** Register a preset for Custom Fonts
	 * @param {Preset} preset
	 */
	async load(preset) {
		try {
			const { fonts, directory, primary, mono } = preset;

			if (fonts) {
				const existing = game.settings.get(CustomFonts.ID, "fonts");
				await game.settings.set(
					CustomFonts.ID,
					"fonts",
					[existing, this.findNewFonts(fonts, existing)].filter(x => x.length).join(", ")
				);
			}

			if (directory) {
				const existing = game.settings.get(CustomFonts.ID, "presetDirectories");
				if (!existing.includes(this.path + directory))
					game.settings.set(CustomFonts.ID, "presetDirectories", [...existing, this.path + directory]);
				CustomFonts.updateFileList();
			}

			if (primary) {
				await game.settings.set(CustomFonts.ID, "primary", primary);
			}

			if (mono) {
				await game.settings.set(CustomFonts.ID, "mono", mono);
			}

			ui.notifications.info(
				`${CustomFonts.ID} | ${game.i18n.format("custom-fonts.notifications.presetLoaded", {
					preset: this.title,
				})}`
			);
		} catch (err) {
			doOnceReady(() => {
				const message = `${CustomFonts.ID} | ${game.i18n.format("custom-fonts.notifications.invalidPreset", {
					preset: this.title,
					error: err,
				})}`;
				ui.notifications.warn(message);
				console.warn(message, err);
			});
		}
	}
}
