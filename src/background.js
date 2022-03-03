// Background service runs independent from popup, but on the same chrome runtime.
// For functions that need to run even without popup.
import { setVideoTimestamp } from './common/chromeStorageAPI';
import { sendObtainTimestampRequest } from './common/obtainTimestamp';

// console.log('Background Script Running');

// Message to popup to add timestamp.
function sendUpdatePopupInstance(timestampData) {
  chrome.runtime.sendMessage({ msg: 'update-timestamp', timestampData })
    // workaround to suppress error of sending message when popup not open.
    // Don't know a better way to handle this yet.
    // Better method is to not send message in the first place if it is possible to detect when
    // popup is open or not. Left console.log for debugging purposes
    .catch((e) => { console.log('Suppressed', e); });
}

function listenHotkeys() {
  // listen for hotkey to add timestamp
  chrome.commands.onCommand.addListener((command) => {
    if (command === 'add-timestamp') {
      sendObtainTimestampRequest((response) => {
        if (!chrome.runtime.lastError && response) {
          // we call to persistent storage here since popup may not be open
          // and thus not have vuex initialized.
          setVideoTimestamp(response);
          sendUpdatePopupInstance(response);
        }
      });
    }
  });
}

listenHotkeys();
