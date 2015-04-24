/**
 * Grunt task: assembles the summary js-file by the compiled file and the template
 */
/// <reference path="../typing/node.d.ts" />
"use strict";

import fs = require("fs");

/**
 * Performs the task
 *
 * @param {*} grunt
 * @return {boolean}
 */
function dtsTask(grunt: any): boolean {
    var options: any,
        src: string,
        dest: string,
        compiled: string,
        summary: string;
    options = this.options({
        root: null,
        src: null,
        dest: null
    });
    src = options.root + "/" + options.src;
    dest = options.root + "/" + options.dest;
    if (!fs.existsSync(src)) {
        grunt.log.error("compiled.js not found. Run 'grunt build'.");
        return false;
    }
    compiled = fs.readFileSync(src, "utf-8");
    compiled = compiled.replace(/declare /g, "");
    summary = "declare module \"axy-define\" {\n    " + compiled.replace(/\n/g, "\n    ") + "\n}\n";
    fs.writeFileSync(dest, summary, "utf-8");
    return true;
}

export = dtsTask;
