import constants from "./constants.mjs";

export default class Fonts {
  static render(options = {settings: false}) {
    let fonts = game.settings.get(constants.moduleName, 'fonts');
    let fontFamilies = fonts.split(',').map(f => {
      f.trim();

      return f;
    }).filter(f => f.length);

    fontFamilies.forEach(f => {
      if (CONFIG.fontFamilies.includes(f)) return;
      CONFIG.fontFamilies.push(f);
    });

    fonts = fontFamilies.map(f => {
      f = f.replace(' ', '+');
      f = "family=" + f;
      return f;
    }).join('&');

    $('#fcf').remove();
    const fontEl = $('<link id="fcf">');
    fontEl.attr('rel', `stylesheet`);
    fontEl.attr('type', `text/css`);
    fontEl.attr('media', `all`);
    if (canvas) {
      fontEl.on('load', () => {
        this.drawDrawings();
        if (options.settings) {
          ui.notifications.info(game.i18n.localize('ForienCustomFonts.Notifications.FontAdded'), {permanent: true});
        }
      });
    }
    fontEl.attr('href', `https://fonts.googleapis.com/css2?${fonts}&display=swap`);
    $('head').append(fontEl);
  }

  static drawDrawings() {
    canvas.drawings.placeables.filter(d => d.data.type === 't').forEach(d => d.draw());
  }
}