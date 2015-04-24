/**
 * Test "core" module "fs"
 */
"use strict";

var axy = require("../axy-node.js"),
    Core = axy.define.core.constructor;

/*jshint -W071 */
module.exports = {
    /**
     * covers ::Core
     */
    testCore: function (test) {
        var c = new Core(),
            one = {c: 10};
        test.strictEqual(c.exists("fs"), false);
        test.strictEqual(c.exists("one"), false);
        test.strictEqual(c.exists("two"), false);
        test.strictEqual(c.exists("three"), false);
        test.throws(function () {
            c.require("one");
        });
        c.addModule("one", one);
        c.addModuleBuilder("two", function (name) {
            var two = {c: one.c * 10};
            one.c += 1;
            return (name === "two") ? two : null;
        });
        test.strictEqual(c.exists("fs"), false);
        test.strictEqual(c.exists("one"), true);
        test.strictEqual(c.exists("two"), true);
        test.strictEqual(c.exists("three"), false);
        test.strictEqual(c.require("one"), one);
        test.deepEqual(one, {c: 10});
        test.deepEqual(c.require("two"), {c: 100});
        test.deepEqual(one, {c: 11});
        test.strictEqual(c.require("one"), one);
        test.deepEqual(c.require("two"), {c: 100});
        test.throws(function () {
            c.require("three");
        });
        c.removeModule("two");
        test.strictEqual(c.exists("two"), false);
        c.removeModule("three");
        test.throws(function () {
            c.require("two");
        });
        test.done();
    }
};
