/**
 * Test util
 */
"use strict";

var axy = require("../axy-node.js");

module.exports = {

    testDir: function (test) {
        var define = axy.define,
            fs = define.core.require("fs"),
            process = define.global.process;
        test.strictEqual(process.cwd(), "/");
        fs.writeFileSync("/a.txt", "a-txt");
        fs.writeFileSync("/one/two/three/b.txt", "b-txt");
        test.strictEqual(fs.readFileSync("/a.txt"), "a-txt");
        test.strictEqual(fs.readFileSync("/one/two/three/b.txt"), "b-txt");
        test.strictEqual(fs.readFileSync("a.txt"), "a-txt");
        test.throws(function () {
            fs.readFileSync("b.txt");
        });
        process.chdir("/one/three/../two");
        test.strictEqual(process.cwd(), "/one/two");
        test.strictEqual(fs.readFileSync("/a.txt"), "a-txt");
        test.strictEqual(fs.readFileSync("/one/two/three/b.txt"), "b-txt");
        test.strictEqual(fs.readFileSync("three/b.txt"), "b-txt");
        test.throws(function () {
            fs.readFileSync("a.txt");
        });
        test.done();
    },

    testRequire: function (test) {
        var define = axy.define;
        /* jshint -W072 */
        define("/one/two/three.js", function (e, r, m, f, d, g, process) {
            e.r = r("./four/five/six.js");
            e.c = process.cwd();
        });
        define("/one/two/four/five/six.js", function (e, r, m, f, d, g, process) {
            e.b = process.cwd();
            process.chdir("../four/five");
            e.a = process.cwd();
        });
        /* jshint +W072 */
        test.deepEqual(define.require("/one/two/three.js"), {
            r: {
                b: "/one/two",
                a: "/one/four/five"
            },
            c: "/one/four/five"
        });
        test.done();
    }
};
