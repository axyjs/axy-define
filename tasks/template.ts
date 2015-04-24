/**
 * Grunt task: assembles the summary js-file by the compiled file and the template
 */
"use strict";

declare var require: (path: string) => any;

var placeholder: string = "\"<%= content %>\";";

/**
 * Removes the top comment in the template
 *
 * @param {string} template
 * @return {string}
 */
function removeComment(template: string): string {
    return template.replace(/\/\*![\s\S]*?\*\/\s*/g, "");
}

/**
 * Arranges space before content
 *
 * @param {string} content
 * @param {string} indent
 * @return {string}
 */
function setIndents(content: string, indent: string): string {
    if (indent === "") {
        return content;
    }
    return content.split("\n").map(function (line: string): string {
        return indent + line;
    }).join("\n");
}

/**
 * Replaces the placeholder of a content
 *
 * @param {string} template
 * @param {string} content
 * @return {string}
 */
function replaceContent(template: string, content: string): string {
    var reg: RegExp = new RegExp("([ \\t]*)" + placeholder, "g");
    return template.replace(reg, function (c: string, indent: string): string {
        return setIndents(content, indent);
    });
}

/**
 * Fixes some nuances of TypeScript
 * @param content
 */
function fixTS(content: string): string {
    content = content.replace(/this\.__extends/g, "(this && this.__extends)");
    return content;
}

/**
 * Parses the template
 *
 * @param {string} template
 * @param {string} content
 * @return {string}
 */
function parse(template: string, content: string): string {
    template = removeComment(template);
    content = fixTS(content);
    return replaceContent(template, content);
}

/**
 * Performs the task
 *
 * @param {*} grunt
 * @return {boolean}
 */
function templateTask(grunt: any): boolean {
    var options: any,
        tpl: string,
        src: string,
        dest: string,
        compiled: string,
        template: string,
        summary: string,
        fs: any = require("fs");
    options = this.options({
        root: null,
        tpl: null,
        src: null,
        dest: null
    });
    tpl = options.root + "/" + options.tpl;
    src = options.root + "/" + options.src;
    dest = options.root + "/" + options.dest;
    if (!fs.existsSync(src)) {
        grunt.log.error("compiled.js not found. Run 'grunt build'.");
        return false;
    }
    compiled = fs.readFileSync(src, "utf-8");
    template = fs.readFileSync(tpl, "utf-8");
    summary = parse(template, compiled);
    fs.writeFileSync(dest, summary, "utf-8");
    return true;
}

export = templateTask;
