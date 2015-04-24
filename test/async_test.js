"use strict";

var axy = require("../axy-node.js"),
    AsyncStorage = require("./mocks/async.js"),
    self = {};

module.exports = {

    setUp: function (done) {
        self.define = axy.define.createSandbox();
        self.fs = self.define.core.require("fs");
        self.fs.writeFileSync("/etc/config.txt", "Config txt");
        self.async = new AsyncStorage();
        self.define.async.set(self.async);
        done();
    },

    tearDown: function (callback) {
        self.define.signal("exit");
        if (callback) {
            if (callback.done) {
                callback.done();
            } else {
                callback();
            }
        }
    },

    testSetGet: function (test) {
        test.strictEqual(self.define.async.get(), self.async);
        test.done();
    },

    /**
     * covers ::exists
     */
    testExists: function (test) {
        var fs = self.fs,
            clk = 8;
        function ping() {
            clk -= 1;
            if (clk === 0) {
                test.strictEqual(fs.existsSync("/etc/config.txt"), true);
                test.strictEqual(fs.existsSync("/etc"), true);
                test.strictEqual(fs.existsSync("/dir/one.txt"), true);
                test.strictEqual(fs.existsSync("/dir/two.txt"), true);
                test.strictEqual(fs.existsSync("/dyn/data.txt"), false);
                test.strictEqual(fs.existsSync("/dir"), true);
                test.strictEqual(fs.existsSync("/dyn"), false);
                test.strictEqual(fs.existsSync("/un/known"), false);
                test.done();
            }
        }
        test.expect(24);
        test.strictEqual(fs.existsSync("/etc/config.txt"), true);
        test.strictEqual(fs.existsSync("/etc"), true);
        test.strictEqual(fs.existsSync("/dir/one.txt"), false);
        test.strictEqual(fs.existsSync("/dir/two.txt"), false);
        test.strictEqual(fs.existsSync("/dyn/data.txt"), false);
        test.strictEqual(fs.existsSync("/dir"), false);
        test.strictEqual(fs.existsSync("/dyn"), false);
        test.strictEqual(fs.existsSync("/un/known"), false);
        fs.exists("/etc/config.txt", function (exists) {
            test.strictEqual(exists, true);
            ping();
        });
        fs.exists("/etc", function (exists) {
            test.strictEqual(exists, true);
            ping();
        });
        fs.exists("/dir/one.txt", function (exists) {
            test.strictEqual(exists, true);
            ping();
        });
        fs.exists("/dir/two.txt", function (exists) {
            test.strictEqual(exists, true);
            ping();
        });
        fs.exists("/dyn/data.txt", function (exists) {
            test.strictEqual(exists, true);
            ping();
        });
        fs.exists("/dir", function (exists) {
            test.strictEqual(exists, true);
            ping();
        });
        fs.exists("/dyn", function (exists) {
            test.strictEqual(exists, true);
            ping();
        });
        fs.exists("/dyn", function (exists) {
            test.strictEqual(exists, true);
            ping();
        });
    },

    /**
     * covers ::stat
     */
    testStat: function (test) {
        var fs = self.fs,
            clk = 8;
        function ping() {
            clk -= 1;
            if (clk === 0) {
                test.strictEqual(fs.statSync("/etc/config.txt").isFile(), true);
                test.strictEqual(fs.statSync("/etc").isFile(), false);
                test.strictEqual(fs.statSync("/dir/one.txt").isFile(), true);
                test.strictEqual(fs.statSync("/dir/two.txt").isFile(), true);
                test.strictEqual(fs.statSync("/dir").isFile(), false);
                test.throws(function () {
                    fs.statSync("/dyn/data.txt");
                });
                test.throws(function () {
                    fs.statSync("/un/known");
                });
                test.done();
            }
        }
        test.expect(26);
        test.strictEqual(fs.statSync("/etc/config.txt").isFile(), true);
        test.strictEqual(fs.statSync("/etc").isFile(), false);
        test.throws(function () {
            fs.statSync("/dir/one.txt");
        });
        fs.stat("/etc/config.txt", function (err, stat) {
            test.ok(!err);
            test.strictEqual(stat.isFile(), true);
            ping();
        });
        fs.stat("/etc", function (err, stat) {
            test.ok(!err);
            test.strictEqual(stat.isFile(), false);
            ping();
        });
        fs.stat("/dir/one.txt", function (err, stat) {
            test.ok(!err);
            test.strictEqual(stat.isFile(), true);
            ping();
        });
        fs.stat("/dir/two.txt", function (err, stat) {
            test.ok(!err);
            test.strictEqual(stat.isFile(), true);
            ping();
        });
        fs.stat("/dyn/data.txt", function (err, stat) {
            test.ok(!err);
            test.strictEqual(stat.isFile(), true);
            ping();
        });
        fs.stat("/dir", function (err, stat) {
            test.ok(!err);
            test.strictEqual(stat.isFile(), false);
            ping();
        });
        fs.stat("/dyn", function (err, stat) {
            test.ok(!err);
            test.strictEqual(stat.isFile(), false);
            ping();
        });
        fs.stat("/un/known", function (err, stat) {
            test.ok(err);
            test.ok(!stat);
            ping();
        });
    },

    /**
     * covers :;readFile
     */
    testReadFile: function (test) {
        var fs = self.fs,
            clk = 8;
        function ping() {
            clk -= 1;
            if (clk === 0) {
                test.strictEqual(fs.readFileSync("/etc/config.txt"), "Config txt");
                test.strictEqual(fs.readFileSync("/dir/one.txt"), "One Content");
                test.strictEqual(fs.readFileSync("/dir/two.txt"), "Two Content");
                test.throws(function () {
                    fs.readFileSync("/dyn/data.txt");
                });
                test.throws(function () {
                    fs.readFileSync("/un/known");
                });
                test.done();
            }
        }
        test.expect(24);
        test.strictEqual(fs.readFileSync("/etc/config.txt"), "Config txt");
        test.throws(function () {
            fs.readFileSync("/dir/one.txt");
        });
        fs.readFile("/etc/config.txt", function (err, content) {
            test.ok(!err);
            test.strictEqual(content, "Config txt");
            ping();
        });
        fs.readFile("/etc", function (err, content) {
            test.ok(err);
            test.ok(!content);
            ping();
        });
        fs.readFile("/dir/one.txt", "utf-8", function (err, content) {
            test.ok(!err);
            test.strictEqual(content, "One Content");
            ping();
        });
        fs.readFile("/dir/two.txt", function (err, content) {
            test.ok(!err);
            test.strictEqual(content, "Two Content");
            ping();
        });
        fs.readFile("/dyn/data.txt", function (err, content) {
            test.ok(!err);
            test.strictEqual(content, "Data Content");
            ping();
        });
        fs.readFile("/dir", function (err, content) {
            test.ok(err);
            test.ok(!content);
            ping();
        });
        fs.readFile("/dyn", function (err, content) {
            test.ok(err);
            test.ok(!content);
            ping();
        });
        fs.readFile("/un/known", function (err, content) {
            test.ok(err);
            test.ok(!content);
            ping();
        });
        test.strictEqual(clk, 8);
    },

    testRequire: {

        testSys: function (test) {
            var fs = self.fs;
            test.expect(7);
            self.async.moduleResolve = null;
            fs.writeFileSync("/one/mo.js", function (e, require) {
                require.async("./mo2", function (err, value) {
                    test.ok(!err);
                    test.strictEqual(value.result, void 0);
                    value.func(function () {
                        test.strictEqual(value.result, true);
                    });
                    require.async("./../modules/mo.js", function (err, value) {
                        test.ok(!err);
                        test.deepEqual(value, {r: true});
                        require.async("./mo3", function (err, value) {
                            test.ok(err);
                            test.ok(!value);
                            test.done();
                        });
                    });
                });
            });
            fs.writeFileSync("/one/mo2.js", function (e, require) {
                e.func = function (callback) {
                    require.async("./../modules/mo2.js", function (err, value) {
                        e.result = ((err) && (!value));
                        callback();
                    });
                };
            });
            fs.writeFileSync("/one/mo3.js", function () {
                throw new Error("Invalid module");
            });
            self.define.require("/one/mo.js");
        },

        testNoContent: function (test) {
            var fs = self.fs;
            test.expect(4);
            fs.writeFileSync("/one/mo.js", function (e, require) {
                require.async("./../modules", function (err, value) {
                    test.ok(!err);
                    test.deepEqual(value, {r: true});
                    require.async("./../m", function (err, value) {
                        test.ok(err);
                        test.ok(!value);
                        test.done();
                    });
                });
            });
            self.define.require("/one/mo.js");
        },

        testContent: function (test) {
            var fs = self.fs;
            test.expect(4);
            fs.writeFileSync("/one/mo.js", function (e, require) {
                require.async("./../modules/mo", function (err, value) {
                    test.ok(!err);
                    test.deepEqual(value, {r: false});
                    require.async("./../m", function (err, value) {
                        test.ok(err);
                        test.ok(!value);
                        test.done();
                    });
                });
            });
            self.define.require("/one/mo.js");
        },

        testCore: function (test) {
            var fs = self.fs;
            test.expect(2);
            fs.writeFileSync("/one/mo.js", function (e, require) {
                require.async("path", function (err, value) {
                    test.ok(!err);
                    test.strictEqual(typeof value.normalize, "function");
                    test.done();
                });
            });
            self.define.require("/one/mo.js");
        }
    }
};
