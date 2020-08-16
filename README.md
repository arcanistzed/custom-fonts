# FoundryVTT - Forien's Custom Fonts
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/forien/foundryvtt-forien-custom-fonts?style=for-the-badge) 
![GitHub Releases](https://img.shields.io/github/downloads/Forien/foundryvtt-forien-custom-fonts/latest/total?style=for-the-badge) 
![GitHub All Releases](https://img.shields.io/github/downloads/Forien/foundryvtt-forien-custom-fonts/total?style=for-the-badge&label=Downloads+total)  
**[Compatibility]**: *FoundryVTT* 0.6.0+  
**[Systems]**: *any*  
**[Languages]**: *English, Polish*  

This module allows to load any font from Google Fonts to use in drawings in games played via Foundry Virtual Tabletop.

## Installation

1. Install Forien's Custom Fonts using manifest URL: https://raw.githubusercontent.com/Forien/foundryvtt-forien-custom-fonts/master/module.json
2. While loaded in World, enable **_Forien's Custom Fonts_** module.

## Usage

Go to module settings and set fonts you want to use. If all went well you should get notification.

_Requires connection to Internet._

### Journal Entries?
Yes, you can use loaded fonts in Journal Entries. You need to open the HTML source edit and add `style` attribute to either `p` or `span` element you want to change font to.

Example: 
```html
<p style="font-family: 'Grenze Gotisch', Signika, sans-serif;">
```

I do suggest always placing `, Signika, sans-serif` behind font family as a fallback just in case. If font family includes spaces, surround it with single quote.

### Font loading issues:

#### I got no notification / Console shows 404 error
You probably mispelled some font and Google Fonts returns error. Check your definitions.

#### Drawings don't display new font:
Depending on various circumstances, new fonts might take some time to load. If new drawings don't display using new fonts (when set), try moving scenes, or use this `script` macro:

```js
canvas.drawings.placeables.filter(d => d.data.type === 't').forEach(d => d.draw());
```

## Screenshots 

![](https://i.gyazo.com/32fe907375b3993d05a204b4f521aac5.png)

## Future plans

* Search fonts
* Better UX and optimized loading
* Downloading fonts for offline use?

You can **always** check current and up-to-date [planned and requested features here](https://github.com/Forien/foundryvtt-forien-custom-fonts/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement)

*If you have **any** suggestion or idea on new contents, hit me up on Discord!*

## Translations

If you are interested in translating my module, simply make a new Pull Request with your changes, or contact me on Discord.

## Contact

If you wish to contact me for any reason, reach me out on Discord using my tag: `Forien#2130`


## Acknowledgments

* _Grenze Gotisch_, _Lobster_ and _Indie Flower_ are fonts available on [Google Fonts](https://fonts.google.com/) via [Open Font License](https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL).
* Thanks to KrishMero for helping with fonts not loading issue

## Support

If you wish to support module development, please consider [becoming Patron](https://www.patreon.com/foundryworkshop) or donating [through Paypal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=6P2RRX7HVEMV2&source=url). Thanks!

## License

Forien's Custom Fonts is a module for Foundry VTT by Forien and is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

This work is licensed under Foundry Virtual Tabletop [EULA - Limited License Agreement for module development from May 29, 2020](https://foundryvtt.com/article/license/).
