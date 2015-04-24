/**
 * Test "core" module "path"
 */
"use strict";

var axy = require("../axy-node.js"),
    path = axy.define.core.require("path");

module.exports = {
    /**
     * covers ::normalize
     */
    testNormalize: function (test) {
        var normalize = path.normalize;
        test.strictEqual(normalize("/one/two/three.js"), "/one/two/three.js");
        test.strictEqual(normalize("/one/two/../three/../four/./five.js"), "/one/four/five.js");
        test.strictEqual(normalize("/one//two//./three//"), "/one/two/three");
        test.strictEqual(normalize("/one/two/../../../../three/"), "/three");
        test.done();
    },

    /**
     * covers ::resolve
     */
    testResolve: function (test) {
        var resolve = path.resolve;
        test.strictEqual(resolve("/one/two", "/three/four", "../five/.//six.js/"), "/three/five/six.js");
        test.done();
    },

    /**
     * covers ::isAbsolute
     */
    testIsAbsolute: function (test) {
        var isAbsolute = path.isAbsolute;
        test.strictEqual(isAbsolute("/one/two"), true);
        test.strictEqual(isAbsolute("/"), true);
        test.strictEqual(isAbsolute("."), false);
        test.strictEqual(isAbsolute(""), false);
        test.strictEqual(isAbsolute("./one"), false);
        test.strictEqual(isAbsolute("one"), false);
        test.strictEqual(isAbsolute(".."), false);
        test.done();
    },

    /**
     * covers ::dirname
     */
    testDirname: function (test) {
        var dirname = path.dirname;
        test.strictEqual(dirname("/one/two/three.js"), "/one/two");
        test.strictEqual(dirname("/one/two/three.js/"), "/one/two");
        test.strictEqual(dirname("/one/two"), "/one");
        test.strictEqual(dirname("one/two"), "one");
        test.done();
    },

    /**
     * covers ::dirname
     */
    testBasename: function (test) {
        var basename = path.basename;
        test.strictEqual(basename("/one/two/three.js"), "three.js");
        test.strictEqual(basename("/one/two/three.js//"), "three.js");
        test.strictEqual(basename("/one/two"), "two");
        test.strictEqual(basename("one/two"), "two");
        test.done();
    },

    /**
     * covers ::dirname
     */
    testExtname: function (test) {
        var extname = path.extname;
        test.strictEqual(extname("/one/two/three.js"), ".js");
        test.strictEqual(extname("/one/two/three."), ".");
        test.strictEqual(extname("/one/two/three"), "");
        test.strictEqual(extname("/one/two/three.js.tpl"), ".tpl");
        test.done();
    }
};
