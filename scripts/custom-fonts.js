import { recursiveFileBrowse, doOnceReady } from "./helpers.js";
import registerSettings from "./settings.js";

export default class CustomFonts {
  constructor() {
    registerSettings();

    // Add the module's API
    game.modules.get("custom-fonts").api = CustomFonts;

    // Redraw drawings when their font family is updated
    Hooks.on("updateDrawing", async (doc, change) => {
      if (change.fontFamily) {
        await CustomFonts.init();
        await doc.object.draw();
      }
    });

    // Detect missing fonts
    this.missingInDocumentDetection();

    CustomFonts.init();
  }

  /** Initialize Custom Fonts */
  static async init() {
    doOnceReady(() => { if (game.user?.isGM) CustomFonts.updateFileList(); });
    await CustomFonts.dom();
    CustomFonts.config();
    Hooks.once("diceSoNiceReady", CustomFonts.diceSoNice);
    await CustomFonts.tinyMCE();
    CustomFonts.applyUIFonts();
  }

  /** The module's ID */
  static ID = "custom-fonts";

  /** List all loaded and available fonts
   * @return {Array<string>} An array of all loaded fonts (excluding Font Awesome fonts)
   */
  static list() {
    // Get the document font faces
    const fontFaces = [...document.fonts];
    // Get the family of each font face
    const fontFaceFamilies = fontFaces.map(f => f.family.replaceAll(/^\"|\"$/g, ""));
    // Get an array of font families without duplicates
    const fontFamilies = [...new Set(fontFaceFamilies)];
    // Return the fonts without the Font Awesome fonts
    return fontFamilies.filter(f => !f.includes("Font Awesome"));
  }

  /** Update the list of files available to fetch by browsing user data
   * @returns {string[]} The list of files
   */
  static async updateFileList() {
    // Try to get the list of files in the directory
    let files = [];
    try {
      // Get the custom directory from settings
      const directory = game.settings.get(CustomFonts.ID, "directory");
      // Get an array of all files in the directory and it's subdirectories
      files = await recursiveFileBrowse(directory);
    } catch (err) {
      doOnceReady(() => ui.notifications.error(`${CustomFonts.ID} | ${game.i18n.format("custom-fonts.notifications.invalidDirectory", { error: err })}`));
    }
    // Get the first 50 files with font file extensions
    const fontFiles = files.filter(file => file.split("/").at(-1).match(/\.otf|\.ttf|\.woff|\.woff2/i, "")).slice(0, 50);
    // Save file list if it's different
    if (!files.equals(game.settings.get(CustomFonts.ID, "localFiles"))) {
      game.settings.set(CustomFonts.ID, "localFiles", files);
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
    const fontFamilies = game.settings.get(CustomFonts.ID, "fonts")
      .split(",", 100).map(val => val.trim()).filter(f => f.length);

    // Construct the URL for the Google Fonts API
    if (fontFamilies.length) {
      const url = `https://fonts.googleapis.com/css2?${fontFamilies.map(f => {
        f = f.replace(" ", "+");
        f = "family=" + f;
        return f;
      }).join("&")}&display=swap`;

      // Fetch the font CSS from Google Fonts
      css = await fetch(url)
        .then(res => res.text())
        .catch(err => {
          doOnceReady(() => ui.notifications.error(`${CustomFonts.ID} | ${game.i18n.format("custom-fonts.notifications.connectionError", { error: err })}`));
        });
    }

    // Get the list of local files
    const files = game.settings.get(CustomFonts.ID, "localFiles");

    // Add each file to the CSS
    for (const file of files) {
      css += `\n@font-face {
  font-family: "${file.split("/").at(-1).replace(/\.otf|\.ttf|\.woff|\.woff2/i, "")}";
  src: url(${file});
}`;
    }
    return css;
  }

  /** Add the fonts to the core CONFIG */
  static config() {
    // List the fonts and then add each one to Foundry's list of font families if it isn't there
    CustomFonts.list().forEach(f => {
      if (!CONFIG.fontFamilies.includes(f)) CONFIG.fontFamilies.push(f);
    });
  }

  /** Add the fonts to Dice so Nice */
  static diceSoNice(dice3d) {
    CustomFonts.list().forEach(font => dice3d.addColorset({
      font: font,
      visibility: "hidden",
    }));
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

    // Add the style element to the document head
    document.head.appendChild(element);
  }

  /** Add the fonts to TinyMCE editors */
  static async tinyMCE() {
    // Add the font select toolbar button if it's not already there
    if (!CONFIG.TinyMCE.toolbar.includes("fontselect")) CONFIG.TinyMCE.toolbar += " fontselect fontsizeselect";

    // Add the fonts to the font select dropdown
    CONFIG.TinyMCE.font_formats = CustomFonts.list().join(";");

    // Add the fonts to the TinyMCE content style CSS or define it if it doesn't exist
    CONFIG.TinyMCE.content_style = CONFIG.TinyMCE.content_style ? CONFIG.TinyMCE.content_style + await CustomFonts.generateCSS() : await CustomFonts.generateCSS();
  }

  /** Apply the fonts to the CSS variables which control the font of the entire UI */
  static applyUIFonts() {
    const primary = game.settings.get(CustomFonts.ID, "primary");
    document.querySelector(":root").style.setProperty("--font-primary", primary);
    const mono = game.settings.get(CustomFonts.ID, "mono");
    document.querySelector(":root").style.setProperty("--font-mono", mono);

    // Alert if one of the UI fonts is missing
    doOnceReady(() => {
      [primary, mono].forEach(f => {
        if (!document.fonts.check(`1em ${f}`)) {
          const message = `${CustomFonts.ID} | ${game.i18n.format("custom-fonts.notifications.missingFont.message", { context: game.i18n.localize("custom-fonts.notifications.missingFont.context.ui"), font: f })}`;
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
      if (!document.fonts.check(`1em ${font}`)) {
        const message = `${CustomFonts.ID} | ${game.i18n.format("custom-fonts.notifications.missingFont.message", { context: `${game.i18n.localize(`custom-fonts.notifications.missingFont.context.${doc}`)} [${id}]`, font: font })}`;
        ui.notifications.warn(message);
        console.warn(message);
      }
    }

    // Detect if Drawings on the active scene have missing fonts
    Hooks.on("canvasReady", () => {
      canvas.drawings.placeables.filter(d => d.data.type === "t")
        .forEach(d => detect(d.data.fontFamily, "drawing", d.id));
    });

    // Detect if the viewed Journal Entry has missing fonts
    Hooks.on("renderJournalSheet", (app, html) => {
      [...html[0].innerHTML.matchAll(/(?<=\<span style="font-family:).*(?=">)/g)].map(r => r[0])
        .forEach(font => detect(font, "journal", app.object.id));
    });
  }
}

Hooks.on("init", () => new CustomFonts());
