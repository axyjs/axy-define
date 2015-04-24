"use strict";

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        typescript: {
            source: {
                options: {
                    declaration: true,
                    removeComments: false,
                    target: "ES5"
                },
                src: [
                    "ts/types.ts",
                    "ts/helpers.ts",
                    "ts/context.ts",
                    "ts/signals.ts",
                    "ts/plugins.ts",
                    "ts/coreModules.ts",
                    "ts/core/streams.ts",
                    "ts/core/process.ts",
                    "ts/core/global.ts",
                    "ts/core/fs.ts",
                    "ts/core/paths.ts",
                    "ts/core/timers.ts",
                    "ts/util.ts",
                    "ts/settings.ts",
                    "ts/async.ts",
                    "ts/extensions.ts",
                    "ts/req.ts",
                    "ts/engine.ts",
                    "ts/sandbox.ts"
                ],
                dest: "tmp/compiled.js"
            },
            tasks: {
                options: {
                    module: "commonjs",
                    declaration: false,
                    removeComments: false,
                    target: "ES5"
                },
                src: "tasks/*.ts"
            },
            browser: {
                options: {
                    declaration: false,
                    removeComments: false,
                    target: "ES5"
                },
                src: "test/browser/*.ts"
            }
        },
        template: {
            options: {
                root: __dirname,
                tpl: "tasks/axy-define.js.tpl",
                src: "tmp/compiled.js",
                dest: "axy-define.js"
            }
        },
        dts: {
            options: {
                root: __dirname,
                src: "tmp/compiled.d.ts",
                dest: "axy-define.d.ts"
            }
        },
        loaderTests: {
            options: {
                tests: __dirname + "/test",
                dest: __dirname + "/test/browser/tests.js"
            }
        },
        uglify: {
            options: {
                beautify: false,
                compress: true
            },
            files: {
                src: "axy-define.js",
                dest: "tmp/axy-define.min-<%=pkg.version%>.js"
            }
        },
        nodeunit: {
            all: ["test/*_test.js"]
        },
        tslint: {
            options: {
                configuration: grunt.file.readJSON("tslint.json")
            },
            files: ["ts/**/*.ts", "tasks/*.ts", "test/browser/*.ts"]
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            test: ["test/**/*.js", "!test/browser/nodeunit.js", "!test/browser/tests.js"],
            util: ["./axy-node.js", "./sandbox.js"],
            gruntfile: "Gruntfile.js"
        },
        jsonlint: {
            pkg: ["package.json"],
            hint: [".jshintrc", "tslint.json"]
        }
    });

    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks("grunt-contrib-nodeunit");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("template", function () {
        var filename = "./tasks/template.js",
            fs = require("fs"),
            template;
        if (!fs.existsSync(filename)) {
            grunt.log.error("task js-file not found. Run 'grunt build'.");
            return false;
        }
        template = require(filename);       
        return template.call(this, grunt);
    });

    grunt.registerTask("dts", function () {
        var filename = "./tasks/dts.js",
            fs = require("fs"),
            dts;
        if (!fs.existsSync(filename)) {
            grunt.log.error("task d.ts-file not found. Run 'grunt build'.");
            return false;
        }
        dts = require(filename);
        return dts.call(this, grunt);
    });

    grunt.registerTask("loaderTests", function () {
        var filename = "./tasks/loaderTests.js",
            fs = require("fs"),
            loader;
        if (!fs.existsSync(filename)) {
            grunt.log.error("task loaderTests-file not found. Run 'grunt build'.");
            return false;
        }
        loader = require(filename);
        return loader.call(this, grunt);
    });

    grunt.registerTask("build", ["typescript", "template", "dts", "loaderTests", "uglify"]);
    grunt.registerTask("test", ["nodeunit"]);
    grunt.registerTask("test-build", ["typescript:source", "template", "test"]);
    grunt.registerTask("hint", ["tslint", "jshint", "jsonlint"]);
    grunt.registerTask("default", ["hint", "build", "test"]);
};
