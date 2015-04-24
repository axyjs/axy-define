#!/usr/bin/env node
/**
 * Sandbox for running axy-modules on Node.js
 *
 * $. cd /path/to/sandbox/root/
 * $. /path/to/axy-define/sandbox.js main.js
 *
 * Collects all JS and JSON files in the current directory (and nested) and run `main.js` as the main module.
 *
 * May add other files (except js and json):
 *
 * $. sandbox.js -txt,jpg,html main.js
 *
 * Command line arguments:
 *
 * $. sandbox.js main.js -a -b -c
 */
"use strict";

var fs = require("fs"),
    path = require("path"),
    define = require("./axy-node.js").define,
    main,
    exts = [".js", ".json"],
    argv = process.argv,
    arg = 2;

main = argv[arg];
if ((typeof main === "string") && (main.charAt(0) === "-")) {
    main.slice(1).split(",").forEach(function (item) {
        exts.push("." + item);
    });
    arg += 1;
    main = argv[arg];
}

if (!main) {
    throw new Error("Format: sandbox.js [-exts list] main-module.js [argv...]");
}

if (!fs.existsSync(main)) {
    throw new Error("Module '" + main + "' not found");
}

function parseDir(dir) {
    fs.readdirSync(dir).forEach(function (item) {
        var fn = dir + "/" + item,
            ext,
            content;
        if (fs.statSync(fn).isDirectory()) {
            parseDir(fn);
        } else {
            ext = path.extname(fn);
            if (exts.indexOf(ext) !== -1) {
                content = fs.readFileSync(fn, "utf-8");
                if (content.slice(0, 2) === "#!") {
                    content = content.replace(/^.*\n/, "");
                }
                content = content.replace("this.__extends", "(this && this.__extends)"); // hack for TypeScript
                define(fn.slice(1), content);
            }
        }
    });
}

parseDir(".");

define.require(path.resolve("/", main), false, argv.slice(arg + 1));

process.on("exit", function (code) {
    define.signal("exit", code);
});
