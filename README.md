# Youtube Timestamps
This chrome extension allows a YouTube user to 'bookmark' different parts of a video so that they could come back to it later.

## Project Details
The project is currently implemented using Javascript and Vue, and makes extensive use of the Chrome Browser API.
Tools used in this project includes NPM and webpack.

## Installation
Before beginning, make sure to have Node.js and NPM installed.


Install all Node dependencies by running from root `/`:

`npm install`

Then, build the .js bundles by running:

`npm run build`

This builds the source .js files to `dist/javascript/`. After building, we need to install the extension to the Chrome browser. This requires enabling *Developer Mode* in `chrome://extensions/`.
"Load unpacked" from `dist/`, which contains `manifest.json`.

## Current Progress
**v0.1.0**: version is currently in development - see Plans.txt for an outline.
