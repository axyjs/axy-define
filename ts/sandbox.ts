/**
 * Creating structure of `define` function
 *
 * All compiled code including in the `createSandbox()` function (see file `assembly/axy-define.js.tpl`).
 * `createSandbox()` allows you to create a full copy of the system.
 */
/// <reference path="types.ts" />
/// <reference path="engine.ts" />
/// <reference path="helpers.ts" />
/// <reference path="coreModules.ts" />
/// <reference path="core/fs.ts" />
/// <reference path="core/path.ts" />
/// <reference path="core/timers.ts" />
/// <reference path="core/process.ts" />
/// <reference path="core/global.ts" />
/// <reference path="settings.ts" />
/// <reference path="context.ts" />
/// <reference path="plugins.ts" />
module sandbox {
    "use strict";

    import fs = core.fs;
    import path = core.path;
    import timers = core.timers;
    import globalMo = core.global;
    import settingsMo = settings;
    import asyncMo = async;

    /**
     * The interface of the function that creates an instance of the system
     */
    export interface ICreateSandbox {
        /**
         * @return {function}
         *         the `define()` function
         */
        (): ISandbox;
    }

    /**
     * Context of `axy.define.require` and `getModule` functions
     */
    export interface IRequireContext {
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
        dir?: string|boolean;
    }

    /**
     * The interface of function `axy.define.require`
     */
    export interface IRequireGlobal {
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
    export interface ISandbox {
        /**
         * Defines a module
         *
         * @param {string} id
         *        the absolute path to the module "file"
         * @param {string} content
         *        the "file" content
         */
        (id: IModuleId, content: IFileContent);

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
    export function create(cs: ICreateSandbox): ISandbox {
        var sandbox: ISandbox,
            gRequire: IRequireGlobal,
            Module: typeof engine.Module = engine.Module,
            getModule: any; // typeof IRequireGlobal.getModule;
        sandbox = <ISandbox>function define(id: IModuleId, content: IFileContent): void {
            init();
            fs.writeFileSync(id, content, "utf-8");
        };
        context.sandboxInstance = sandbox;
        context.coreInstance = new coreModules.Core();
        context.pluginsInstance = new plugins.Plugins(context);
        context.signalInstance = new signals.Emitter();
        getModule = function (id: IModuleId, context: IRequireContext = {}): engine.Module {
            var cache: engine.ICacheModules = Module._cache;
            init();
            if (context.reload) {
                delete cache[id];
            }
            if (!cache.hasOwnProperty(id)) {
                core.process.argv = ["axy", id].concat(context.argv || []);
                if (typeof context.dir === "string") {
                    core.process.chdir(<string>context.dir);
                } else if (context.dir !== false) {
                    core.process.chdir(path.dirname(id));
                }
                Module.runMain();
            }
            return cache[id];
        };
        gRequire = <IRequireGlobal>function require(id: IModuleId, context: IRequireContext): IModuleValue {
            var module: engine.Module = getModule(id, context);
            return module && module.exports;
        };
        gRequire.getModule = getModule;
        sandbox.require = gRequire;
        sandbox.core = context.coreInstance;
        sandbox.core.addModule("fs", fs);
        sandbox.core.addModule("path", path);
        sandbox.core.addModule("timers", timers);
        sandbox.core.addModuleBuilder("module", function (): IModuleValue {
            init();
            return engine.Module;
        });
        sandbox.core.addModule("__axy", {util: util, helpers: helpers});
        sandbox.global = globalMo.globalObject;
        sandbox.async = asyncMo;
        sandbox.createSandbox = function (): ISandbox {
            var sandbox: ISandbox = cs();
            init();
            context.pluginsInstance.applyToSandbox(sandbox);
            return sandbox;
        };
        sandbox.settings = settingsMo.instance;
        function destroy(): void {
            context.destroy();
            engine.destroy();
            helpers.destroyContainer(sandbox);
        }
        sandbox.signal = function (event: string, ...args: any[]): void {
            context.signalInstance.fire(event, args);
            if (event === "exit") {
                destroy();
            }
        };
        sandbox.addPlugin = function addPlugin (name: string, builder: plugins.IPluginBuilder): any {
            init();
            return context.pluginsInstance.append(name, builder);
        };
        return sandbox;
    }

    var initialized: boolean = false;
    function init(): void {
        if (!initialized) {
            engine.Module._initPaths();
            initialized = true;
        }
    }
}
