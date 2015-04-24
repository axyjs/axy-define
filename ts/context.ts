/**
 * Internal context of the library
 */
module context {
    "use strict";

    /**
     * The instance of `axy.define` or another sandbox
     */
    export var sandboxInstance: sandbox.ISandbox;

    /**
     * The instance of `axy.define.core`
     */
    export var coreInstance: coreModules.Core;

    /**
     * The instance of the signals emitter
     */
    export var signalInstance: signals.Emitter;

    /**
     * The instance of the plugin system
     */
    export var pluginsInstance: plugins.Plugins;

    /**
     * Structure of the virtual FS
     */
    export var fsData: core.fs.IData;

    /**
     * The current directory
     */
    export var directory: string = "/";

    /**
     * Destructors of subsystems
     * Added to it by a subsystem itself
     *
     * @type {function[]}
     */
    export var destructors: Function[] = [];

    /**
     * Destroys the context
     */
    export function destroy(): void {
        destructors.forEach(function (destructor: Function): void {
            destructor();
        });
        helpers.destroyContainer(coreInstance);
        helpers.destroyContainer(context);
    }
}
