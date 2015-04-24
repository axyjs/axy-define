/**
 * Handling and transforming file paths (analogue of Node.js core module `path`)
 *
 * Path type of this file system is POSIX.
 *
 * The interface of this module is similar to interface of the node.js module "path",
 * but contains only some of the functions.
 *
 * Access to the module: `require("path")`.
 */
module core.path {
    "use strict";

    /**
     * Normalizes a path
     *
     * @param {string} path
     * @returns {string}
     */
    export function normalize(path: string): string {
        var isAbs: boolean = isAbsolute(path),
            result: string[] = [];
        path = path.replace(/^\/+/, "").replace(/^\/+/, "");
        path.split("/").forEach(function (item: string): void {
            switch (item) {
                case "..":
                    result.pop();
                    break;
                case ".":
                case "":
                    break;
                default:
                    result.push(item);
            }
        });
        return (isAbs ? "/" : "") + result.join("/");
    }

    /**
     * Resolves a relative path
     *
     * @param {...} paths
     * @return {string}
     */
    export function resolve(...paths: string[]): string {
        var components: string[] = [];
        paths.forEach(function (item: string): void {
            if (isAbsolute(item)) {
                components = [];
            }
            components.push(item);
        });
        return normalize(components.join("/"));
    }

    /**
     * Checks if a path is absolute
     *
     * @param {string} path
     * @returns {boolean}
     */
    export function isAbsolute(path: string): boolean {
        return (path.charAt(0) === "/");
    }

    /**
     * Returns the directory name of a path
     *
     * @param {string} path
     * @returns {boolean}
     */
    export function dirname(path: string): string {
        return path.replace(/\/[^/]+\/*$/, "");
    }

    /**
     * Returns the base name of a path
     *
     * @param {string} path
     * @returns {boolean}
     */
    export function basename(path: string): string {
        return path.match(/([^/]+)\/*$/)[1];
    }

    /**
     * Returns the extension name of a path
     *
     * @param {string} path
     * @returns {boolean}
     */
    export function extname(path: string): string {
        var matches: string[] = path.match(/(\.[^/.]*)\/*$/);
        return matches ? matches[1] : "";
    }

    /**
     * The file path separator
     */
    export var sep: string = "/";
}
