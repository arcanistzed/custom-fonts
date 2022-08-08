import { recursiveFontFileBrowse, doOnceReady } from "./helpers.js";
import registerPresets from "./presets.js";
import registerSettings from "./settings.js";

export default class CustomFonts {
	constructor() {
		registerSettings();

		// Add the module's API
		game.modules.get(CustomFonts.ID).api = CustomFonts;

		// Register presets
		doOnceReady(() => {
			if (game.user.isGM) registerPresets();
		});

		// Redraw drawings when their font family is updated
		Hooks.on("updateDrawing", async (doc, change) => {
			if (change.fontFamily) {
				await CustomFonts.init();
				await doc.object.draw();
			}
		});

		// Preview fonts in the Drawing Config
		Hooks.on("renderDrawingConfig", (_app, html) => {
			html[0].querySelectorAll("select[name='fontFamily'], select[name='fontFamily'] option").forEach(element => {
				const setFont = el => (el.style.fontFamily = `"${el.value}"`);
				element.addEventListener("change", event => setFont(event.currentTarget));
				setFont(element);
			});
		});

		// Detect missing fonts
		if (game.settings.get(CustomFonts.ID, "missingFonts")) this.missingInDocumentDetection();

		// Sharper text drawings
		if (game.settings.get(CustomFonts.ID, "sharperTextDrawings")) this.sharperTextDrawings();

		CustomFonts.init();
	}

	/** Initialize Custom Fonts */
	static async init() {
		doOnceReady(() => {
			if (game.user?.isGM) CustomFonts.updateFileList();
		});
		await CustomFonts.dom();
		CustomFonts.config();
		Hooks.once("diceSoNiceReady", dice3d => {
			if (game.settings.get(CustomFonts.ID, "diceSoNice")) CustomFonts.diceSoNice(dice3d);
		});
		await CustomFonts.tinyMCE();
		CustomFonts.applyUIFonts();
	}

	/** The module's ID */
	static ID = "custom-fonts";

	/** Registered presets */
	static get presets() {
		return registerPresets();
	}

