import { chrome } from 'jest-chrome';
import queryCurrentTab from "../src/common/obtainCurrentTab.js";

beforeAll(() => {
    chrome.tabs.query.mockImplementation((matchers, callback) => {
        if (matchers.active && matchers.currentWindow) {
            matchers.url ? callback(["url"]) : callback(["non-url"]);
        } else {
            callback([]);
        }
    });
});

test("default matcher is used", () => {
    const callbackSpy = jest.fn((tabs) => {});
    queryCurrentTab(callbackSpy);

    expect(callbackSpy.mock.calls.length).toBe(1);
    expect(callbackSpy.mock.calls[0][0]).toEqual(["non-url"]);
});

test("matcher with url is used", () => {
    const callbackSpy = jest.fn((tabs) => {});
    queryCurrentTab(callbackSpy, "www.test.com");

    expect(callbackSpy.mock.calls.length).toBe(1);
    expect(callbackSpy.mock.calls[0][0]).toEqual(["url"]);
});
