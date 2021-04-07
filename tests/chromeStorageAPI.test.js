import { chrome } from 'jest-chrome';
import * as Storage from "../src/common/chromeStorageAPI.js";

let mockStorage = {};

beforeEach(() => {
    chrome.storage.local.get.mockImplementation((key, callback) => {
        if (key === null) {
            callback(mockStorage);
        }
        else {
            callback(key in mockStorage ? {[key]: mockStorage[key]} : {});
        }
    });

    chrome.storage.local.set.mockImplementation((item, callback) => {
        const key = Object.keys(item)[0];
        mockStorage[key] = item[key];
        callback();
    });
});

afterEach(() => {
    // reset after each test
    mockStorage = {};
});

describe("updateSingleVideo", () => {
    test('add empty object to empty storage', () => {
        const getCallbackSpy = jest.fn((data) => {return {};});

        Storage.updateSingleVideo("1", getCallbackSpy);
        expect(getCallbackSpy.mock.calls.length).toBe(1);
        expect(getCallbackSpy.mock.calls[0][0]).toEqual({});
        expect(mockStorage).toEqual({"1": {}});
    });

    test('update empty storage', () => {
        const newValue = {2:3, 4:5};
        const getCallbackSpy = jest.fn((data) => {return newValue;});

        Storage.updateSingleVideo("1", getCallbackSpy);
        expect(getCallbackSpy.mock.calls.length).toBe(1);
        expect(getCallbackSpy.mock.calls[0][0]).toEqual({});
        expect(mockStorage).toEqual({"1": newValue});
    });

    test('update non-empty storage on new value', () => {
        mockStorage = {"1": {2:3, 4:5}};
        const newValue = {6:7, 8:9};
        const getCallbackSpy = jest.fn((data) => {return newValue;});

        Storage.updateSingleVideo("a", getCallbackSpy);
        expect(getCallbackSpy.mock.calls.length).toBe(1);
        expect(getCallbackSpy.mock.calls[0][0]).toEqual({});
        expect(mockStorage).toEqual({"1": {2:3, 4:5}, "a": newValue});

        Storage.updateSingleVideo("b", (data) => {return {} });
        expect(mockStorage).toEqual({"1": {2:3, 4:5}, "a": newValue, "b": {} });
    });

    test('update non-empty storage on existing value', () => {
        mockStorage = {"1": {2:3, 4:5}, "a": {}};
        const getCallbackSpy = jest.fn((data) => {
            const key = Object.keys(data)[0];
            const value = data[key];
            let output = {};
            if (key !== "a") {
                output = {2: value[2] + 100, 4: value[4]};
            } else {
                output = {2: 1000};
            }
            return output;
        });

        Storage.updateSingleVideo("1", getCallbackSpy);
        expect(getCallbackSpy.mock.calls.length).toBe(1);
        expect(getCallbackSpy.mock.calls[0][0]).toEqual({"1": {2:3, 4:5}});
        expect(mockStorage).toEqual({"1": {2:103, 4:5}, "a": {}});

        Storage.updateSingleVideo("1", getCallbackSpy);
        expect(getCallbackSpy.mock.calls.length).toBe(2);
        expect(getCallbackSpy.mock.calls[1][0]).toEqual({"1": {2:103, 4:5}});
        expect(mockStorage).toEqual({"1": {2:203, 4:5}, "a": {}});

        Storage.updateSingleVideo("a", getCallbackSpy);
        expect(getCallbackSpy.mock.calls.length).toBe(3);
        expect(getCallbackSpy.mock.calls[2][0]).toEqual({"a": {}});
        expect(mockStorage).toEqual({"1": {2:203, 4:5}, "a": {2: 1000}});
    });

    test('update existing value to empty object', () => {
        mockStorage = {"1": {2:3, 4:5}};
        const getCallbackSpy = jest.fn((data) => {return {};});

        Storage.updateSingleVideo("1", getCallbackSpy);
        expect(getCallbackSpy.mock.calls.length).toBe(1);
        expect(getCallbackSpy.mock.calls[0][0]).toEqual({"1": {2:3, 4:5}});
        expect(mockStorage).toEqual({"1": {}});
    });

    test('update existing value with nested object', () => {
        mockStorage = {"1": {2:3, 4:{5:6}}};
        const getCallbackSpy = jest.fn((data) => {return {2:3,4:{5:{6:7}}};});

        Storage.updateSingleVideo("1", getCallbackSpy);
        expect(getCallbackSpy.mock.calls.length).toBe(1);
        expect(getCallbackSpy.mock.calls[0][0]).toEqual({"1": {2:3, 4:{5:6}}});
        expect(mockStorage).toEqual({"1": {2:3,4:{5:{6:7}}}});
    });

    test('execute set callback', () => {
        const getCallbackSpy = jest.fn((data) => {return 2});
        const setCallbackSpy = jest.fn();
        Storage.updateSingleVideo("1", getCallbackSpy, setCallbackSpy);

        expect(setCallbackSpy.mock.calls.length).toBe(1);
        // check that setCallback has no additional side effects
        expect(getCallbackSpy.mock.calls.length).toBe(1);
        expect(getCallbackSpy.mock.calls[0][0]).toEqual({});
        expect(mockStorage).toEqual({"1": 2});
    });
});