	/** List all loaded and available fonts
	 * @return {Array<string>} An array of all loaded fonts (excluding Font Awesome fonts)
	 */
	static get list() {
		// Memoize the list
		if (CustomFonts.#list) return CustomFonts.#list;

		// Get the document font faces
		const fontFaces = [...document.fonts];
		// Get the family of each font face
		const fontFaceFamilies = fontFaces.map(f => decodeURI(f.family.replaceAll(/^\"|\"$/g, "")));
		// Get an array of font families without duplicates
		const fontFamilies = [...new Set(fontFaceFamilies)];
		// Filter out the Font Awesome fonts
		CustomFonts.#list = fontFamilies.filter(f => !f.includes("Font Awesome"));
		return CustomFonts.#list;
	}
	static #list;

	/** Update the list of files available to fetch by browsing user data
	 * @returns {string[]} The list of files
	 */
	static async updateFileList() {
		let files = [];

		// Get all font directories
		const directories = [
			game.settings.get(CustomFonts.ID, "directory"),
			...game.settings.get(CustomFonts.ID, "presetDirectories"),
		];

		// Go through each directory
		for (const directory of directories) {
			if (!directory) continue;

			// Get an array of all font files in the directory
			files.push(...(await recursiveFontFileBrowse(directory)));
		}

		// Save file list if it's different
		if (!files.equals(game.settings.get(CustomFonts.ID, "localFiles"))) {
			await game.settings.set(CustomFonts.ID, "localFiles", files);
			await CustomFonts.init();
		}
		return files;
	}

	/** Generate the CSS for loading all of the fonts
	 * @return {Promise<string>} The CSS for loading the fonts
	 */
	static async generateCSS() {
		let css = "";

		// Get the fonts from the settings
		const fontFamilies = game.settings
			.get(CustomFonts.ID, "fonts")
			.split(",", 100)
			.map(val => val.trim())
			.filter(f => f.length);

		// If there are any font families
		if (fontFamilies.length) {
			if (game.settings.get(CustomFonts.ID, "googleFontsConsent")) {
				// Construct the URL for the Google Fonts API
				const url = `https://fonts.googleapis.com/css2?${fontFamilies
					.map(f => {
						f = f.replace(" ", "+");
						f = "family=" + f;
						return f;
					})
					.join("&")}&display=swap`;

				// Fetch the font CSS from Google Fonts
				css = await fetch(url)
					.then(res => res.text())
					.catch(err => {
						doOnceReady(() => {
							const message = `${CustomFonts.ID} | ${game.i18n.format(
								"custom-fonts.notifications.connectionError",
								{ error: err }
							)}`;
							ui.notifications.warn(message);
							console.warn(message);
						});
					});
			} else {
				doOnceReady(() => {
					if (!game.settings.get(CustomFonts.ID, "googleFontsConsent")) {
						Dialog.confirm({
							title: game.i18n.localize("custom-fonts.dialog.googleFontsConsent.title"),
							content: game.i18n.localize("custom-fonts.dialog.googleFontsConsent.content"),
							yes: async () => {
								await game.settings.set(CustomFonts.ID, "googleFontsConsent", true);
								location.reload();
							},
						});
					}
				});
			}
		}

		// Get the list of local files
		const files = game.settings.get(CustomFonts.ID, "localFiles");

		// Add each file to the CSS
		for (const file of files) {
			css += `\n@font-face {
  font-family: "${decodeURI(
		file
			.split("/")
			.at(-1)
			.replace(/\.otf|\.ttf|\.woff|\.woff2/i, "")
  )}";
  src: url(${file});
}`;
		}
		return css;
	}

	/** Add the fonts to the core CONFIG */
	static config() {
		// List the fonts and then add each one to Foundry's list of font families if it isn't there
		CustomFonts.list.forEach(f => {
			if (!CONFIG.fontFamilies.includes(f)) CONFIG.fontFamilies.push(f);
		});

		// Use primary font family for Drawings
		CONFIG.defaultFontFamily = game.settings.get(CustomFonts.ID, "primary");
	}

	/** Add the fonts to Dice so Nice */
	static diceSoNice(dice3d) {
		CustomFonts.list.forEach(async f => {
			try {
				await document.fonts.load(`1em "${f}"`);

				dice3d.addColorset({
					font: f,
					visibility: "hidden",
				});
			} catch (error) {
				const message = `${CustomFonts.ID} | ${game.i18n.format(
					"custom-fonts.notifications.dsnFailedToRegister",
					{ font: f, error }
				)}`;
				ui.notifications.warn(message);
				console.warn(message);
			}
		});
	}

	/** Add the fonts to the DOM */
	static async dom() {
		// Remove the old element
		document.querySelector("#custom-fonts")?.remove();

		// Create a new style element
		const element = document.createElement("style");
		element.id = CustomFonts.ID;

		// Insert the generated CSS into the style element
		element.innerHTML = await CustomFonts.generateCSS();

		// Force the primary font if enabled
		if (game.settings.get(CustomFonts.ID, "forcePrimaryFont")) {
			element.innerHTML += `\n*, *::before, *::after { font-family: var(--font-primary)!important; }`;
		}

		// Add the style element to the document head
		document.head.appendChild(element);
	}

	/** Add the fonts to TinyMCE editors */
	static async tinyMCE() {
		// Add the toolbar buttons and make sure they are all unique
		CONFIG.TinyMCE.toolbar = [
			...new Set([
				...CONFIG.TinyMCE.toolbar.split(" "),
				"fontselect",
				"fontsizeselect",
				"forecolor",
				"backcolor",
			]),
		].join(" ");

		// Add the fonts to the dropdown
		let font_formats = (CONFIG.TinyMCE.font_formats || "").split(";").reduce((obj, f) => {
			let parts = f.split("=");
			if (parts[0]) obj[parts[0]] = parts[1];
			return obj;
		}, {});
		mergeObject(font_formats, Object.fromEntries(CustomFonts.list.map(k => [k, k])));
		CONFIG.TinyMCE.font_formats = Object.entries(font_formats)
			.map(([k, v]) => k + "=" + v)
			.join(";");

		// Add Google Docs font sizes
		CONFIG.TinyMCE.fontsize_formats = [
			"8",
			"9",
			"10",
			"11",
			"12",
			"14",
			"18",
			"24",
			"30",
			"36",
			"48",
			"60",
			"72",
			"96",
		]
			.map(s => s + "pt")
			.join(" ");

		// Add the fonts to the TinyMCE content style CSS or define it if it doesn't exist
		CONFIG.TinyMCE.content_style = CONFIG.TinyMCE.content_style
			? CONFIG.TinyMCE.content_style + (await CustomFonts.generateCSS())
			: await CustomFonts.generateCSS();
	}

	/** Apply the fonts to the CSS variables which control the font of the entire UI */
	static applyUIFonts() {
		const root = document.querySelector(":root");

		const primary = game.settings.get(CustomFonts.ID, "primary");
		if (primary) {
			root.style.setProperty("--font-primary", `${primary}, "Font Awesome 5 Free"`);
		} else {
			root.style.removeProperty("--font-primary");
		}

		const mono = game.settings.get(CustomFonts.ID, "mono");
		if (mono) {
			root.style.setProperty("--font-mono", mono);
		} else {
			root.style.removeProperty("--font-mono");
		}

		// Alert if one of the UI fonts is missing
		doOnceReady(() => {
			if (game.settings.get(CustomFonts.ID, "missingFonts"))
				[primary, mono].forEach(f => {
					if (f && !document.fonts.check(`1em "${f}"`)) {
						const message = `${CustomFonts.ID} | ${game.i18n.format(
							"custom-fonts.notifications.missingFont.message",
							{
								context: game.i18n.localize("custom-fonts.notifications.missingFont.context.ui"),
								font: f,
							}
						)}`;
						ui.notifications.warn(message);
						console.warn(message);
					}
				});
		});
	}

	/** Alert user about missing fonts in their Documents */
	missingInDocumentDetection() {
		/** Detect if a font is missing in the Document and alert the user
		 * @param {*} font The font to check for
		 * @param {*} doc The Document type
		 * @param {*} id The Document ID
		 */
		function detect(font, doc, id = "") {
			doOnceReady(() => {
				try {
					if (!document.fonts.check(`1em "${font}"`)) {
						const message = `${CustomFonts.ID} | ${game.i18n.format(
							"custom-fonts.notifications.missingFont.message",
							{
								context: `${game.i18n.localize(
									`custom-fonts.notifications.missingFont.context.${doc}`
								)} [${id}]`,
								font: font,
							}
						)}`;
						ui.notifications.warn(message);
						console.warn(message);
					}
				} catch (err) {
					console.warn(err);
				}
			});
		}

		// Detect if Drawings on the active scene have missing fonts
		Hooks.on("canvasReady", () => {
			canvas.drawings.placeables
				.filter(d => d.data.type === "t")
				.forEach(d => detect(d.data.fontFamily, "drawing", d.id));
		});

		// Detect if the viewed Journal Entry has missing fonts
		Hooks.on("renderJournalSheet", (app, html) => {
			[...html[0].innerHTML.matchAll(/(?<=\<span style="font-family:)[^";,]*/g)]
				.map(r => r[0])
				.filter(font => CustomFonts.list.includes(font))
				.forEach(font => detect(font, "journal", app.object.id));
		});
	}

	sharperTextDrawings() {
		// Verify libWrapper is enabled
		if (!game.modules.get("lib-wrapper")?.active) {
			doOnceReady(() => {
				const message = `${CustomFonts.ID} | ${game.i18n.format(
					"custom-fonts.notifications.libWrapperRequired"
				)}`;
				ui.notifications.warn(message);
				console.warn(message);
			});
			return;
		}

		// Unregister any existing wrappers
		libWrapper.unregister_all(CustomFonts.ID);

		// Register a wrapper for the Drawing create text method
		libWrapper.register(
			CustomFonts.ID,
			"Drawing.prototype._createText",
			// The following function is mostly core code. It is used under the Foundry Virtual Tabletop Limited License Agreement for module development
			function (wrapped, textStyle) {
				if (this.text && !this.text._destroyed) {
					this.text.destroy();
					this.text = null;
				}

				// Define the text style
				textStyle = new PIXI.TextStyle(
					mergeObject(wrapped(textStyle).style, {
						dropShadow: false,
						strokeThickness: 0,
						padding: 100,
					})
				);

				// Create the text container
				const text = new PreciseText(this.data.text, textStyle);
				text.resolution = 5;
				return text;
			},
			"WRAPPER"
		);
	}
}

Hooks.on("init", () => new CustomFonts());
