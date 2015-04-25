declare module "axy-define" {
    /// <reference path="../typing/node.d.ts" />
    /**
     * Internal context of the library
     */
    module context {
        /**
         * The instance of `axy.define` or another sandbox
         */
        var sandboxInstance: sandbox.ISandbox;
        /**
         * The instance of `axy.define.core`
         */
        var coreInstance: coreModules.Core;
        /**
         * The instance of the signals emitter
         */
        var signalInstance: signals.Emitter;
        /**
         * The instance of the plugin system
         */
        var pluginsInstance: plugins.Plugins;
        /**
         * Structure of the virtual FS
         */
        var fsData: core.fs.IData;
        /**
         * The current directory
         */
        var directory: string;
        /**
         * Destructors of subsystems
         * Added to it by a subsystem itself
         *
         * @type {function[]}
         */
        var destructors: Function[];
        /**
         * Destroys the context
         */
        function destroy(): void;
    }
    /**
     * Asynchronous I/O
     */
    module async {
        /**
         * The interface of the asynchronous file info
         */
        interface IFileInfo {
            /**
             * The realpath of a target file (NULL - the file not exists)
             */
            realpath: string;
            /**
             * The file is a regular file (not a directory)
             */
            isFile: boolean;
            /**
             * The file content
             * May be `undefined` if the content is not loaded yet.
             */
            content?: IFileContent;
            /**
             * The file content may be cached in the synchronous storage
             */
            cacheable: boolean;
        }
        /**
         * The interface of a callback for the IStorage methods
         */
        interface ICallback {
            (info: IFileInfo): void;
        }
        /**
         * The asynchronous storage interface
         */
        interface IStorage {
            /**
             * Returns the info of a file
             *
             * If already have data - returns info and do not call the callback.
             * If the data does not yet have - returns NULL and call the callback afterwards.
             *
             * May return `content` empty.
             *
             * @param {string} filename
             * @param {function} callback
             * @return {object}
             */
            stat: (filename: string, callback: ICallback) => IFileInfo;
            /**
             * Reads the file info and content
             *
             * See `stat()` for algorithm details
             *
             * @param {string} filename
             * @param {function} callback
             * @return {object}
             */
            read: (filename: string, callback: ICallback) => IFileInfo;
            /**
             * Resolves a module path (optional)
             *
             * @param {string} id
             *        the request string (relative to the parent module)
             * @param {object} parent [optional]
             *        the parent module object
             * @param {function} callback
             * @return {object}
             */
            moduleResolve?: (id: IModuleRequest, parent: engine.Module, callback: ICallback) => IFileInfo;
            /**
             * Optional function for destroy the storage (garbage collection and etc.)
             */
            destroy?: () => void;
        }
        /**
         * The callback for `require.async()`
         */
        interface IRequireCallback {
            /**
             * @param {Error} err
             *        the exception instance for fail and `NULL` for success
             * @param {object} exports
             *        the module value or `NULL` for fail
             */
            (err: Error, exports: IModuleValue): void;
        }
        /**
         * The asynchronous `require.async()` interface
         */
        interface IRequire {
            /**
             * @param {string} id
             *        the request string (relative to the current module)
             * @param {function} callback
             */
            (id: IModuleRequest, callback: IRequireCallback): void;
        }
        /**
         * Sets the asynchronous storage (NULL - reset)
         *
         * @param {object} storage
         */
        function set(storage: IStorage): void;
        /**
         * Returns the asynchronous storage
         *
         * @return {object}
         *         the storage object or NULL if it is not defined
         */
        function get(): IStorage;
    }
    /**
     * Some helpers
     */
    module helpers {
        /**
         * Custom implementation of `Object.keys()`
         *
         * @param {*} object
         * @return {string[]}
         */
        function customKeys(object: Object): string[];
        /**
         * Returns a keys list of an object
         *
         * @param {*} object
         * @return {string[]}
         */
        var keys: (object: Object) => string[];
        /**
         * Destroys a container and disconnects the children
         *
         * @param container
         */
        function destroyContainer(container: Object): void;
    }
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
        /**
         * Normalizes a path
         *
         * @param {string} path
         * @returns {string}
         */
        function normalize(path: string): string;
        /**
         * Resolves a relative path
         *
         * @param {...} paths
         * @return {string}
         */
        function resolve(...paths: string[]): string;
        /**
         * Checks if a path is absolute
         *
         * @param {string} path
         * @returns {boolean}
         */
        function isAbsolute(path: string): boolean;
        /**
         * Returns the directory name of a path
         *
         * @param {string} path
         * @returns {boolean}
         */
        function dirname(path: string): string;
        /**
         * Returns the base name of a path
         *
         * @param {string} path
         * @returns {boolean}
         */
        function basename(path: string): string;
        /**
         * Returns the extension name of a path
         *
         * @param {string} path
         * @returns {boolean}
         */
        function extname(path: string): string;
        /**
         * The file path separator
         */
        var sep: string;
    }
    /**
     * Simple streams for `process.stdout` and `process.stderr`
     */
    module core.streams {
        /**
         * The interface of the `stream.write()` method
         */
        interface IStreamWrite {
            (chunk: string, encoding?: string, callback?: Function): boolean;
        }
        /**
         * The interface of streams
         */
        interface IStream {
            write: IStreamWrite;
        }
        /**
         * The stream class
         */
        class Stream implements IStream {
            /**
             * The constructor
             *
             * @param {string} cMethod
             *        a `console` method name
             */
            constructor(cMethod: string);
            /**
             * {@inheritDoc}
             */
            write(chunk: string, encoding?: string, callback?: Function): boolean;
            private log;
        }
    }
    /**
     * Timers (analogue of Node.js core module `path`)
     */
    module core.timers {
        /**
         * Instances of this class returned from setTimeout and setInterval
         * @abstract
         */
        class Timeout {
            /**
             * The constructor
             *
             * @param {function} callback
             * @param {number} delay
             * @param {Array} args
             */
            constructor(callback: Function, delay: number, args: any[]);
            /**
             * Stub function
             */
            unref(): void;
            /**
             * Stub function
             */
            ref(): void;
            /**
             * Runs the timer
             */
            start(): void;
            /**
             * Stops the timer
             */
            stop(): void;
            protected set(): number;
            protected clear(): void;
            protected handle: number;
            protected _idleTimeout: number;
            protected _onTimeout: Function;
        }
        class TimeoutOnce extends Timeout {
            protected set(): number;
            protected clear(): void;
        }
        class TimeoutInterval extends Timeout {
            protected set(): number;
            protected clear(): void;
        }
        class Immediate {
            constructor(callback: Function, args: any[]);
            handle: number;
            private _onTimeout;
        }
        function setTimeout(callback: Function, delay: number, ...args: any[]): Timeout;
        function clearTimeout(timeout: Timeout | number): void;
        function setInterval(callback: Function, delay: number, ...args: any[]): Timeout;
        function clearInterval(timeout: Timeout | number): void;
        function setImmediate(callback: Function, ...args: any[]): Immediate;
        function clearImmediate(immediate: Immediate | number): void;
    }
    /**
     * The analogue of node-variable `process`
     *
     * Inside the module is available as `process`.
     * Outside as `axy.define.global.process`.
     */
    module core.process {
        /**
         * The command line arguments
         * The second is the main module name.
         */
        var argv: string[];
        /**
         * The interface of an environment variables list
         */
        interface IEnv {
            [index: string]: string;
        }
        /**
         * Environment variables
         */
        var env: IEnv;
        /**
         * The main module of this process
         */
        var mainModule: engine.Module;
        /**
         * The global paths
         */
        var paths: string[];
        /**
         * Runs callback after the current event loop
         *
         * @param {function} callback
         */
        function nextTick(callback: Function): void;
        /**
         * Returns the current working directory
         *
         * @return {string}
         */
        function cwd(): string;
        /**
         * Changes the current working directory
         *
         * @param {string} directory
         */
        function chdir(directory: string): void;
        /**
         * Number of seconds Axy has been running
         *
         * @return {number}
         */
        function uptime(): number;
        /**
         * Returns "the current high-resolution real time" in a `[seconds, nanoseconds]`
         *
         * @param {number[]} prev
         *        the previous result for diff
         * @return {number[]}
         */
        function hrtime(prev?: number[]): number[];
        /**
         * Sets an event listener
         *
         * @param {string} event
         * @param {function} listener
         * @return {object}
         */
        function on(event: string, listener: signals.IListener): typeof core.process;
        /**
         * Aborts the process
         *
         * @param {number} code [optional]
         */
        function exit(code?: number): void;
        /**
         * Stdout (used `console.log`)
         */
        var stdout: core.streams.IStream;
        /**
         * Stderr (used `console.err`)
         */
        var stderr: core.streams.IStream;
        /**
         * The process title
         */
        var title: string;
        /**
         * The platform
         */
        var platform: string;
    }
    /**
     * Work with the virtual file system (analogue of Node.js core module `fs`)
     *
     * A virtual file may contains any value (see `IFileContent`).
     * For JS-files it is the wrapper-function, for JSON it is a JSON-object itself.
     *
     * Path type of this file system is POSIX.
     *
     * The interface of this module is similar to interface of the node.js module "fs",
     * but contains only some of the functions.
     *
     * Access to the module: `require("fs")`.
     */
    module core.fs {
        /**
         * Files list interface
         */
        interface IFiles {
            /**
             * Filename => file content (undefined if not exists)
             */
            [index: string]: IFileContent;
        }
        /**
         * Directories cache interface
         */
        interface IDirectories {
            /**
             * Directory name => exist flag
             */
            [index: string]: boolean;
        }
        interface IData {
            files: IFiles;
            dirs: IDirectories;
            async?: async.IStorage;
        }
        /**
         * @class Stat object: stripped-down version of native fs.Stat
         */
        class Stat {
            private itIsFile;
            /**
             * The constructor
             *
             * @param {boolean} itIsFile - it is regular file (not directory)
             */
            constructor(itIsFile: boolean);
            /**
             * Checks if this is regular file
             *
             * @returns {boolean}
             */
            isFile(): boolean;
            /**
             * Checks if this is directory
             *
             * @returns {boolean}
             */
            isDirectory(): boolean;
        }
        /**
         * Writes a content to the file
         *
         * @param {string} filename
         * @param {*} data
         * @param {*} options [optional] ignored
         */
        function writeFileSync(filename: string, data: IFileContent, options?: any): void;
        /**
         * Returns a content of the file
         *
         * @param {string} filename
         * @param {*} options [optional] ignored
         * @returns {*}
         * @throws {Error} the file not found
         */
        function readFileSync(filename: string, options?: any): IFileContent;
        /**
         * Returns a Stat-object of the file
         *
         * @param {string} path
         * @returns {fs.Stat}
         * @throws {Error} the file not found
         */
        function statSync(path: string): Stat;
        /**
         * Checks if the file is exists
         *
         * @param {string} path
         * @returns {boolean}
         */
        function existsSync(path: string): boolean;
        /**
         * The interface of the cache of `realpath()` function
         */
        interface IRealpathCache {
            /**
             * path => realpath(path)
             */
            [index: string]: string;
        }
        /**
         * Returns the realpath of a file
         *
         * @param {string} path
         * @param {object} cache [optional]
         *        a cache dictionary (path => result)
         * @throws {Error} the file not found
         */
        function realpathSync(path: string, cache?: IRealpathCache): string;
        /**
         * Returns the list of a directory files (excluding `.` and `..`)
         *
         * @param {string} path
         * @return {string[]}
         */
        function readdirSync(path: string): string[];
        /**
         * Checks if a file is exists (asynchronous)
         *
         * @param {string} path
         * @param {function} callback
         */
        function exists(path: string, callback: (exists: boolean) => void): void;
        /**
         * Asynchronous stat
         *
         * @param {string} path
         * @param {function} callback
         */
        function stat(path: string, callback: (err: Error, stats: Stat) => void): void;
        /**
         * Asynchronous read file
         *
         * @param {string} path
         * @param {function|*} options
         * @param {function} callback [optional]
         */
        function readFile(path: string, options: any, callback?: (err: Error, data: IFileContent) => void): void;
        /**
         * Asynchronous readdir
         *
         * @param {string} path
         * @return {string[]}
         */
        function readdir(path: string, callback: (err: Error, files: string[]) => void): void;
    }
    /**
     * Some helpers
     */
    module util {
        /**
         * @param {string} basePath
         * @return {string}
         */
        function tryFile(basePath: string): string;
        /**
         * @param {string} p
         * @param {string[]} exts
         * @return {string}
         */
        function tryExtensions(p: string, exts: string[]): string;
        /**
         * @param {string} basePath
         * @param {string[]} exts
         * @return {string}
         */
        function tryExtensionsDirMain(basePath: string, exts: string[]): string;
        /**
         * @param {string} requestPath
         * @param {string[]} exts
         * @return {string}
         */
        function tryPackage(requestPath: string, exts: string[]): string;
        /**
         * @param {string} requestPath
         * @returns {string}
         */
        function readPackage(requestPath: string): string;
    }
    /**
     * Module loaders (for different file extensions)
     */
    module extensions {
        /**
         * The interface of function which loads modules from "files"
         */
        interface IExtensionLoader {
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
        interface IExtensions {
            /**
             * an extension (".js" for example) => the loader
             */
            [index: string]: IExtensionLoader;
        }
        /**
         * The loader of JavaScript "files"
         * The "content" of these files is a wrapper-function
         *
         * {@inheritDoc}
         */
        function loadJS(module: engine.Module, filename: string): void;
        /**
         * The loader of JSON "files"
         * The "content" of these files is the value itself
         *
         * {@inheritDoc}
         */
        function loadJSON(module: engine.Module, filename: string): void;
        /**
         * The loader of binary files
         * Not supported in this environment
         *
         * {@inheritDoc}
         */
        function loadNode(module: engine.Module, filename: string): void;
        /**
         * Parses content of a JSON "file"
         *
         * @param {string} filename
         * @returns {*}
         */
        function parseJSONFile(filename: string): any;
        /**
         * The default list of supported extensions
         *
         * @returns {object}
         */
        function createExtensions(): IExtensions;
    }
    /**
     * Loading "core" modules.
     *
     * The `axy.define.core` is an instance of the class `core.Core`.
     * That instance contains modules `fs`, `paths` and `module`.
     */
    module coreModules {
        /**
         * The interface of a loader of custom "native" modules
         */
        interface ILoader {
            /**
             * Returns a module value
             *
             * @param id the module ID
             * @returns the module or NULL if the module is not exists
             */
            require: (id: IModuleId) => IModuleValue;
            /**
             * Checks if a module is exists
             *
             * @param id
             * @returns
             */
            exists: (id: IModuleId) => boolean;
        }
        /**
         * The interface of a module builder
         */
        interface IModuleBuilder {
            /**
             * @param {string} id
             *        the module name
             * @returns {*}
             *          the module value
             */
            (id: IModuleId): IModuleValue;
        }
        /**
         * @class The storage of core modules
         */
        class Core implements ILoader {
            /**
             * Returns a native module value
             *
             * @param {string} id
             * @returns {*}
             * @throws {Error} cannot find module
             */
            require(id: IModuleId): IModuleValue;
            /**
             * Checks if a native module is exists
             *
             * @param {string} id
             * @returns {boolean}
             */
            exists(id: string): boolean;
            /**
             * Adds a native module
             *
             * @param {string} id
             * @param {*} value
             */
            addModule(id: IModuleId, value: IModuleValue): void;
            /**
             * Adds a module builder
             *
             * @param {string} id
             * @param {function} builder
             */
            addModuleBuilder(id: IModuleId, builder: IModuleBuilder): void;
            /**
             * Removes a module (does not affect loaders)
             *
             * @param {string} id
             * @returns {boolean}
             *          the module existed and has been deleted
             */
            removeModule(id: IModuleId): boolean;
            private modules;
            private builders;
        }
    }
    /**
     * Defines `globalObject` the analogue of the Node.js global object
     *
     * Inside the module is available as `global`.
     * Outside as `axy.define.global`.
     */
    module core.global {
        interface IGlobal extends NodeJS.Global {
            external: any;
            window: Window;
        }
        var globalObject: IGlobal;
    }
    /**
     * The function `require()`
     */
    module req {
        import extensionsMo = extensions;
        import asyncMo = async;
        /**
         * The `require()` function interface
         */
        interface IRequire {
            /**
             * Returns a module value by a request string
             *
             * @param {string} id
             * @return {*}
             */
            (id: IModuleRequest): IModuleValue;
        }
        /**
         * The interface of `require()` that accessible inside the module constructor
         */
        interface IRequireModule extends IRequire {
            /**
             * Resolves a request relative to the module
             *
             * @param {string} request
             * @return {string}
             */
            resolve: (request: IModuleRequest) => string;
            /**
             * The link on the main module
             */
            main: engine.Module;
            /**
             * The link to the extensions loaders list
             */
            extensions: extensionsMo.IExtensions;
            /**
             * The link to the modules cache
             */
            cache: engine.ICacheModules;
            /**
             * Asynchronous require
             */
            async: asyncMo.IRequire;
        }
        /**
         * Creates a require instance for a module constructor
         *
         * @param {*} mo
         * @return {IRequireModule}
         */
        function createForModule(mo: engine.Module): IRequireModule;
    }
    /**
     * Common functionality of modular system
     */
    module engine {
        import fs = core.fs;
        /**
         * The interface of the module wrapper
         */
        interface IWrapper {
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
            (exports: IModuleValue, require: req.IRequireModule, module: Module, __filename: string, __dirname: string): any;
        }
        /**
         * The interface of the loaded modules cache
         */
        interface ICacheModules {
            /**
             * The name of a module => the module value
             */
            [index: string]: Module;
        }
        /**
         * The interface of the path resolves cache
         */
        interface IPathCache {
            /**
             * The key resolve => the path
             */
            [index: string]: string;
        }
        /**
         * @class Module object
         * Module objects are accessible inside module constructors as the variable `module`.
         */
        class Module {
            /**
             * Circular link on itself (as it is written in the node.js "backwards compatibility")
             */
            static Module: typeof Module;
            /**
             * The list of the file loaders by extensions (@see `extensions.ts`)
             */
            static _extensions: extensions.IExtensions;
            /**
             * The cache of the loaded modules
             */
            static _cache: ICacheModules;
            /**
             * In node.js this variable depends on one of the environment variables.
             * Affects the context load modules.
             * Here is always FALSE.
             */
            static _contextLoad: boolean;
            /**
             * In node.js it is copy of the list of global paths.
             * Modification of it does not affect.
             * Here is always empty.
             */
            static globalPaths: string[];
            /**
             * The cache of `_findPath()`
             */
            static _pathCache: IPathCache;
            /**
             * The cache of `realpath()`
             */
            static _realpathCache: fs.IRealpathCache;
            /**
             * The module wrapper
             * Here it affects only the file whose contents is a string
             */
            static wrapper: string[];
            /**
             * Runs the main module.
             * In node.js it is taken of the command line arguments.
             * In axy-define it called from `axy.define.require()`.
             */
            static runMain(): void;
            /**
             * Wraps a file text content in the module wrapper
             *
             * @param {string} content
             * @return {string}
             */
            static wrap(content: string): string;
            /**
             * Loads a module
             *
             * @param {string} request
             * @param {*} parent
             * @param {boolean} isMain
             * @return {*}
             */
            static _load(request: IModuleRequest, parent: Module, isMain?: boolean): IModuleValue;
            /**
             * Resolves the real filename of a requested module
             *
             * @param {string} request
             * @param {*} parent
             * @return {string}
             * @throws {Error} - module not found
             */
            static _resolveFilename(request: IModuleRequest, parent: Module): string;
            /**
             * Finds the path to a requested module in a paths list
             *
             * @param {string} request
             * @param {string[]} paths
             * @return {object}
             */
            static _findPath(request: string, paths: string[]): string;
            /**
             * Returns the info about a request (a module id and a list of paths)
             *
             * @param {string} request
             * @param {*} parent
             * @return {Array}
             */
            static _resolveLookupPaths(request: string, parent: Module): any[];
            /**
             * Returns a list of directories for search relative a module directory
             *
             * @param {string} from
             *        the module directory
             * @return {string[]}
             */
            static _nodeModulePaths(from: string): string[];
            /**
             * The dummy for compatibility
             */
            static _debug(): void;
            /**
             * For compatibility
             */
            static requireRepl(): void;
            /**
             * Initializes the global paths list
             */
            static _initPaths(): void;
            /**
             * The module identifier
             * Typically it equals `filename`.
             * For main module it contains ".".
             */
            id: IModuleId;
            /**
             * The parent module
             * The first module, which loaded this module.
             * NULL for the main module.
             */
            parent: Module;
            /**
             * The value of the module
             * This value is returned by the function `require()`
             */
            exports: IModuleValue;
            /**
             * The full normalized path to the module
             */
            filename: string;
            /**
             * Is the module loaded?
             */
            loaded: boolean;
            /**
             * The list of modules that have been created due to the current
             */
            children: Module[];
            /**
             * The list of paths to search for children
             */
            paths: string[];
            /**
             * The constructor
             *
             * @param {string} id
             * @param {object} parent
             */
            constructor(id: IModuleId, parent: Module);
            /**
             * Loads the module value by a file name
             *
             * @param {string} filename
             */
            load(filename: string): void;
            /**
             * Require relative this module
             *
             * @param {string} path
             * @return {*}
             */
            require(path: IModuleRequest): any;
            /**
             * "Compiles" the module content
             *
             * @param {string|function} content
             * @param {string} filename
             */
            _compile(content: IFileContent, filename: string): void;
        }
        function destroy(): void;
        function errorModuleNotFound(id?: IModuleId, raise?: boolean): Error;
    }
    /**
     * Some global types
     *
     * These types are moved from the specific modules to the global scope because some IDE do not supported export types.
     */
    /**
     * The module value
     *
     * What is contained in the `module.exports`
     */
    type IModuleValue = any;
    /**
     * The module identifier
     *
     * The name for native modules ("fs" -> "fs")
     * A string "." for the main module
     * A full normalized path for others
     */
    type IModuleId = string;
    /**
     * The argument of require()
     *
     * require("./../module.js")
     * Here the module-request is `./../module.js`
     * And the module-id is `/real/path/to/module.js`
     */
    type IModuleRequest = string;
    /**
     * Content of a JSON "file"
     * - the value itself
     * - JSON-string
     * - a function that returns a value
     */
    type IFileJSONContent = any;
    /**
     * Content of a JS "file"
     * - a function wrapper above a module constructor or a string of code
     * - a code string
     */
    type IFileJSContent = engine.IWrapper;
    /**
     * Content of others "files"
     */
    type IFileTXT = string;
    /**
     * Summary content of any "file"
     */
    type IFileContent = IFileJSONContent | IFileJSContent | IFileTXT;
    /**
     * System signals
     * @see `axy.define.signal` and `process.on`
     */
    module signals {
        /**
         * The event listener interface
         */
        interface IListener {
            (...args: any[]): void;
        }
        /**
         * Events emitter
         */
        class Emitter {
            /**
             * Sets an event listener
             *
             * @param {string} event
             * @param {function} listener
             */
            on(event: string, listener: IListener): void;
            /**
             * Fires event
             *
             * @param {string} event
             * @param {any[]} args
             */
            fire(event: string, args?: any[]): void;
            /**
             * Destroys the emitter
             */
            destroy(): void;
            private listeners;
        }
    }
    /**
     * Settings of the system
     */
    module settings {
        interface ISettings {
            /**
             * The list of file basenames for index file
             */
            dirMain: string[];
            /**
             * The list of the package.json filed for index file
             */
            packageMain: string[];
            /**
             * The additional list of the wrapper arguments
             */
            wrapperArgs: any[];
        }
        var instance: ISettings;
    }
    /**
     * Creating structure of `define` function
     *
     * All compiled code including in the `createSandbox()` function (see file `assembly/axy-define.js.tpl`).
     * `createSandbox()` allows you to create a full copy of the system.
     */
    module sandbox {
        import globalMo = core.global;
        import settingsMo = settings;
        import asyncMo = async;
        /**
         * The interface of the function that creates an instance of the system
         */
        interface ICreateSandbox {
            /**
             * @return {function}
             *         the `define()` function
             */
            (): ISandbox;
        }
        /**
         * Context of `axy.define.require` and `getModule` functions
         */
        interface IRequireContext {
            /**
             * Force reload the module.
             * By default find in the cache.
             */
            reload?: boolean;
            /**
             * The "command line" arguments
             */
            argv?: string[];
            /**
             * The current dir
             * TRUE (by default) - changes to the module directory
             * FALSE - do not change
             * string - the directory itself
             */
            dir?: string | boolean;
        }
        /**
         * The interface of function `axy.define.require`
         */
        interface IRequireGlobal {
            /**
             * Returns a module value
             * If the module is not yet loaded, it is loaded as main
             * Does not return core modules.
             *
             * @param {string} name
             * @param {object} context [optional]
             * @return {*}
             * @throws {Error} module not found or invalid
             */
            (name: IModuleId, context?: IRequireContext): IModuleValue;
            /**
             * Returns a module object
             * If the module is not yet loaded, it is loaded as main
             *
             * @param {string} name
             * @param {object} context [optional]
             * @return {object}
             * @throws {Error} module not found or invalid
             */
            getModule: (name: IModuleId) => engine.Module;
        }
        /**
         * The interface of the `axy.define` function
         */
        interface ISandbox {
            /**
             * Defines a module
             *
             * @param {string} id
             *        the absolute path to the module "file"
             * @param {string} content
             *        the "file" content
             */
            (id: IModuleId, content: IFileContent): any;
            /**
             * The global require
             * {@inheritDoc}
             */
            require: IRequireGlobal;
            /**
             * The core modules loader
             */
            core: coreModules.Core;
            /**
             * The global variable
             */
            global: globalMo.IGlobal;
            /**
             * The global `createSandbox()` function
             */
            createSandbox: ICreateSandbox;
            /**
             * The system settings
             */
            settings: settingsMo.ISettings;
            /**
             * Asynchronous storage
             */
            async: typeof asyncMo;
            /**
             * Sends a signal to the system
             *
             * @param {string} event
             * @param {...} args
             */
            signal: (event: string, ...args: any[]) => void;
            /**
             * Adds a plugin to the system
             *
             * @param {string} name
             * @param {function} builder
             */
            addPlugin: (name: string, builder: plugins.IPluginBuilder) => any;
        }
        /**
         * Creates a system
         *
         * @param {function} cs - `createSandbox()` wrapper
         * @return {function}
         */
        function create(cs: ICreateSandbox): ISandbox;
    }
    /**
     * The plugin system
     */
    module plugins {
        /**
         * Plugin builder
         */
        interface IPluginBuilder {
            (context: typeof context): any;
        }
        /**
         * The plugins container
         */
        class Plugins {
            private context;
            /**
             * The constructor
             *
             * @param {object} context
             *        the system context
             */
            constructor(context: typeof context);
            /**
             * Appends a plugin to the system
             *
             * @param {string} name
             * @param {function} builder
             * @return {*}
             *         returns the builder return
             */
            append(name: string, builder: IPluginBuilder): any;
            /**
             * Applies the plugins list to a child sandbox
             *
             * @param {object} sandbox
             */
            applyToSandbox(sandbox: sandbox.ISandbox): void;
            /**
             * Destroys the plugin container
             */
            destroy(): void;
            private plugins;
        }
    }
    
}
