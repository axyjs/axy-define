/**
 * Asynchronous I/O
 */
/// <reference path="context.ts" />
module async {
    "use strict";

    /**
     * The interface of the asynchronous file info
     */
    export interface IFileInfo {
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
    export interface ICallback {
        (info: IFileInfo): void
    }

    /**
     * The asynchronous storage interface
     */
    export interface IStorage {
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
    export interface IRequireCallback {
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
    export interface IRequire {
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
    export function set(storage: IStorage): void {
        context.fsData.async = storage;
    }

    /**
     * Returns the asynchronous storage
     *
     * @return {object}
     *         the storage object or NULL if it is not defined
     */
    export function get(): IStorage {
        return context.fsData.async;
    }
}
