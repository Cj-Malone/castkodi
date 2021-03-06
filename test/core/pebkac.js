"use strict";

const assert    = require("assert");
const requirejs = require("requirejs");

global.browser = require("../mock/browser");

requirejs.config({
    "baseUrl":     "src/core",
    "nodeRequire": require
});

describe("pebkac", function () {
    let PebkacError;

    before(function (done) {
        requirejs(["pebkac"], function (module) {
            PebkacError = module;
            done();
        });
    });

    describe("constructor", function () {
        it("should accept one parameter", function () {
            const error = new PebkacError("foo");
            assert.strictEqual(error.name, "PebkacError");
            assert.strictEqual(error.message, "notifications_foo_message");
            assert.strictEqual(error.title, "notifications_foo_title");
        });

        it("should accept two parameters", function () {
            const error = new PebkacError("bar", "baz");
            assert.strictEqual(error.name, "PebkacError");
            assert.strictEqual(error.message, "notifications_bar_message: baz");
            assert.strictEqual(error.title, "notifications_bar_title");
        });
    });
});
