import { chrome } from 'jest-chrome';
import sendObtainTimestampRequest from "../src/common/obtainTimestamp.js";

const videoUrl = "https://www.youtube.com/watch?v=*";
const otherUrl = "www.test.com";
let currentUrl = videoUrl;

beforeAll(() => {
    chrome.tabs.query.mockImplementation((matchers, callback) => {
        // Need to make sure there are no extraneous fields.
        // We assume there is always a current tab in the current window,
        // otherwise the extension won't run in the first place.
        if (
            Object.keys(matchers).length === 3 &&
            matchers.active && matchers.currentWindow &&
            matchers.url === currentUrl
        ) {
            callback([{id:"tab"}])
        } else {
            callback([]);
        }
    });

    chrome.tabs.sendMessage.mockImplementation((tabId, payload, callback) => {
        // make sure that the tab id and msg is correct
        if (tabId === "tab" && payload.msg === "obtain-timestamp") {
            callback({msg: "response"});
        }
    });
});

test("message sent if currently is youtube tab", () => {
    const responseCallbackSpy = jest.fn((response) => {});

    sendObtainTimestampRequest(responseCallbackSpy);
    expect(responseCallbackSpy.mock.calls.length).toBe(1);
    expect(responseCallbackSpy.mock.calls[0][0]).toEqual({msg: "response"});
});

test("message not sent if currently not youtube tab", () => {
    currentUrl = otherUrl; // test when not Youtube tab
    const responseCallbackSpy = jest.fn((response) => {});

    sendObtainTimestampRequest(responseCallbackSpy);
    expect(responseCallbackSpy.mock.calls.length).toBe(0);
});
