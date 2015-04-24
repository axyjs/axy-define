/**
 * Test "core" module "fs"
 */
"use strict";

var axy = require("../axy-node.js");

/*jshint -W071 */
module.exports = {

    testPackageMainDefault: function (test) {
        var define = axy.define.createSandbox(),
            fs = define.core.require("fs");
        fs.writeFileSync("/pkg/package.json", {
            main: "one.js",
            browser: "two.js"
        });
        fs.writeFileSync("/pkg/one.js", "module.exports = 1;");
        fs.writeFileSync("/pkg/two.js", "module.exports = 2;");
        fs.writeFileSync("/mo.js", "module.exports = require('./pkg');");
        test.strictEqual(define.require("/mo.js"), 1);
        test.done();
    },

    testPackageMainBrowser: function (test) {
        var define = axy.define.createSandbox(),
            fs = define.core.require("fs");
        fs.writeFileSync("/pkg/package.json", {
            main: "one.js",
            browser: "two.js"
        });
        fs.writeFileSync("/pkg/one.js", "module.exports = 1;");
        fs.writeFileSync("/pkg/two.js", "module.exports = 2;");
        fs.writeFileSync("/mo.js", "module.exports = require('./pkg');");
        define.settings.packageMain = ["browser", "main"];
        test.strictEqual(define.require("/mo.js"), 2);
        test.done();
    },

    testPackageMainNoBrowser: function (test) {
        var define = axy.define.createSandbox(),
            fs = define.core.require("fs");
        fs.writeFileSync("/pkg/package.json", {
            main: "one.js"
        });
        fs.writeFileSync("/pkg/one.js", "module.exports = 1;");
        fs.writeFileSync("/pkg/two.js", "module.exports = 2;");
        fs.writeFileSync("/mo.js", "module.exports = require('./pkg');");
        define.settings.packageMain = ["browser", "main"];
        test.strictEqual(define.require("/mo.js"), 1);
        test.done();
    },

    testPackageNoMain: function (test) {
        var define = axy.define.createSandbox(),
            fs = define.core.require("fs");
        fs.writeFileSync("/pkg/package.json", {
            name: "name"
        });
        fs.writeFileSync("/pkg/index.js", "module.exports = 1;");
        fs.writeFileSync("/pkg/b-index.js", "module.exports = 2;");
        fs.writeFileSync("/mo.js", "module.exports = require('./pkg');");
        define.settings.packageMain = ["browser", "main"];
        test.strictEqual(define.require("/mo.js"), 1);
        test.done();
    },

    testPackageNoMainDir: function (test) {
        var define = axy.define.createSandbox(),
            fs = define.core.require("fs");
        fs.writeFileSync("/pkg/package.json", {
            name: "name"
        });
        fs.writeFileSync("/pkg/index.js", "module.exports = 1;");
        fs.writeFileSync("/pkg/b-index.js", "module.exports = 2;");
        fs.writeFileSync("/mo.js", "module.exports = require('./pkg');");
        define.settings.packageMain = ["browser", "main"];
        define.settings.dirMain = ["b-index", "index"];
        test.strictEqual(define.require("/mo.js"), 2);
        test.done();
    },

    testPackageDir: function (test) {
        var define = axy.define.createSandbox(),
            fs = define.core.require("fs");
        fs.writeFileSync("/pkg/index.js", "module.exports = 1;");
        fs.writeFileSync("/pkg/b-index.js", "module.exports = 2;");
        fs.writeFileSync("/mo.js", "module.exports = require('./pkg');");
        define.settings.dirMain = ["b-index", "index"];
        test.strictEqual(define.require("/mo.js"), 2);
        test.done();
    }
};
