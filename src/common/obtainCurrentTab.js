function queryCurrentTab(queryCallback, url=null) {
    let matchConditions = {active: true, currentWindow: true}
    if (url !== null) {
        matchConditions.url = url
    }

    chrome.tabs.query(matchConditions, queryCallback);
}

export default queryCurrentTab;
