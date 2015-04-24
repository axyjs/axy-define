/**
 * Test engine
 */
"use strict";

var axy = require("../axy-node.js");

/*jshint -W071 */
module.exports = {
    testDestroy: function (test) {
        var define = axy.define.createSandbox(),
            clk;
        /* jshint -W072 */
        define("/one.js", function (e, r, m, f, d, g, process) {
            process.on("load", function () {
                clk += 1;
            }).on("exit", function (code) {
                clk += code;
            });
            r("./two.js");
        });
        define("/two.js", function (e, r, m, f, d, g, process) {
            process.on("exit", function () {
                clk += 3;
            });
        });
        /* jshint +W072 */
        define.require("/one.js");
        clk = 0;
        define.signal("load");
        test.strictEqual(clk, 1);
        define.signal("exit", 2);
        test.strictEqual(clk, 6);
        test.throws(function () {
            define.destroy();
        });
        test.done();
    }
};
