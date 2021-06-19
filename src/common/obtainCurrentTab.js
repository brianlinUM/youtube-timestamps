// Obtains the chrome tab object for the current tab and execute callback with it.
// If url supplied, then tab object will only be passed on to callback if it matches
// the url.
export default function queryCurrentTab(queryCallback, url=null) {
    let matchConditions = {active: true, currentWindow: true}
    if (url !== null) {
        matchConditions.url = url
    }

    chrome.tabs.query(matchConditions, queryCallback);
}
