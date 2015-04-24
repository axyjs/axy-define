/**
 * Test helpers
 */
"use strict";

var axy = require("../axy-node.js"),
    helpers = axy.define.core.require("__axy").helpers;

module.exports = {

    /**
     * covers ::keys
     * covers ::customKeys
     */
    testKeys: function (test) {
        var C = function () {},
            obj;
        C.prototype = {a: 1};
        obj = new C();
        obj.b = 2;
        obj.c = 3;
        function cmp(a) {
            if (a === "b") {
                return -1;
            }
            return 1;
        }
        test.deepEqual(helpers.keys(obj).sort(cmp), ["b", "c"]);
        test.deepEqual(helpers.customKeys(obj).sort(cmp), ["b", "c"]);
        test.done();
    }
};
