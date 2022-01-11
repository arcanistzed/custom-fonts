# Changelog

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
