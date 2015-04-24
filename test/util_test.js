/**
 * Test util
 */
"use strict";

var axy = require("../axy-node.js");

module.exports = {
    /**
     * covers ::tryFile
     * covers ::tryExtensions
     * covers ::tryPackage
     * covers ::readPackage
     */
    testTryFEP: function (test) {
        var define = axy.define,
            fs = define.core.require("fs"),
            Mo = define.core.require("module"),
            util = define.core.require("__axy").util,
            exts = [".js", ".json"];
        fs.writeFileSync("/one/two.js", "content");
        fs.writeFileSync("/two/no-index.js", "content");
        test.strictEqual(util.tryFile("/one/two.js"), "/one/two.js");
        test.strictEqual(util.tryFile("/one/three.js"), null);
        test.strictEqual(util.tryFile("/one"), null);
        Mo._realpathCache["/one/two.js"] = "/two.json";
        test.strictEqual(util.tryFile("/one/two.js"), "/two.json");
        delete Mo._realpathCache["/one/two.js"];
        fs.writeFileSync("/one/package.json", {'x': 10, main: "index.js"});
        fs.writeFileSync("/two/package.json", '{"x": 11, "main": "no-index"}');
        fs.writeFileSync("/three/package.json", {'x': 20});
        test.strictEqual(util.readPackage("/one"), "index.js");
        test.strictEqual(util.readPackage("/two"), "no-index");
        test.strictEqual(util.readPackage("/two"), "no-index");
        test.strictEqual(util.readPackage("/three"), null);
        test.strictEqual(util.readPackage("/four"), null);
        test.strictEqual(util.tryExtensions("/one/two", exts), "/one/two.js");
        test.strictEqual(util.tryExtensions("/one/package", exts), "/one/package.json");
        test.strictEqual(util.tryExtensions("/one/unknown", exts), null);
        test.strictEqual(util.tryPackage("/one", exts), null);
        test.strictEqual(util.tryPackage("/two", exts), "/two/no-index.js");
        test.strictEqual(util.tryPackage("/three", exts), null);
        test.done();
    }
};
