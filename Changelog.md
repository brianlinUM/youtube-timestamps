# Changelog
### v1.1.0:
*March 29th, 2024*
- Add ESLint with Airbnb Style Guide, fixed styling in source code.
- Fix bug allowing user to add timestamp when video hasn't loaded yet, resulting in error.
- Fix bug allowing user to add timestamp when video is invalid.
- Fix bug introduced by an update for Chrome API of sendMessage to use promises, leading to uncaught promise error.
- Apply non-breaking updates to npm packages to fix most vulnerabilities.
- Removed jest and related packages.
- Add tooltip to clear search button.
- Add label search that is in conjunction with existing title search.
- If video list contains a currently playing video, that video will be placed first and emphasised (bolded).
- Fix duplicate id error in timestamp label textarea. Also added id to other forms.
- Added settings modal, button in header. Moved "about me" modal button to footer.
- Moved remove all button into settings, with multiple safeguards against accidental clicks.
- Add import/export JSON function to settings. Requires a new "downloads" manifest.json permission.

### v1.0.0:
*August 31st, 2021*
- Improve responsiveness by alerting user when timestamp is added successfully.
- Add 'About' information popup.
- List videos by title, in UNICODE order.
- Implement filter searching for videos.
- Highlight current playing Video.
- Added confirmation popup when deleting videos.
- Changed extension name to YouTube Time Labels to make it more different from similar extensions on the chrome store.
- Changed extension to utilize centralized store Vuex. This improves maintainability by centralizing data operations.

### v0.2.1:
*May 6th, 2021*
- Fix known issue: Adding timestamp through the popup while content script hasn't finished loading, e.g. right after refreshing page, will throw an error in console. Fixed by disabling the add button until content script is loaded fully. Also add "loading" text in button while waiting.

### v0.2.0:
*April 11th, 2021*
- Improved graphics and UI features.
- Allow users to write label when they add a timestamp.
- Allow users to edit label after they have already added the timestamp.
- Allow users to edit the displayed title of the video in the extension.

### v0.1.1:
*April 4th, 2021*
- Fix bug where content script won't run after a change in path on youtube from the home page to a video (with clean cache), but works after refresh. Modified url matching condition in manifest to start at any youtube path, including home page.

### v0.1.0: 
*April 3rd, 2021*
- Hotkey to add current timestamp to extension storage.
- Display added timestamps for current video.
- Display added timestamps for all videos.
- Button to remove timestamps / videos.
- Clicking on popup timestamp moves the video progress to the timestamp.
