import { recursiveFileBrowse } from "./helpers.js";
import registerSettings from "./settings.js";

export default class CustomFonts {
  constructor() {
    (async () => {
      registerSettings();
      await this.dom();
      await this.config();
      await this.tinyMCE();
      this.applyUIFonts();
    })();
  };

  /** The module's ID */
  static ID = "custom-fonts";

  /** List all loaded fonts
   * Taken from https://stackoverflow.com/a/62399430
   * @return {Array<string>} An array of all loaded fonts (excluding Font Awesome fonts)
   */
  list() {
    let { fonts } = document;
    const it = fonts.entries();

    let arr = [];
    let done = false;

    while (!done) {
      const font = it.next();
      if (!font.done) {
        arr.push(font.value[0].family);
      } else {
        done = font.done;
      };
    };

    // converted to set then arr to filter repetitive values
    return [...new Set(arr)].filter(f => !f.startsWith("Font Awesome"));
  };

  /** Generate the CSS for loading all of the fonts
   * @return {Promise<string>} The CSS for loading the fonts
   */
  async generateCSS() {
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
      css = await fetchWithTimeout(url)
        .then(res => res.text())
        .catch(err => {
          Hooks.once("ready", () => ui.notifications.error(`${CustomFonts.ID} | ${game.i18n.format("custom-fonts.notifications.connectionError", { error: err })}`));
        });
    };

    // Get the custom directory from settings
    try {
      const directory = game.settings.get(CustomFonts.ID, "directory");
      const files = await recursiveFileBrowse(directory);
      for (const file of files) {
        css += `\n@font-face {
  font-family: '${file.split("/").at(-1).replace(/\.otf|\.ttf|\.woff|\.woff2/, "")}';
  src: url(${file});
}`;
      };
    } catch (err) {
      Hooks.once("ready", () => ui.notifications.error(`${CustomFonts.ID} | ${game.i18n.format("custom-fonts.notifications.invalidDirectory", { error: err })}`));
    };

    return css;
  };

  /** Add the fonts to the CONFIG */
  async config() {
    this.list().forEach(f => {
      if (!CONFIG.fontFamilies.includes(f)) CONFIG.fontFamilies.push(f);
    });

    // Redraw text drawings when the canvas is ready
    Hooks.on("canvasReady", () => canvas.drawings?.placeables.filter(d => d.data.type === 't').forEach(d => d.draw()));
  };

  /** Add the fonts to the DOM */
  async dom() {
    document.querySelector("#custom-fonts")?.remove();
    const element = document.createElement("style");
    element.id = CustomFonts.ID;
    element.innerHTML = await this.generateCSS();
    document.head.appendChild(element);
  };

  /** Add the fonts to TinyMCE editors */
  async tinyMCE() {
    // Add the font select toolbar button if it's not already there
    if (!CONFIG.TinyMCE.toolbar.includes("fontselect")) CONFIG.TinyMCE.toolbar += " fontselect fontsizeselect";

    // Add the fonts
    CONFIG.TinyMCE.font_formats = this.list().join(";");
    CONFIG.TinyMCE.content_style = CONFIG.TinyMCE.content_style ? CONFIG.TinyMCE.content_style + await this.generateCSS() : await this.generateCSS();
  };

  applyUIFonts() {
    const primary = game.settings.get(CustomFonts.ID, "primary");
    document.querySelector(":root").style.setProperty("--font-primary", primary);
    const mono = game.settings.get(CustomFonts.ID, "mono");
    document.querySelector(":root").style.setProperty("--font-mono", mono);
  };
};

Hooks.on("init", () => globalThis.CustomFonts = new CustomFonts());
