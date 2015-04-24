/**
 * Module loaders (for different file extensions)
 */
/// <reference path="types.ts" />
/// <reference path="util.ts" />
/// <reference path="core/fs.ts" />
/// <reference path="core/path.ts" />
module extensions {
    "use strict";

    import fs = core.fs;

    /**
     * The interface of function which loads modules from "files"
     */
    export interface IExtensionLoader {
        /**
         * @param {engine.Module} module
         *        the blank of module object
         * @param {string} filename
         *        the name of the module file
         */
        (module: engine.Module, filename: string): void;
    }

    /**
     * The interface of supported extensions list
     */
    export interface IExtensions {
        /**
         * an extension (".js" for example) => the loader
         */
        [index: string]: IExtensionLoader
    }

    /**
     * The loader of JavaScript "files"
     * The "content" of these files is a wrapper-function
     *
     * {@inheritDoc}
     */
    export function loadJS(module: engine.Module, filename: string): void {
        var content: any = fs.readFileSync(filename, "utf-8");
        module._compile(content, filename);
    }

    /**
     * The loader of JSON "files"
     * The "content" of these files is the value itself
     *
     * {@inheritDoc}
     */
    export function loadJSON(module: engine.Module, filename: string): void {
        module.exports = parseJSONFile(filename);
    }

    /**
     * The loader of binary files
     * Not supported in this environment
     *
     * {@inheritDoc}
     */
    export function loadNode(module: engine.Module, filename: string): void {
        throw new Error("Loading binary modules is not implemented in this environment");
    }

    /**
     * Parses content of a JSON "file"
     *
     * @param {string} filename
     * @returns {*}
     */
    export function parseJSONFile(filename: string): any {
        var json: any = fs.readFileSync(filename, "utf-8");
        if (typeof json === "string") {
            try {
                json = JSON.parse(json);
            } catch (e) {
                e.path = filename;
                e.message = "Error parsing " + filename + ": " + e.message;
                throw e;
            }
        } else if (typeof json === "function") {
            json = json();
        }
        return json;
    }

    /**
     * The default list of supported extensions
     *
     * @returns {object}
     */
    export function createExtensions(): IExtensions {
        return {
            ".js": loadJS,
            ".json": loadJSON,
            ".node": loadNode
        };
    }
}
