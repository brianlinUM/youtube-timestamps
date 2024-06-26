// Content script runs after matching page (specified in manifest.json) loads.
// For functions that need access to webpage DOM.
import { convertTimeFormat } from './common/obtainTimestamp';

// Parse the current page URL for the video ID and returns the ID.
// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
function getVideoId() {
  if (window.location.search.split('v=')[1] === undefined) {
    return '';
  }
  let videoId = window.location.search.split('v=')[1];
  const ampersandPosition = videoId.indexOf('&');
  // filter out irrevelant query part
  if (ampersandPosition !== -1) {
    videoId = videoId.substring(0, ampersandPosition);
  }
  return videoId;
}

// Obtain all relevant info for the timestamp and returns it.
function getCurrentTimestampInfo() {
  const time = document.getElementsByTagName('video')[0].currentTime;
  const videoId = getVideoId();

  // obtain title by scraping webpage
  let title = document.getElementsByClassName(
    'title style-scope ytd-video-primary-info-renderer',
  )[0];
  // video titles load after content script and video has loaded
  // so need to check if title has loaded yet.
  if (!title) {
    return null;
  }
  title = title.firstChild.innerText;

  return {
    timestamp: Math.floor(time),
    videoId,
    title,
  };
}

function checkVideoAvailable() {
  const video = document.getElementsByTagName('video')[0];
  // check to prevent error when is YT Home page, no video element
  return video && video.src !== '';
}

// Change video's current time
function changeTime(newTime) {
  document.getElementsByTagName('video')[0].currentTime = newTime;
}

// Inject a notification to the page DOM, indicating to user
// that a new timestamp has been successfully added.
// Useful for when user is only adding timestamp via the hotkey
// and without the popup open.
function pushSuccessNotification(timestamp) {
  // Remove existing timestamps first
  const successPopupHandle = document.getElementById('YT_Timestamps_success_popup');
  if (successPopupHandle != null) {
    successPopupHandle.remove();
  }

  const div = document.createElement('div');
  div.id = 'YT_Timestamps_success_popup';

  const style = {
    position: 'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    top: '75px',
    left: '15%',
    width: '33%',
    height: '25px',

    background: '#2171FF',
    border: '2px solid #FFAF21',
    color: '#FFAF21',
    fontSize: '15px',
    borderRadius: '5px',
  };
  Object.assign(div.style, style);

  div.innerHTML = `Added new timestamp: ${convertTimeFormat(timestamp)}`;
  document.body.appendChild(div);
  const fadeHandle = setTimeout(() => {
    div.remove();
    clearTimeout(fadeHandle);
  }, 2000);
}

function listenMessages() {
  // Listen for add timestamp request msg from popup
  chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request.msg === 'obtain-timestamp') {
      // prevent adding timestamp on invalid videos
      if (checkVideoAvailable()) {
        const timestampData = getCurrentTimestampInfo();
        // check if timestamp data is available
        if (timestampData) {
          response(timestampData);
          pushSuccessNotification(timestampData.timestamp);
        }
      }
    } else if (request.msg === 'change-time') {
      changeTime(request.timestamp);
    } else if (request.msg === 'check-content-script-loaded') {
      response({ msg: 'content-script-loaded', videoId: getVideoId(), videoAvailable: checkVideoAvailable() });
    }
  });
}

// for when popup is already open but a new video is loaded, thus making it necessary for the popup
// to know about this video. (see comments in PopupContainer.vue)
chrome.runtime.sendMessage({ msg: 'content-script-loaded', videoId: getVideoId(), videoAvailable: checkVideoAvailable() })
  // workaround to suppress error of sending message when popup not open.
  // Don't know a better way to handle this yet.
  // Better method is to not send message in the first place if it is possible to detect when popup
  // is open or not. Left console.log for debugging purposes
  .catch((e) => { console.log('YTTimeLabels Suppressed', e); });
listenMessages();
