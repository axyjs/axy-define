"use strict";

var axy = require("../axy-node.js");

/*jshint -W072 */
/*jshint -W098 */
module.exports = {
    testGlobal: function (test) {
        var define = axy.define.createSandbox(),
            g = define.global,
            one,
            two,
            three,
            timeout;
        define("/one.js", function (exports, require, module, __filename, __dirname, global, process) {
            exports.global = global;
            exports.process = process;
        });
        define("/two.js", function (exports, require, module, __filename, __dirname, global, process) {
            (function (exports, require, module, __filename, __dirname) {
                exports.global = global;
                exports.process = process;
            })(exports, require, module, __filename, __dirname);
        });
        define("/three.js", "exports.global=global;exports.process=process;");
        one = define.require("/one.js");
        two = define.require("/two.js");
        three = define.require("/three.js");
        test.strictEqual(one.global, g);
        test.strictEqual(one.process, g.process);
        test.strictEqual(two.global, g);
        test.strictEqual(two.process, g.process);
        test.strictEqual(three.global, g);
        test.strictEqual(three.process, g.process);
        test.strictEqual(g.global, g);
        timeout = g.setTimeout(function () {}, 100);
        g.clearTimeout(timeout);
        test.done();
    },

    testProcessNextTick: function (test) {
        test.expect(1);
        axy.define.global.process.nextTick(function () {
            test.ok(1);
            test.done();
        });
    }
};
