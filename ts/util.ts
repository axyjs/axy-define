/**
 * Some helpers
 */
/// <reference path="engine.ts" />
/// <reference path="core/fs.ts" />
/// <reference path="core/path.ts" />
/// <reference path="extensions.ts" />
module util {
    "use strict";

    import fs = core.fs;
    import path = core.path;

    /**
     * @param {string} basePath
     * @return {string}
     */
    export function tryFile(basePath: string): string {
        if (!fs.existsSync(basePath)) {
            return null;
        }
        if (!fs.statSync(basePath).isFile()) {
            return null;
        }
        return fs.realpathSync(basePath, engine.Module._realpathCache);
    }

    /**
     * @param {string} p
     * @param {string[]} exts
     * @return {string}
     */
    export function tryExtensions(p: string, exts: string[]): string {
        var len: number = exts.length,
            i: number,
            filename: string;
        for (i = 0; i < len; i += 1) {
            filename = tryFile(p + exts[i]);
            if (filename) {
                return filename;
            }
        }
        return null;
    }

    /**
     * @param {string} basePath
     * @param {string[]} exts
     * @return {string}
     */
    export function tryExtensionsDirMain(basePath: string, exts: string[]): string {
        var list: string[] = settings.instance.dirMain,
            len: number = list.length,
            i: number,
            filename: string;
        for (i = 0; i < len; i += 1) {
            filename = tryExtensions(basePath + "/" + list[i], exts);
            if (filename) {
                return filename;
            }
        }
        return null;
    }

    /**
     * @param {string} requestPath
     * @param {string[]} exts
     * @return {string}
     */
    export function tryPackage(requestPath: string, exts: string[]): string {
        var pkg: string = readPackage(requestPath),
            filename: string;
        if (!pkg) {
            return null;
        }
        filename = path.resolve(requestPath, pkg);
        return tryFile(filename) || tryExtensions(filename, exts) || tryExtensionsDirMain(filename, exts);
    }

    var packageMainCache: any = {};

    /**
     * @param {string} requestPath
     * @returns {string}
     */
    export function readPackage(requestPath: string): string {
        var filename: string,
            data: any,
            main: string;
        if (packageMainCache.hasOwnProperty(requestPath)) {
            return packageMainCache[requestPath];
        }
        filename = requestPath + "/package.json";
        if (!fs.existsSync(filename)) {
            return null;
        }
        data = extensions.parseJSONFile(filename);
        main = loadPackageMain(data);
        packageMainCache[requestPath] = main;
        return main;
    }

    /**
     * @param {object} data
     * @return string
     */
    function loadPackageMain(data: any): string {
        var packageMain: string[] = settings.instance.packageMain,
            len: number = packageMain.length,
            i: number,
            main: string;
        for (i = 0; i < len; i += 1) {
            main = data[packageMain[i]];
            if (main) {
                return main;
            }
        }
        return null;
    }

    /**
     * Clears the code of a JS file (strip BOM and "#!...")
     *
     * @param {string} content
     * @return {string}
     */
    export function clearCode(content: string): string {
        var first: string = content.charAt(0);
        if ((first === "\ufeff") || (first === "\ufffe")) {
            content = content.slice(1);
        }
        if (content.substr(0, 2) === "#!") {
            content = content.replace(/^.*\n/, "");
        }
        return content;
    }
}
