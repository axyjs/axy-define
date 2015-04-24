/**
 * Loads the `axy` object as node module
 */
"use strict";

var min = false, // load compressed file
    fs = require("fs"),
    vm = require("vm"),
    filename,
    content,
    axy = {},
    vars = {
        axy: axy,
        window: global,
        console: console,
        setTimeout: setTimeout
    },
    context = vm.createContext(vars);

if (min) {
    filename = __dirname + "/tmp/axy-define.min-" + require("./package.json").version + ".js";
} else {
    filename = __dirname + "/axy-define.js";
}

if (!fs.existsSync(filename)) {
    throw new Error(filename + " not found. Run 'grunt build'.");
}

content = fs.readFileSync(filename, {encoding: "utf-8"});
vm.runInContext(content, context);

module.exports = axy;
