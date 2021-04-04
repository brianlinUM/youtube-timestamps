# Changelog
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
