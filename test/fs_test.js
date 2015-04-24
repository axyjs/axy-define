/**
 * Test "core" module "fs"
 */
"use strict";

var axy = require("../axy-node.js"),
    self = {};

/*jshint -W071 */
module.exports = {

    setUp: function (done) {
        self.define = axy.define.createSandbox();
        self.fs = self.define.core.require("fs");
        done();
    },

    /**
     * covers ::Stat
     */
    testStat: function (test) {
        var fs = self.fs,
            f = new fs.Stat(true),
            d = new fs.Stat(false);
        test.strictEqual(f.isDirectory(), false);
        test.strictEqual(f.isFile(), true);
        test.strictEqual(d.isDirectory(), true);
        test.strictEqual(d.isFile(), false);
        test.done();
    },
    /**
     * covers ::writeFileSync
     * covers ::readFileSync
     * covers ::statSync
     * covers ::existsSync
     */
    testFS: function (test) {
        var fs = self.fs;
        self.define.global.process.chdir("/one");
        test.strictEqual(fs.existsSync("/"), true);
        test.strictEqual(fs.existsSync("/one"), false);
        test.strictEqual(fs.existsSync("/one/two/three.js"), false);
        test.throws(function () {
            fs.readFileSync("/one/two/three.js");
        });
        test.throws(function () {
            fs.realpathSync("/one/two/three.js");
        });
        test.strictEqual(fs.realpathSync("/one/two/three.js", {"/one/two/three.js": "/xx"}), "/xx");
        test.throws(function () {
            fs.statSync("/one/two/three.js");
        });
        fs.writeFileSync("/one/two/three.js", "Content");
        test.strictEqual(fs.existsSync("/"), true);
        test.strictEqual(fs.existsSync("/one"), true);
        test.strictEqual(fs.existsSync("/one/two"), true);
        test.strictEqual(fs.existsSync("/one/two/three.js"), true);
        test.strictEqual(fs.existsSync("/one/two/four.js"), false);
        test.strictEqual(fs.existsSync(".."), true);
        test.strictEqual(fs.existsSync("."), true);
        test.strictEqual(fs.existsSync("./two"), true);
        test.strictEqual(fs.existsSync("two/three.js"), true);
        test.strictEqual(fs.existsSync("two/four.js"), false);
        test.strictEqual(fs.readFileSync("/one/two/three.js"), "Content");
        test.strictEqual(fs.readFileSync("two/../two/three.js"), "Content");
        test.strictEqual(fs.realpathSync("/one/two/three.js"), "/one/two/three.js");
        test.strictEqual(fs.realpathSync("./two/three.js"), "/one/two/three.js");
        test.strictEqual(fs.realpathSync("/one/two"), "/one/two");
        test.strictEqual(fs.statSync("/one/two").isDirectory(), true);
        test.strictEqual(fs.statSync("/one/two").isFile(), false);
        test.strictEqual(fs.statSync("/one/two/three.js").isDirectory(), false);
        test.strictEqual(fs.statSync("/one/two/three.js").isFile(), true);
        fs.writeFileSync("/one/two/three.js", "New content");
        test.strictEqual(fs.readFileSync("/one/two/three.js"), "New content");
        test.throws(function () {
            fs.readFileSync("/one/two");
        });
        test.throws(function () {
            fs.writeFileSync("/one/two", "Content");
        });
        fs.writeFileSync("/one/two/four.js", null);
        test.strictEqual(fs.existsSync("/one/two/four.js"), true);
        test.done();
    },

    testReaddir: function (test) {
        var fs = self.fs;
        self.define.global.process.chdir("/one");
        fs.writeFileSync("/one/two/three.js", "1");
        fs.writeFileSync("/one/two/four.js", "2");
        fs.writeFileSync("/one/two/five/six.js", "2");
        fs.writeFileSync("/three/five.js", "3");
        test.deepEqual(fs.readdirSync("/").sort(), ["one", "three"]);
        test.deepEqual(fs.readdirSync("/one"), ["two"]);
        test.deepEqual(fs.readdirSync(""), ["two"]);
        test.deepEqual(fs.readdirSync("two").sort(), ["five", "four.js", "three.js"]);
        test.deepEqual(fs.readdirSync("../three"), ["five.js"]);
        test.deepEqual(fs.readdirSync("/three/five.js"), []);
        test.deepEqual(fs.readdirSync("/un/defined"), []);
        test.expect(11);
        fs.readdir("/one/two", function (err, files) {
            test.ok(!err);
            test.deepEqual(files.sort(), ["five", "four.js", "three.js"]);
            fs.readdir("/un/defined", function (err, files) {
                test.ok(!err);
                test.deepEqual(files.sort(), []);
                test.done();
            });
        });
    }
};
