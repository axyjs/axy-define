"use strict";

/*jshint unused: false */
module.exports = function (axy) {

    axy.define("/tst/data.json", {
        "name": "this is data.json"
    });

    axy.define("/tst/main.js", function (exports, require, module, __filename, __dirname) {
        exports.getModule = function () {
            return module;
        };

        exports.getJSONContent = function () {
            return require("fs").readFileSync(__dirname + "/data.json");
        };

        exports.getJSONAsModule = function () {
            return require("./data.json");
        };

        exports.getPackage = function () {
            return require("pkg");
        };

        exports.getTextJS = function () {
            return require("./txt/js.js");
        };

        exports.getInvalid = function () {
            return require("./invalid.js");
        };

        this.clk = 10;
    });

    axy.define("/tst/node_modules/pkg/main.js", function (exports, require, module, __filename, __dirname) {
        var pkg2 = require("pkg2");

        module.exports = function (x) {
            return pkg2(x) + 5;
        };
    });

    axy.define("/tst/node_modules/pkg/package.json", {
        "main": "main.js"
    });

    axy.define("/tst/node_modules/pkg2/index.js", function (exports, require, module, __filename, __dirname) {
        module.exports = function (x) {
            return x * 2;
        };
    });

    axy.define("/tst/json-txt.json", "{\"x\": 1}");

    axy.define("/tst/json-func.json", function () {return [1, 2];});

    axy.define("/tst/txt/js.js", "module.exports = 2 + 2;");

    axy.define("/tst/invalid.js", function () {throw new Error("invalid module");});
};