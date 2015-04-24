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
/// <reference path="../types.ts" />
/// <reference path="../async.ts" />
/// <reference path="../context.ts" />
/// <reference path="../helpers.ts" />
/// <reference path="process.ts" />
module core.fs {
    "use strict";

    import process = core.process;

    /**
     * Files list interface
     */
    export interface IFiles {
        /**
         * Filename => file content (undefined if not exists)
         */
        [index: string]: IFileContent;
    }

    /**
     * Directories cache interface
     */
    export interface IDirectories {
        /**
         * Directory name => exist flag
         */
        [index: string]: boolean;
    }

    /**
     * The files list
     */
    var files: IFiles = {};

    /**
     * The directories list
     */
    var dirs: IDirectories = {
        "/": true
    };

    export interface IData {
        files: IFiles;
        dirs: IDirectories;
        async?: async.IStorage;
    }

    var data: IData = {
        files: files,
        dirs: dirs
    };

    context.fsData = data;

    /**
     * @class Stat object: stripped-down version of native fs.Stat
     */
    export class Stat {
        /**
         * The constructor
         *
         * @param {boolean} itIsFile - it is regular file (not directory)
         */
        constructor(private itIsFile: boolean) {
        }

        /**
         * Checks if this is regular file
         *
         * @returns {boolean}
         */
        public isFile(): boolean {
            return this.itIsFile;
        }

        /**
         * Checks if this is directory
         *
         * @returns {boolean}
         */
        public isDirectory(): boolean {
            return !this.itIsFile;
        }
    }

    /**
     * Writes a content to the file
     *
     * @param {string} filename
     * @param {*} data
     * @param {*} options [optional] ignored
     */
    export function writeFileSync(filename: string, data: IFileContent, options: any = null): void {
        var dir: string = "";
        filename = relativeFile(filename);
        if (dirs[filename]) {
            throw errorDir();
        }
        files[filename] = data;
        filename.split("/").slice(1, -1).forEach(function (item: string): void {
            dir += "/" + item;
            dirs[dir] = true;
        });
    }

    /**
     * Returns a content of the file
     *
     * @param {string} filename
     * @param {*} options [optional] ignored
     * @returns {*}
     * @throws {Error} the file not found
     */
    export function readFileSync(filename: string, options: any = null): IFileContent {
        filename = relativeFile(filename);
        if (!files.hasOwnProperty(filename)) {
            if (dirs[filename]) {
                throw errorDir();
            }
            throw errorFile(filename);
        }
        return files[filename];
    }

    /**
     * Returns a Stat-object of the file
     *
     * @param {string} path
     * @returns {fs.Stat}
     * @throws {Error} the file not found
     */
    export function statSync(path: string): Stat {
        path = relativeFile(path);
        if (files[path] !== void 0) {
            return new Stat(true);
        } else if (dirs[path]) {
            return new Stat(false);
        }
        throw errorFile(path);
    }

    /**
     * Checks if the file is exists
     *
     * @param {string} path
     * @returns {boolean}
     */
    export function existsSync(path: string): boolean {
        path = relativeFile(path);
        return !!((files[path] !== void 0) || dirs[path]);
    }

    /**
     * The interface of the cache of `realpath()` function
     */
    export interface IRealpathCache {
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
    export function realpathSync(path: string, cache: IRealpathCache = null): string {
        path = relativeFile(path);
        if (cache && cache[path]) {
            return cache[path];
        }
        if (!existsSync(path)) {
            throw errorFile(path);
        }
        if (cache) {
            cache[path] = path;
        }
        return path;
    }

    /**
     * Returns the list of a directory files (excluding `.` and `..`)
     *
     * @param {string} path
     * @return {string[]}
     */
    export function readdirSync(path: string): string[] {
        var result: any = {},
            len: number;
        path = relativeFile(path);
        if (path !== "/") {
            path += "/";
        }
        len = path.length;
        helpers.keys(files).forEach(function (filename: string): void {
            if (filename.indexOf(path) === 0) {
                result[filename.slice(len).split("/")[0]] = true;
            }
        });
        return helpers.keys(result);
    }

