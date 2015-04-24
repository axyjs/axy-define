/**
 * The function `require()`
 */
/// <reference path="types.ts" />
/// <reference path="engine.ts" />
/// <reference path="core/process.ts" />
/// <reference path="async.ts" />
/// <reference path="core/fs.ts" />
/// <reference path="core/path.ts" />
module req {
    "use strict";

    import fs = core.fs;
    import path = core.path;
    import extensionsMo = extensions;
    import asyncMo = async;

    /**
     * The `require()` function interface
     */
    export interface IRequire {
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
    export interface IRequireModule extends IRequire {
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
    export function createForModule(mo: engine.Module): IRequireModule {
        var Module: typeof engine.Module = engine.Module,
            req: IRequireModule;
        req = <IRequireModule>function require(path: IModuleRequest): IModuleValue {
            return mo.require(path);
        };
        req.resolve = function (request: IModuleRequest): string {
            return Module._resolveFilename(request, mo);
        };
        req.main = core.process.mainModule;
        req.extensions = Module._extensions;
        req.cache = Module._cache;
        req.async = function (id: IModuleRequest, callback: (err: Error, exports: IModuleValue) => void): void {
            var filename: string,
                exports: IModuleValue,
                async: async.IStorage,
                err: Error,
                info: async.IFileInfo;
            function call(err: Error, exports: IModuleValue): void {
                core.process.nextTick(function (): void {
                    callback(err, exports);
                });
            }
            try {
                filename = Module._resolveFilename(id, mo);
                try {
                    exports = mo.require(filename);
                    return call(null, exports);
                } catch (err) {
                    return call(err, null);
                }
            } catch (err) {
            }
            async = asyncMo.get();
            if (!async) {
                return call(err, null);
            }
            if (typeof async.moduleResolve !== "function") {
                id = path.resolve(path.dirname(mo.filename), id);
                fs.readFile(id, function (): void {
                    try {
                        call(null, mo.require(id));
                    } catch (err) {
                        call(err, null);
                    }
                });
                return;
            }
            function check(info: async.IFileInfo, call: (err: Error, exports: IModuleValue) => void = null): void {
                if (!call) {
                    call = callback;
                }
                if ((!info.realpath) || (!info.isFile)) {
                    return call(engine.errorModuleNotFound(id), null);
                }
                if (!info.cacheable) {
                    throw new Error("Async module '" + id + "' is not cacheable");
                }
                if (info.content !== void 0) {
                    fs.writeFileSync(info.realpath, info.content, "utf-8");
                    return call(null, mo.require(info.realpath));
                }
                fs.readFile(id, function (): void {
                    try {
                        call(null, mo.require(id));
                    } catch (err) {
                        call(err, null);
                    }
                });
            }
            info = async.moduleResolve(id, mo, check);
            if (info) {
                check(info, call);
            }
        };
        return req;
    }
}
