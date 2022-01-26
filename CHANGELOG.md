# Changelog

## 0.3.0 - 26 Jan 2022

* Japanese localization (thanks to @Brother Sharp)
* Change errors to warnings
* Performance improvements
* Now uses the same font sizes as Google Docs

### Added

* TinyMCE toolbar tools for text color
* Option to create sharper text drawings without shadows or stroke (requires libWrapper) (#5)
* Preview fonts in the Drawing Config (#10)
* Support for font presets (see the [example preset](https://github.com/arcanistzed/custom-fonts-example-preset) and the info in the [README](https://github.com/arcanistzed/custom-fonts#presets))

### Fixed

* Handle empty font directory (#7)
* Detect font in Journal Entries more effectively for the Missing Fonts feature
* Make Missing Fonts detection optional
* Increase compatibility by loading new fonts into TinyMCE in a more friendly way (now works with Monk's Enhanced Journals)
* Improved local font loading method for The Forge
* Issue with missing font detection when no UI font is set

## 0.2.1 - 11 Jan 2022

### Fixed

* Set default local directory to `fonts`
* Made the module a library for load order
* Only save a file list with the first 50 files that have valid font file extensions

## 0.2.0 - 11 Jan 2022

### Fixed

* Update the list of files each time Custom Fonts is loaded by a GM, not just when the setting is changed
* Load local fonts regardless of the case of the file extension
* Redraw Drawings when they are updated, not when the canvas is ready
* Update the file list only if the fonts available have changed
* Notifications not appearing once ready
* Firefox issue: font names are no longer surrounded in quotes

### Added

* Detection for when a missing font is used (it currently only checks Journals, Drawings, and the UI font)
* Use Custom Fonts with Dice so Nice

## 0.1.0 - 9 Jan 2022 - Public release

### Fixed

* Remove error with local font fetch on 0.8.x [#1](https://github.com/arcanistzed/custom-fonts/issues/1)
* Fixed local fonts for users without file browser access [#4](https://github.com/arcanistzed/custom-fonts/issues/4)

## 0.1.0-rc.1 - 7 Jan 2022 - Release candidate
