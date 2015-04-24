/**
 * Test engine
 */
"use strict";

var axy = require("../axy-node.js");

/*jshint -W071 */
module.exports = {
    testEngine: function (test) {
        var define = axy.define.createSandbox(),
            main,
            nMain,
            mo,
            pkg;
        require("./fixtures/fixtures.js")({define: define});
        main = define.require("/tst/main.js");
        mo = define.require.getModule("/tst/main.js");
        test.strictEqual(mo.exports, main);
        test.strictEqual(mo.id, ".");
        test.strictEqual(mo.filename, "/tst/main.js");
        test.strictEqual(mo.loaded, true);
        test.deepEqual(main.getJSONContent().name, "this is data.json");
        test.strictEqual(mo.children.length, 0);
        test.deepEqual(main.getJSONAsModule().name, "this is data.json");
        test.strictEqual(mo.children.length, 1);
        test.strictEqual(mo.children[0].exports.name, "this is data.json");
        test.strictEqual(mo.children[0].exports, main.getJSONAsModule());
        test.strictEqual(mo.children.length, 1);
        pkg = main.getPackage();
        test.strictEqual(pkg(3), 11);
        test.strictEqual(define.require("/tst/node_modules/pkg/main.js"), pkg);
        test.strictEqual(mo.children.length, 2);
        test.strictEqual(mo.children[1].children[0].exports(3), 6);
        test.deepEqual(define.require("/tst/json-txt.json"), {x: 1});
        test.deepEqual(define.require("/tst/json-func.json"), [1, 2]);
        test.strictEqual(main.getTextJS(), 4);
        test.throws(function () {
            main.getInvalid();
        });
        test.throws(function () {
            main.getInvalid();
        });
        test.strictEqual(main.clk, 10);
        main.clk = 20;
        nMain = define.require("/tst/main.js");
        test.strictEqual(nMain, main);
        test.strictEqual(nMain.clk, 20);
        nMain = define.require("/tst/main.js", {reload: true});
        test.notStrictEqual(nMain, main);
        test.strictEqual(nMain.clk, 10);
        test.done();
    },

    testArgv: function (test) {
        var define = axy.define.createSandbox();
        define("/one.js", "module.exports = process.argv;");
        define("/two.js", "module.exports = process.argv;");
        test.deepEqual(define.require("/one.js"), ["axy", "/one.js"]);
        test.deepEqual(define.require("/two.js", {argv: ["-x", "arg"]}), ["axy", "/two.js", "-x", "arg"]);
        test.deepEqual(define.require("/two.js", {argv: ["--no"]}), ["axy", "/two.js", "-x", "arg"]);
        test.deepEqual(define.require("/two.js", {reload: true, argv: ["--no"]}), ["axy", "/two.js", "--no"]);
        test.done();
    },

    testDir: function (test) {
        var define = axy.define.createSandbox();
        define("/one/two/three.js", "module.exports = process.cwd();");
        define("/four/five.js", "module.exports = process.cwd();");
        test.strictEqual(define.require("/one/two/three.js"), "/one/two");
        test.strictEqual(define.require("/four/five.js", {dir: false}), "/one/two");
        test.strictEqual(define.require("/four/five.js", {dir: true, reload: true}), "/four");
        test.strictEqual(define.require("/four/five.js", {dir: "six/./seven", reload: true}), "/four/six/seven");
        test.done();
    }
};
