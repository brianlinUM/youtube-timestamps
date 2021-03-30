# Youtube Timestamps
This chrome extension allows a YouTube user to 'bookmark' different parts of a video so that they could come back to it later.

## Project Details
The project is currently implemented using Javascript and Vue, and makes extensive use of the Chrome Browser API.
Tools used in this project includes NPM and webpack.

## Installation
First install all npm packages in `package-lock.json` by running from root `/`:

`npm ci`

Then, build the .js bundles by running:

`npx webpack`

This builds the source .js files to `dist/javascript/`. After building, we need to install the extension to the Chrome browser. This requires enabling *Developer Mode* in `chrome://extensions/`.
"Load unpacked" from `dist/`, which contains `manifest.json`.

## Current Progress
Minimum Viable Product 1 (**MVP1**) is currently in development - see Plans.txt for an outline.
