/**
 * Test "core" module "module"
 */
"use strict";

var axy = require("../axy-node.js");

/*jshint -W071 */
module.exports = {
    /**
     * covers ::_findPath
     */
    testFindPath: function (test) {
        var define = axy.define.createSandbox(),
            fs = define.core.require("fs"),
            Mo = define.core.require("module"),
            paths;
        paths = [
            "/one/two",
            "/three/four"
        ];
        fs.writeFileSync("/var/www/file.js", "content");
        fs.writeFileSync("/var/www/data.json", "[1]");
        fs.writeFileSync("/one/two/index.js", "content");
        fs.writeFileSync("/three/four/five/package.json", {main: "./six/index.json"});
        fs.writeFileSync("/three/four/five/six/index.json", "content");
        test.strictEqual(Mo._findPath("/var/www/file.js", paths), "/var/www/file.js");
        test.strictEqual(Mo._findPath("/var/www/file", paths), "/var/www/file.js");
        test.strictEqual(Mo._findPath("/var/www/data", paths), "/var/www/data.json");
        test.strictEqual(Mo._findPath("/three/four/five", paths), "/three/four/five/six/index.json");
        test.strictEqual(Mo._findPath("/var/www/unk", paths), null);
        test.strictEqual(Mo._findPath("index.js", paths), "/one/two/index.js");
        test.strictEqual(Mo._findPath("five", paths), "/three/four/five/six/index.json");
        test.strictEqual(Mo._findPath("five/six/index.json", paths), "/three/four/five/six/index.json");
        test.strictEqual(Mo._findPath("six", paths), null);
        test.done();
    },

    /**
     * covers ::_resolveLookupPaths
     */
    testResolveLookupPaths: function (test) {
        var define = axy.define.createSandbox(),
            Mo = define.core.require("module"),
            rlp = Mo._resolveLookupPaths,
            parent,
            parentIndex;
        define.global.process.paths.push("/usr/lib");
        parent = new Mo("/node/parent.js", null);
        parent.filename = "/node/parent.js";
        parent.paths = [
            "/node/node_modules",
            "/node_modules"
        ];
        test.deepEqual(rlp("fs", parent), ["fs", []]);
        test.deepEqual(rlp("mod", parent), ["mod", ["/node/node_modules", "/node_modules", "/usr/lib"]]);
        test.deepEqual(rlp("mod.js", parent), ["mod.js", ["/node/node_modules", "/node_modules", "/usr/lib"]]);
        test.deepEqual(rlp("./mod", parent), ["/node/mod", ["/node"]]);
        test.deepEqual(rlp("./mod.js", parent), ["/node/mod.js", ["/node"]]);
        test.deepEqual(rlp("../mod.js", parent), ["/mod.js", ["/node"]]);
        test.deepEqual(rlp("../qwe/mod.json", parent), ["/qwe/mod.json", ["/node"]]);
        parentIndex = new Mo("/node/index.js", parent);
        parentIndex.filename = "/node/index.js";
        test.deepEqual(rlp("../qwe/mod.json", parentIndex), ["/node/qwe/mod.json", ["/node"]]);
        test.done();
    },

    /**
     * covers ::_resolveFilename
     */
    testResolveFilename: function (test) {
        var define = axy.define.createSandbox(),
            Mo = define.core.require("module"),
            fs = define.core.require("fs"),
            rf = Mo._resolveFilename,
            parent;
        define.global.process.paths.push("/usr/lib");
        parent = new Mo("/node/parent.js", null);
        parent.filename = "/node/parent.js";
        parent.paths = [
            "/node/node_modules",
            "/node_modules"
        ];
        fs.writeFileSync("/node/parent.js", "Parent");
        fs.writeFileSync("/node/node_modules/one.js", "One");
        fs.writeFileSync("/node_modules/two.json", "Two");
        fs.writeFileSync("/usr/lib/three.js", "Three");
        fs.writeFileSync("/qwe/rty/iop.js", "Iop");
        fs.writeFileSync("/qwe/rty/index.js", "Index");
        fs.writeFileSync("/node_modules/four/package.json", {"main": "four.js"});
        fs.writeFileSync("/node_modules/four/four.js", {"main": "four.js"});
        test.strictEqual(rf("fs", parent), "fs");
        test.strictEqual(rf("./parent", parent), "/node/parent.js");
        test.strictEqual(rf("./parent.js", parent), "/node/parent.js");
        test.strictEqual(rf("one", parent), "/node/node_modules/one.js");
        test.strictEqual(rf("two", parent), "/node_modules/two.json");
        test.strictEqual(rf("three", parent), "/usr/lib/three.js");
        test.strictEqual(rf("four", parent), "/node_modules/four/four.js");
        test.throws(function () {
            rf("iop.js", parent);
        });
        test.throws(function () {
            rf("./one", parent);
        });
        test.strictEqual(rf("/qwe/rty/iop.js", parent), "/qwe/rty/iop.js");
        test.strictEqual(rf("/qwe/rty/", parent), "/qwe/rty/index.js");
        test.strictEqual(rf("/qwe/rty", parent), "/qwe/rty/index.js");
        test.strictEqual(rf("./../qwe/rty/iop.js", parent), "/qwe/rty/iop.js");
        test.done();
    },

    /**
     * covers ::_nodeModulePaths
     */
    testNodeModulePaths: function (test) {
        var define = axy.define.createSandbox(),
            Mo = define.core.require("module"),
            expected = [
            "/one/two/three/node_modules/four/five/node_modules",
            "/one/two/three/node_modules/four/node_modules",
            "/one/two/three/node_modules",
            "/one/two/node_modules",
            "/one/node_modules",
            "/node_modules"
        ];
        test.deepEqual(Mo._nodeModulePaths("/one/two/three/node_modules/four/five"), expected);
        test.done();
    }
};
