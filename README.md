# Youtube Timestamps🕔🔖
This chrome extension allows a YouTube user to 'bookmark' different parts of a video so that they could come back to it later.

When you click on an added timestamp on the extension popup, the current time of the video is changed to the timestamp of the corresponding video.

### Shortcut Keys
`CTRL+Q` (`⌘+⇧+E` on Macs): record current timestamp and add to extension.

## Project Details
The project is currently implemented using Javascript and Vue, and makes extensive use of the Chrome Browser API.
Tools used in this project includes NPM and webpack.

### Organization
- `./dist/`: contains the installable chrome extension.
- `./src/`: source code that needs to be webpacked.
  - `./src/common/`: source code that is reused in multiple places.
  - `./src/components/`: Vue Single File Components.
- `./Changelog.md`: Lists history of versions.
- `./Plans.md`: Lists work-in-progress plans for upcoming release.

## Installation
Before beginning, make sure to have Node.js and NPM installed.


Install all Node dependencies by running from root `/`:

`npm install`

Then, build the .js bundles by running:

`npm run build`

This builds the source .js files to `dist/javascript/`. After building, we need to install the extension to the Chrome browser. This requires enabling *Developer Mode* in `chrome://extensions/`.
"Load unpacked" from `dist/`, which contains `manifest.json`.

## Current Progress
**v0.1.0**: released April 3rd, 2021 - see Changelog.md for an outline. This version focuses on basic functionality rather than UI / Aesthetics.

**v0.2.0**: This version is in development - see Plans.md for details. Focuses on improving graphics / UI.
