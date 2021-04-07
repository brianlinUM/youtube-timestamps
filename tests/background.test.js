import { chrome } from 'jest-chrome';
import { testables } from "../src/background.js";
import sendObtainTimestampRequest from "../src/common/obtainTimestamp.js";

jest.mock("../src/common/obtainTimestamp.js");

const {sendUpdatePopupInstance, listenHotkeys} = testables;

describe("sendUpdatePopupInstance", () => {
    test("correct message sent", () => {
        const spy = jest.fn((msg) => {});
        chrome.runtime.sendMessage = spy;

        const timestampData = {videoId: "1", title: "a", timestamp: 2};
        sendUpdatePopupInstance(timestampData);

        expect(spy.mock.calls.length).toBe(1);
        expect(spy.mock.calls[0][0]).toEqual(
            {msg: "update-timestamp", timestampData}
        );
    });
});

describe("listenHotkeys", () => {
    beforeEach(() => {
        chrome.commands.onCommand.clearListeners();
        sendObtainTimestampRequest.mockReset();
    });

    afterAll(() => {
        chrome.commands.onCommand.clearListeners();
    })

    test("register command listener", () => {
        expect(chrome.commands.onCommand.hasListeners()).toBe(false);
        listenHotkeys();
        expect(chrome.commands.onCommand.hasListeners()).toBe(true);
    });

    test("listener called when correct message sent", () => {
        const spy = jest.fn();
        sendObtainTimestampRequest.mockImplementation((callback) => {
            spy();
        });

        listenHotkeys();

        chrome.commands.onCommand.callListeners("invalid-command");
        expect(spy.mock.calls.length).toBe(0);

        chrome.commands.onCommand.callListeners("add-timestamp");
        expect(spy.mock.calls.length).toBe(1);
    });
});