    /**
     * Checks if a file is exists (asynchronous)
     *
     * @param {string} path
     * @param {function} callback
     */
    export function exists(path: string, callback: (exists: boolean) => void): void {
        var info: async.IFileInfo;
        path = relativeFile(path);
        if ((files[path] !== void 0) || dirs[path]) {
            return tick(callback, [true]);
        }
        if (!data.async) {
            return tick(callback, [false]);
        }
        info = data.async.stat(path, function (info: async.IFileInfo): void {
            cacheAsync(info);
            callback(!!info.realpath);
        });
        if (info) {
            cacheAsync(info);
            return tick(callback, [!!info.realpath]);
        }
    }

    /**
     * Asynchronous stat
     *
     * @param {string} path
     * @param {function} callback
     */
    export function stat(path: string, callback: (err: Error, stats: Stat) => void): void {
        var info: async.IFileInfo;
        path = relativeFile(path);
        if (files[path] !== void 0) {
            return tick(callback, [null, new Stat(true)]);
        }
        if (dirs[path]) {
            return tick(callback, [null, new Stat(false)]);
        }
        if (!data.async) {
            return tick(callback, [errorFile(path), null]);
        }
        info = data.async.stat(path, function (info: async.IFileInfo): void {
            cacheAsync(info);
            if (info.realpath) {
                callback(null, new Stat(info.isFile));
            } else {
                callback(errorFile(path), null);
            }
        });
        if (info) {
            cacheAsync(info);
            if (info.realpath) {
                tick(callback, [null, new Stat(info.isFile)]);
            } else {
                tick(callback, [errorFile(path), null]);
            }
        }
    }

    /**
     * Asynchronous read file
     *
     * @param {string} path
     * @param {function|*} options
     * @param {function} callback [optional]
     */
    export function readFile(path: string, options: any, callback: (err: Error, data: IFileContent) => void = null): void {
        var info: async.IFileInfo;
        if (!callback) {
            callback = options;
        }
        path = relativeFile(path);
        if (files[path] !== void 0) {
            return tick(callback, [null, files[path]]);
        }
        if (dirs[path]) {
            return tick(callback, [errorDir(), null]);
        }
        if (!data.async) {
            return tick(callback, [errorFile(path), null]);
        }
        info = data.async.read(path, function (info: async.IFileInfo): void {
            cacheAsync(info);
            if (info.realpath) {
                if (info.isFile) {
                    callback(null, info.content);
                } else {
                    callback(errorDir(), null);
                }
            } else {
                callback(errorFile(path), null);
            }
        });
        if (info) {
            cacheAsync(info);
            if (info.realpath) {
                if (info.isFile) {
                    tick(callback, [null, info.content]);
                } else {
                    tick(callback, [errorDir(), null]);
                }
            } else {
                tick(callback, [errorFile(path), null]);
            }
        }
    }

    /**
     * Asynchronous readdir
     *
     * @param {string} path
     * @return {string[]}
     */
    export function readdir(path: string, callback: (err: Error, files: string[]) => void): void {
        tick(callback, [null, readdirSync(path)]);
    }

    context.destructors.push(function destroyFS(): void {
        files = null;
        dirs = null;
        if (data.async) {
            if (data.async.destroy) {
                data.async.destroy();
            }
            data.async = null;
        }
        data = null;
    });

    /**
     * Returns a file relative to the current directory
     *
     * @param {string} file
     */
    function relativeFile(file: string): string {
        if (file.charAt(0) === "/") {
            return file;
        }
        return path.resolve(context.directory, file);
    }

    /**
     * Creates an error of directory operation
     *
     * @return {Error}
     */
    function errorDir(): Error {
        return new Error("EISDIR, illegal operation on a directory");
    }

    /**
     * Creates an error of file operation
     *
     * @param {string} filename
     * @return {Error}
     */
    function errorFile(filename: string): Error {
        return Error("no such file or directory '" + filename + "'");
    }

    /**
     * Runs a callback in the next tick
     *
     * @param {function} callback
     * @param {Array} args
     */
    function tick(callback: (...args: any[]) => any, args: any[] = []): void {
        process.nextTick(function (): void {
            callback.apply(null, args);
        });
    }

    /**
     * @param {object} info
     */
    function cacheAsync(info: async.IFileInfo): void {
        if (info.realpath && info.cacheable) {
            if (info.isFile) {
                if (info.content !== void 0) {
                    writeFileSync(info.realpath, info.content);
                }
            } else {
                dirs[info.realpath] = true;
            }
        }
    }
}
