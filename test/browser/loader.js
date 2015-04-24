/*global tests, XMLHttpRequest, axy, nodeunit */
(function () {
    "use strict";

    var srcs;

    srcs = tests.map(function (test) {
        return "../" + test + "_test.js";
    });
    srcs.push("../mocks/async.js");
    srcs.push("../fixtures/fixtures.js");
    (function (srcs, callback) {
        var results = {},
            count = srcs.length;
        srcs.forEach(function (src) {
            var req = new XMLHttpRequest();
            req.open("GET", src, true);
            req.onreadystatechange = function () {
                if ((req.readyState === 4) && (req.status === 200)) {
                    results[src] = req.responseText;
                    count -= 1;
                    if (count === 0) {
                        callback(results);
                    }
                }
            };
            req.send(null);
        });
    })(srcs, function (results) {
        var suites, asyncMock, fixtures;
        function require(module) {
            switch (module) {
                case "../axy-node.js":
                    return axy;
                case "./mocks/async.js":
                    return asyncMock;
                case "./fixtures/fixtures.js":
                    return fixtures;
                default:
                    throw new Error("require('" + module + "')");
            }
        }
        function load(name) {
            var content,
                wrapper,
                exports = {},
                module = {exports: exports};
            content = "function wrapper(exports, require, module) { " + results[name] + "\n};wrapper";
            /*jshint -W061 */
            wrapper = eval(content);
            /*jshint +W061 */
            wrapper(exports, require, module);
            return module.exports;
        }
        asyncMock = load("../mocks/async.js");
        fixtures = load("../fixtures/fixtures.js");
        function loadSuites(results) {
            var suites = {},
                k,
                e;
            for (k in results) {
                if (results.hasOwnProperty(k)) {
                    e = /^\.\.\/([a-z]+)_test\.js$/.exec(k);
                    if (e && e[1]) {
                        suites[e[1]] = load(k);
                    }
                }
            }
            return suites;
        }
        suites = loadSuites(results);
        nodeunit.run(suites);
    });
})();