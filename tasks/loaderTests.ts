/// <reference path="../typing/node.d.ts" />
"use strict";

import fs = require("fs");

interface IOptions {
    tests: string;
    dest: string;
}

function loadTests(dirname: string): string[] {
    var tests: string[] = [];
    fs.readdirSync(dirname).forEach(function (file: string): void {
        var res: RegExpExecArray = /^([a-z]+)_test\.js$/.exec(file);
        if (res) {
            tests.push(res[1]);
        }
    });
    return tests;
}

function saveFile(filename: string, tests: string[]): void {
    var content: string[] = ["'use strict';"];
    content.push("var tests = " + JSON.stringify(tests) + ";");
    fs.writeFileSync(filename, content.join("\n") + "\n");
}

function loaderTask(grunt: any): boolean {
    var options: IOptions = this.options({
        tests: null,
        dest: null
    });
    saveFile(options.dest, loadTests(options.tests));
    return true;
}

export = loaderTask;
