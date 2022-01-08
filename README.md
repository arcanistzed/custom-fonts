# Custom Fonts

![Version](https://img.shields.io/github/v/tag/arcanistzed/custom-fonts?label=Version&style=flat-square&color=2577a1) ![Latest Release Download Count](https://img.shields.io/github/downloads/arcanistzed/custom-fonts/latest/module.zip?label=Downloads&style=flat-square&color=9b43a8) ![Supported Foundry Versions](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://raw.githubusercontent.com/arcanistzed/custom-fonts/main/module.json&style=flat-square&color=ff6400) [![Discord Server](https://img.shields.io/badge/-Discord-%232c2f33?style=flat-square&logo=discord)](https://discord.gg/AAkZWWqVav) [![Patreon](https://img.shields.io/badge/-Patreon-%23141518?style=flat-square&logo=patreon)](https://www.patreon.com/bePatron?u=15896855)

Facilitates using Custom Fonts in Journal Entries, Text Drawings on the canvas, or for the entire UI! You can upload your own font or load a font directly from Google Fonts.

![fonts](https://i.gyazo.com/32fe907375b3993d05a204b4f521aac5.png)

## Installation

In the setup screen, use the URL `https://github.com/arcanistzed/custom-fonts/releases/latest/download/module.json` to install the module.

## Usage

Go to module settings and set the font families you want to use.

Using fonts from Google Fonts requires connection to Internet. You cannot load more than 100 fonts from Google Fonts. You also cannot load from more than 50 folders in your local fonts directory.

### Font loading issues

Check that you have spelled the font exactly the same as on Google Fonts or as the name of the file in your fonts folder.

If your drawings don't update, run the following in a script macro or the browser console (F12):

```js
canvas.drawings.placeables.filter(d => d.data.type === 't').forEach(d => d.draw());
```

## Acknowledgments

* Thanks to Forien for originally creating this amazing module
* *Grenze Gotisch*, *Lobster* and *Indie Flower* are fonts available on [Google Fonts](https://fonts.google.com/) via [Open Font License](https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL).

## Support

If you wish to support module development, please consider [becoming Patron](https://www.patreon.com/foundryworkshop) or donating [through Paypal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=6P2RRX7HVEMV2&source=url). Thanks!

## License

Copyright © 2021 arcanist

[Forien's Custom Fonts](https://github.com/Forien/foundryvtt-forien-custom-fonts) is a module for Foundry VTT by [Forien](https://www.patreon.com/forien) and is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

All changes to the original module are licensed under the [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/). A detailed comparison can be found in [the commit history](https://github.com/arcanistzed/custom-fonts/compare/36b76f1cdd679c8b72519d03435b2a29013d5e84...main).

## Bugs

You can submit bugs via [Github Issues](https://github.com/arcanistzed/custom-fonts/issues/new/choose) or on [my Discord server](https://discord.gg/AAkZWWqVav).

## Contact me

Come hang out on my [my Discord server](https://discord.gg/AAkZWWqVav) or [click here to send me an email](mailto:arcanistzed@gmail.com?subject=custom-fonts%20module%20for%20Foundry%20VTT).
