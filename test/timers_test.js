/**
 * Test "core" module "fs"
 */
"use strict";

var axy = require("../axy-node.js"),
    timers = axy.define.core.require("timers");

/*jshint -W071 */
module.exports = {

    testSetTimeout: function (test) {
        var a = false,
            to;
        test.expect(3);
        to = timers.setTimeout(function () {
            a = true;
        }, 100);
        test.strictEqual(typeof to.unref, "function");
        test.strictEqual(typeof to.ref, "function");
        setTimeout(function () {
            test.ok(a);
            test.done();
        }, 300);
    },

    testSetTimeoutArgs: function (test) {
        var a = 0;
        test.expect(1);
        timers.setTimeout(function (x, y) {
            a = x + y;
        }, 100, 1, 2);
        setTimeout(function () {
            test.strictEqual(a, 3);
            test.done();
        }, 300);
    },

    testClearTimeout: function (test) {
        var a = false, to;
        test.expect(1);
        to = timers.setTimeout(function () {
            a = true;
        }, 200);
        setTimeout(function () {
            timers.clearTimeout(to);
        }, 100);
        setTimeout(function () {
            test.ok(!a);
            test.done();
        }, 300);
    },

    testClearTimeoutNumber: function (test) {
        var a = false, to;
        test.expect(1);
        to = setTimeout(function () {
            a = true;
        }, 200);
        setTimeout(function () {
            timers.clearTimeout(to);
        }, 100);
        setTimeout(function () {
            test.ok(!a);
            test.done();
        }, 300);
    },

    testSetInterval: function (test) {
        var a = 0, to;
        test.expect(1);
        to = timers.setInterval(function (x, y) {
            a += x + y;
        }, 100, 1, 2);
        setTimeout(function () {
            timers.clearInterval(to);
        }, 250);
        setTimeout(function () {
            test.strictEqual(a, 6);
            test.done();
        }, 500);
    },

    testClearIntervalNumber: function (test) {
        var a = 0, to;
        test.expect(1);
        to = setInterval(function () {
            a += 3;
        }, 100);
        setTimeout(function () {
            timers.clearInterval(to);
        }, 250);
        setTimeout(function () {
            test.strictEqual(a, 6);
            test.done();
        }, 500);
    },

    testSetImmediate: function (test) {
        var a = 0;
        test.expect(1);
        timers.setImmediate(function (x, y) {
            a += x + y;
        }, 1, 2);
        setTimeout(function () {
            test.strictEqual(a, 3);
            test.done();
        }, 100);
    },

    testClearImmediate: function (test) {
        var a = false, to;
        test.expect(1);
        to = timers.setImmediate(function () {
            a = true;
        });
        timers.clearImmediate(to);
        setTimeout(function () {
            test.ok(!a);
            test.done();
        }, 300);
    }
};
