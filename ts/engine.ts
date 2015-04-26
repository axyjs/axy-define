/**
 * Common functionality of modular system
 */
/// <reference path="types.ts" />
/// <reference path="extensions.ts" />
/// <reference path="coreModules.ts" />
/// <reference path="core/process.ts" />
/// <reference path="core/global.ts" />
/// <reference path="core/fs.ts" />
/// <reference path="core/path.ts" />
/// <reference path="util.ts" />
/// <reference path="helpers.ts" />
/// <reference path="req.ts" />
/// <reference path="context.ts" />
module engine {
    "use strict";

    import path = core.path;
    import fs = core.fs;

    /**
     * The interface of the module wrapper
     */
    export interface IWrapper {
        /**
         * @param {*} exports
         *        the module value
         * @param {function} require
         *        depending on the module function `require()`
         * @param {*} module
         *        the module object
         * @param {string} __filename
         *        the name of the module file
         * @param {string} __dirname
         *        the directory of the module file
         */
        (exports: IModuleValue, require: req.IRequireModule, module: Module, __filename: string, __dirname: string);
    }

    /**
     * The interface of the loaded modules cache
     */
    export interface ICacheModules {
        /**
         * The name of a module => the module value
         */
        [index: string]: Module;
    }

    /**
     * The interface of the path resolves cache
     */
    export interface IPathCache {
        /**
         * The key resolve => the path
         */
        [index: string]: string;
    }

    /**
     * The private variable contained a global paths list
     */
    var modulePaths: string[] = [];

    /**
     * @class Module object
     * Module objects are accessible inside module constructors as the variable `module`.
     */
    export class Module {
        /**
         * Circular link on itself (as it is written in the node.js "backwards compatibility")
         */
        public static Module: typeof Module = Module;

        /**
         * The list of the file loaders by extensions (@see `extensions.ts`)
         */
        public static _extensions: extensions.IExtensions = extensions.createExtensions();

        /**
         * The cache of the loaded modules
         */
        public static _cache: ICacheModules = {};

        /**
         * In node.js this variable depends on one of the environment variables.
         * Affects the context load modules.
         * Here is always FALSE.
         */
        public static _contextLoad: boolean = false;

        /**
         * In node.js it is copy of the list of global paths.
         * Modification of it does not affect.
         * Here is always empty.
         */
        public static globalPaths: string[] = [];

        /**
         * The cache of `_findPath()`
         */
        public static _pathCache: IPathCache = {};

        /**
         * The cache of `realpath()`
         */
        public static _realpathCache: fs.IRealpathCache = {};

        /**
         * The module wrapper
         * Here it affects only the file whose contents is a string
         */
        public static wrapper: string[] = [
            "(function (exports, require, module, __filename, __dirname, global, process) { " +
            "(function (exports, require, module, __filename, __dirname) { ",
            "\n})(exports, require, module, __filename, __dirname);});"
        ];

        /**
         * Runs the main module.
         * In node.js it is taken of the command line arguments.
         * In axy-define it called from `axy.define.require()`.
         */
        public static runMain(): void {
            Module._load(core.process.argv[1], null, true);
        }

        /**
         * Wraps a file text content in the module wrapper
         *
         * @param {string} content
         * @return {string}
         */
        public static wrap(content: string): string {
            var w: string[] = Module.wrapper;
            return [w[0], content, w[1]].join("");
        }

        /**
         * Loads a module
         *
         * @param {string} request
         * @param {*} parent
         * @param {boolean} isMain
         * @return {*}
         */
        public static _load(request: IModuleRequest, parent: Module, isMain: boolean = false): IModuleValue {
            var filename: string,
                module: Module;
            filename = Module._resolveFilename(request, parent);
            if (Module._cache[filename]) {
                return Module._cache[filename].exports;
            }
            if (context.coreInstance.exists(filename)) {
                return context.coreInstance.require(filename);
            }
            module = new Module(filename, parent);
            if (isMain) {
                core.process.mainModule = module;
                module.id = ".";
            }
            Module._cache[filename] = module;
            try {
                module.load(filename);
            } catch (e) {
                delete Module._cache[filename];
                throw e;
            }
            return module.exports;
        }

        /**
         * Resolves the real filename of a requested module
         *
         * @param {string} request
         * @param {*} parent
         * @return {string}
         * @throws {Error} - module not found
         */
        public static _resolveFilename(request: IModuleRequest, parent: Module): string {
            var paths: string[],
                filename: string;
            if (context.coreInstance.exists(request)) {
                return request;
            }
            paths = Module._resolveLookupPaths(request, parent)[1];
            filename = Module._findPath(request, paths);
            if (!filename) {
                throw errorModuleNotFound(request);
            }
            return filename;
        }

