# Custom Fonts

![Version](https://img.shields.io/github/v/tag/arcanistzed/custom-fonts?label=Version&style=flat-square&color=2577a1) ![Latest Release Download Count](https://img.shields.io/github/downloads/arcanistzed/custom-fonts/latest/module.zip?label=Downloads&style=flat-square&color=9b43a8) ![Supported Foundry Versions](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://raw.githubusercontent.com/arcanistzed/custom-fonts/main/module.json&style=flat-square&color=ff6400) [![Discord Server](https://img.shields.io/badge/-Discord-%232c2f33?style=flat-square&logo=discord)](https://discord.gg/AAkZWWqVav) [![Patreon](https://img.shields.io/badge/-Patreon-%23141518?style=flat-square&logo=patreon)](https://www.patreon.com/bePatron?u=15896855)

Facilitates using Custom Fonts in Journal Entries, Text Drawings on the canvas, or for the entire UI! You can upload your own font or load a font directly from Google Fonts.

![fonts](https://i.gyazo.com/32fe907375b3993d05a204b4f521aac5.png)

## Installation

In the setup screen, use the URL `https://github.com/arcanistzed/custom-fonts/releases/latest/download/module.json` to install the module.

## Usage

Go to module settings and set the font families you want to use. It's recommended to only use fonts from Google Fonts or in your font directory so that's it's available for all users, but you can enter locally installed fonts as well.

### Limitations

Using fonts from Google Fonts requires connection to Internet. You cannot load more than 100 fonts from Google Fonts.
You also cannot load more than 50 fonts from more than 50 folders in your local fonts directory.

### Font loading issues

Check that you have spelled the font exactly the same as on Google Fonts or as the name of the file in your fonts folder.

If your drawings don't update, run the following in a script macro or the browser console (F12):

```js
canvas.drawings.placeables.filter(d => d.data.type === 't').forEach(d => d.draw());
```

### Using local fonts on The Forge

If you are using The Forge, you need to create a folder in the Asset library first (try calling it `fonts`, for example) and then select that folder in the file picker in the module settings.

### Migrating from the old Forien's Custom Fonts module

1. Install the latest version of the old module alongside this one
2. Enable both modules
3. You'll see a prompt asking you if want to migrate your settings
4. Click "Migrate"
5. Disable and uninstall the old module

### Downloading font CSS

For developers and content creators, there is a button in module settings to download a CSS file that you can include in your package (under the CC0 license).
To use this file, add this to your package's folder and put a `styles` field in your manifest containing the name of this file. Before doing  this, it's suggested that you set Custom Fonts' local folder setting to a folder within your package's folder so that this button generates the correct paths. Don't forget to include all of the local font files when distributing!

### Presets

You can specify presets by adding the settings values to your module's manifest flags. See the [example module](https://github.com/arcanistzed/custom-fonts-example-preset). It's important to note that the `"fonts"` field must contain valid font names from Google Fonts and that the `"directory"` field is relative to the module's folder.

Known presets will be listed here:

* [Example Preset](https://foundryvtt.com/packages/custom-fonts-example-preset)

Please let me know if you have any questions about how to create a preset or if you have created a preset which you would like added to the list!

## Support

Please consider supporting me on [my Patreon](https://patreon.com/arcanistzed) if you like my work. You can see a list of all my projects on [my website](https://arcanist.me).

## Bugs

You can submit bugs via [Github Issues](https://github.com/arcanistzed/custom-fonts/issues/new/choose) or on [my Discord server](https://discord.gg/AAkZWWqVav).

## Contact me

Come hang out on my [my Discord server](https://discord.gg/AAkZWWqVav) or [click here to send me an email](mailto:arcanistzed@gmail.com?subject=custom-fonts%20module%20for%20Foundry%20VTT).

## Acknowledgments

* Thanks to Forien for originally creating this amazing module
* *Grenze Gotisch*, *Lobster* and *Indie Flower* are fonts available on [Google Fonts](https://fonts.google.com/) via [Open Font License](https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL).

## License

Copyright © 2021 arcanist

[Forien's Custom Fonts](https://github.com/Forien/foundryvtt-forien-custom-fonts) is a module for Foundry VTT by [Forien](https://www.patreon.com/forien) and is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

All changes to the original module are licensed under the [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/). A detailed comparison can be found in [the commit history](https://github.com/arcanistzed/custom-fonts/compare/36b76f1cdd679c8b72519d03435b2a29013d5e84...main).
