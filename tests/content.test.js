import { chrome } from 'jest-chrome';
import { testables } from "../src/content.js";

// We don't test changeTime as it's fairly trivial and the test uses 
// almost the same code anyways.

const {
    getVideoId, getCurrentTimestampInfo, listenMessages
} = testables;

beforeAll(() => {
    // mock window.location attributes
    // https://stackoverflow.com/questions/54021037/how-to-mock-window-location-href-with-jest-vuejs
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
        value: {}
    });

    // mock the DOM of Youtube video page
    document.body.innerHTML = ""
    const body = document.body;
    const video = document.createElement("video");
    video.currentTime = 1;
    body.appendChild(video);

    const videoTitle = document.createElement("h1");
    videoTitle.className = "title style-scope ytd-video-primary-info-renderer";
    const innerVideoTitle = document.createElement("div");
    innerVideoTitle.innerText = "video title"
    videoTitle.appendChild(innerVideoTitle);
    body.appendChild(videoTitle);
});

beforeEach(() => {
    window.location.search = "https://www.youtube.com/watch?v=videoId&t=3";
    // reset video's current time in case it was changed
    const video = document.getElementsByTagName("video")[0];
    video.currentTime = 1;
})

afterAll(() => {
    document.body.innerHTML = "";
})

describe("getVideoId", () => {
    test("url with only videoid in query string", () => {
        window.location.search = "https://www.youtube.com/watch?v=videoId";
        const result = getVideoId();
        expect(result).toBe("videoId");
    });

    test("url with other fields in query string", () => {
        let result = getVideoId();
        expect(result).toBe("videoId");
    });
});

describe("getCurrentTimestampInfo", () => {
    test("DOM scraping of youtube video page", () => {
        const info = getCurrentTimestampInfo();
        expect(info).toEqual(
            {timestamp: 1, videoId: "videoId", title: "video title"}
        );
    });
});

describe("listenMessages", () => {
    beforeEach(() => {
        chrome.runtime.onMessage.clearListeners();
    });

    afterAll(() => {
        chrome.runtime.onMessage.clearListeners();
    })

    test("register message listener", () => {
        // sanity check
        expect(chrome.runtime.onMessage.hasListeners()).toBe(false);
        listenMessages();
        expect(chrome.runtime.onMessage.hasListeners()).toBe(true);
    });

    test("request obtain-timestamp", () => {
        const request = { msg: 'obtain-timestamp' };
        const sender = {};
        const responseSpy = jest.fn((response) => {});

        listenMessages();
        chrome.runtime.onMessage.callListeners({ msg: "invalid" }, sender, responseSpy);
        expect(responseSpy.mock.calls.length).toBe(0);

        chrome.runtime.onMessage.callListeners(request, sender, responseSpy);
        expect(responseSpy.mock.calls.length).toBe(1);
        expect(responseSpy.mock.calls[0][0]).toEqual(
            {timestamp: 1, videoId: "videoId", title: "video title"}
        );
    });

    test("request change-time", () => {
        const request = { msg: 'change-time', timestamp: 5};
        const sender = {};
        const response = null;

        const video = document.getElementsByTagName("video")[0];

        listenMessages();
        chrome.runtime.onMessage.callListeners(
            { msg: "invalid", timestamp: 5}, sender, response
        );
        expect(video.currentTime).toBe(1);

        chrome.runtime.onMessage.callListeners(request, sender, response);
        expect(video.currentTime).toBe(5);
    });
});
