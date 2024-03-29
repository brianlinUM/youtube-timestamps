# YouTube Time Labels🕔🔖
This chrome extension allows a YouTube user to 'bookmark' different parts of a video so that they could come back to it later.

<p align="middle">
<img src="./demo_images/extension_screenshot.png" width="250">
<img src="./demo_images/extension_screenshot_2.png" width="250">
</p>

Take a look at `/demo_images` to find more screenshots of this extension in action.

Each video can be expanded to show its timestamps. When you click on an added timestamp on the extension popup, the current tab is changed to the video, starting at the timestamp. You can add a custom label to each timestamp as notes or to remember the timestamp's contents. The title for each video can also be changed.

### Shortcut Keys
`CTRL+SHIFT+Q` (`⌘+⇧+E` on Macs): record current timestamp and add to extension.

### Quick Install
On a Chrome / Chromium-based browser, download and install the extension from the Chrome Web Store:
https://chrome.google.com/webstore/detail/youtube-time-labels/nfejcmbipcbnloiekolfklofpdabmmig

Refresh already open YouTube video tabs to get the extension working on these pages.

## Project Details
The project is currently implemented using Javascript, Vue (with Vuex for centralized state management) and Bootstrap. It makes use of the Chrome Browser API for persistent storage, inter-service communication, and hotkeys.
Tools used in this project includes NPM, webpack, and ESLint.

### Organization
- `./dist/`: contains the installable chrome extension.
- `./src/`: source code that needs to be webpacked.
  - `./src/common/`: source code that is reused in multiple places.
  - `./src/components/`: Vue Single File Components.
  - `./src/store/`: Vuex centralized store definition and initialization.
- `./tests/`: contains unit tests for the project.
- `./scripts`: contains shell utility scripts.
- `./Changelog.md`: Lists history of versions.
- `./Plans.md`: Lists work-in-progress plans for upcoming release.
- `./componentHierarchy.txt`: Outlines how vue components are arranged in this project.

### Linting / Style Checking
This project uses ESLint, configured to check against the Airbnb style guide. To run, use:
`npm run lint`

See `.eslintrc.json` for the configuration. Files ignored are listed in `.eslintignore`.

## Installation and Building
Please see **Quick Install** above for instructions on how to download and install easily from the Chrome Web Store.

### Building
Feel free to skip this section if installing directly from the release `dist-v*.zip` (see next section).

Before beginning, make sure to have Node.js and NPM installed.

Install all Node dependencies by running from project root `/`:

`npm install`

Then, build the .js bundles by running one of:
- development build (for easy debugging)
  - `npm run dev`
- production build (for efficiency)
  - `npm run prod`

This builds the source .js files to `dist/js/`.

Note that the linter is run before these scripts, and build will only continue if linting returns no errors.

### Manual Installation

To install the chrome extension to the browser manually, find the latest release on github: https://github.com/brianlinUM/youtube-timestamps/releases.

From assets download and unzip the `dist-v*.zip`. Then, enable *Developer Mode* in `chrome://extensions/`. "Load unpacked" from `dist-v*/`, which contains `manifest.json`.

If you have any YouTube tabs open, make sure to refresh them before using the extension.

## Testing
(Tests are currently broken)

This project currently uses `jest` for unit tests of non-vue js scripts, along with `jest-chrome` to mock Chrome's API.

Run by executing:

`npm run test`

Vue component tests and end-to-end tests are planned.

## Version History
See `changelog.md` for additional details, and `Plans.md` for ideas.
- **v1.1.0**: released March 29th, 2024. Many new features, including ability to search by label, and import/export data. UX improvements such as displaying currently playing video first, and moving delete all button somewhere safer. Various bug fixes. Also added ESLint.
- **v1.0.0**: released August 31st, 2021. First release on chrome store. Added various UX improvements, including search filter, success confirmation popup, and ordering of video list by title. Changed extension name to "YouTube Time Labels".
- **v0.2.1**: released May 6th, 2021. Fixes issue when adding timestamp if content script is not loaded.
- **v0.2.0**: released April 11th, 2021. Improves UI and supports custom labels for timestamps.
- **v0.1.1**: released April 4th, 2021. Fixes a content script issue.
- **v0.1.0**: released April 3rd, 2021. This version focuses on basic functionality rather than UI / Aesthetics.