        /**
         * Finds the path to a requested module in a paths list
         *
         * @param {string} request
         * @param {string[]} paths
         * @return {object}
         */
        public static _findPath(request: string, paths: string[]): string {
            var exts: string[] = helpers.keys(Module._extensions),
                trailingSlash: boolean = (request.slice(-1) === "/"),
                cacheKey: string = JSON.stringify({request: request, paths: paths}),
                len: number,
                i: number,
                basePath: string,
                filename: string;
            if (request.charAt(0) === "/") {
                paths = [""];
            }
            if (Module._pathCache[cacheKey]) {
                return Module._pathCache[cacheKey];
            }
            for (i = 0, len = paths.length; i < len; i += 1) {
                basePath = path.resolve(paths[i], request);
                if (!trailingSlash) {
                    filename = util.tryFile(basePath) || util.tryExtensions(basePath, exts);
                }
                if (!filename) {
                    filename = util.tryPackage(basePath, exts) || util.tryExtensionsDirMain(basePath, exts);
                }
                if (filename) {
                    Module._pathCache[cacheKey] = filename;
                    return filename;
                }
            }
            return null;
        }

        /**
         * Returns the info about a request (a module id and a list of paths)
         *
         * @param {string} request
         * @param {*} parent
         * @return {Array}
         */
        public static _resolveLookupPaths(request: string, parent: Module): any[]  {
            var start: string,
                paths: string[],
                isIndex: boolean,
                parentIdPath: string,
                id: string;
            if (context.coreInstance.exists(request)) {
                return [request, []];
            }
            start = request.substring(0, 2);
            if ((start !== "./") && (start !== "..")) {
                paths = modulePaths;
                if (parent) {
                    if (!parent.paths) {
                        parent.paths = [];
                    }
                    paths = parent.paths.concat(paths);
                }
                return [request, paths];
            }
            isIndex = /^index\.\w+?$/.test(path.basename(parent.filename));
            parentIdPath = isIndex ? parent.id : path.dirname(parent.id);
            id = path.resolve(parentIdPath, request);
            if ((parentIdPath === ".") && (id.indexOf("/") === -1)) {
                id = "./" + id;
            }
            return [id, [path.dirname(parent.filename)]];
        }

        /**
         * Returns a list of directories for search relative a module directory
         *
         * @param {string} from
         *        the module directory
         * @return {string[]}
         */
        public static _nodeModulePaths(from: string): string[] {
            var result: string[] = ["/node_modules"],
                dir: string = "";
            from.split("/").slice(1).forEach(function (item: string): void {
                dir += "/" + item;
                if (item !== "node_modules") {
                    result.push(dir + "/node_modules");
                }
            });
            return result.reverse();
        }

        /**
         * The dummy for compatibility
         */
        public static _debug(): void {
            return;
        }

        /**
         * For compatibility
         */
        public static requireRepl(): void {
            throw new Error("Module 'repl' is not defined in this environment");
        }

        /**
         * Initializes the global paths list
         */
        public static _initPaths(): void {
            modulePaths = core.process.paths;
        }

        /**
         * The module identifier
         * Typically it equals `filename`.
         * For main module it contains ".".
         */
        public id: IModuleId;

        /**
         * The parent module
         * The first module, which loaded this module.
         * NULL for the main module.
         */
        public parent: Module;

        /**
         * The value of the module
         * This value is returned by the function `require()`
         */
        public exports: IModuleValue = {};

        /**
         * The full normalized path to the module
         */
        public filename: string = null;

        /**
         * Is the module loaded?
         */
        public loaded: boolean = false;

        /**
         * The list of modules that have been created due to the current
         */
        public children: Module[] = [];

        /**
         * The list of paths to search for children
         */
        public paths: string[];

        /**
         * The constructor
         *
         * @param {string} id
         * @param {object} parent
         */
        constructor(id: IModuleId, parent: Module) {
            this.id = id;
            this.parent = parent;
            if (parent && parent.children) {
                parent.children.push(this);
            }
        }

        /**
         * Loads the module value by a file name
         *
         * @param {string} filename
         */
        public load(filename: string): void {
            var extension: string;
            if (this.loaded) {
                throw new Error("Already loaded");
            }
            this.filename = filename;
            this.paths = Module._nodeModulePaths(path.dirname(filename));
            extension = path.extname(filename) || ".js";
            if (!Module._extensions[extension]) {
                extension = ".js";
            }
            Module._extensions[extension](this, filename);
            this.loaded = true;
        }

        /**
         * Require relative this module
         *
         * @param {string} path
         * @return {*}
         */
        public require(path: IModuleRequest): any {
            return Module._load(path, this);
        }

        /**
         * "Compiles" the module content
         *
         * @param {string|function} content
         * @param {string} filename
         */
        public _compile(content: IFileContent, filename: string): void {
            var wrapper: IWrapper,
                wrapped: string,
                args: any[];
            if (typeof content === "function") {
                wrapper = <IWrapper>content;
            } else {
                wrapped = Module.wrap(util.clearCode(<string>content));
                wrapper = eval(wrapped);
                if (!wrapper) { // ie8
                    wrapper = eval("var w=" + wrapped + ";w");
                }
            }
            args = [
                this.exports,
                req.createForModule(this),
                this,
                filename,
                path.dirname(filename)
            ];
            args = args.concat(settings.instance.wrapperArgs);
            wrapper.apply(this.exports, args);
        }
    }

    export function destroy(): void {
        Module._cache = null;
        Module._extensions = null;
    }

    export function errorModuleNotFound(id: IModuleId = null, raise: boolean = false): Error {
        var err: Error = new Error("Cannot find module '" + id + "'");
        (<any>err).code = "MODULE_NOT_FOUND";
        if (raise) {
            throw err;
        }
        return err;
    }
}
