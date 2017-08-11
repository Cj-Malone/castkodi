"use strict";

const assert    = require("assert");
const { URL }   = require("url");
const requirejs = require("requirejs");

global.browser = require("../mock/browser");

global.fetch = function (url) {
    if (url.endsWith("collection")) {
        return Promise.resolve({ "text": function () { return ""; } });
    }
    if (url.endsWith("a-singing-comet")) {
        return Promise.resolve({
            "text": function () {
                return "api.soundcloud.com%2Ftracks%2F176387011&";
            }
        });
    }
    return Promise.reject(url);
}; // fetch()

requirejs.config({
    "baseUrl":     "src",
    "nodeRequire": require
});

describe("scraper/soundcloud", function () {
    let module;

    before(function (done) {
        requirejs(["scrapers"], function (scrapers) {
            module = scrapers;
            done();
        });
    });

    describe("#patterns", function () {
        it("should return error when it's not a music", function () {
            const url = new URL("https://soundcloud.com/stream");
            const expected = "unsupported";
            return module.extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });
    });

	describe("https://soundcloud.com/*", function () {
		it("should return error when it's not a music", function () {
            const url = new URL("https://soundcloud.com/a-tribe-called-red/" +
                                                            "sets/trapline-ep");
            const expected = "noaudio";
            return module.extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

		it("should return error when it's not a music", function () {
            const url = new URL("https://soundcloud.com/you/collection");
            const expected = "noaudio";
            return module.extract(url).then(function () {
                assert.fail();
            }, function (error) {
                assert.strictEqual(error.name, "PebkacError");
                assert.ok(error.title.includes(expected));
                assert.ok(error.message.includes(expected));
            });
        });

        it("should return music id", function () {
            const url = new URL("https://soundcloud.com/esa/a-singing-comet");
            const expected = "plugin://plugin.audio.soundcloud/play/" +
                                                          "?audio_id=176387011";
            return module.extract(url).then(function ({ playlistid, file }) {
                assert.strictEqual(playlistid, 0);
                assert.strictEqual(file, expected);
            });
        });
	});
});
