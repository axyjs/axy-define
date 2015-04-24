/**
 * The analogue of the global object
 *
 * Inside the module is available as `global`.
 * Outside as `axy.define.global`.
 */
/// <reference path="process.ts" />
module core.global {
    declare var globalObject: typeof Window;

    /**
     * Circular reference to itself
     */
    export var global: typeof core.global = core.global;

    /**
     * Global variable `process`
     */
    export var process: typeof core.process = core.process;

    /**
     * Real global object
     */
    export var window: any = globalObject;

    /**
     * Data from the server
     */
    export var external: any = {};

    var timers: typeof core.timers = core.timers;

    export var console: typeof window.console = window.console;
    export var setTimeout: typeof window.setTimeout = timers.setTimeout;
    export var clearTimeout: typeof window.clearTimeout = timers.clearTimeout;
    export var setInterval: typeof window.setInterval = timers.setInterval;
    export var clearInterval: typeof window.clearInterval = timers.clearInterval;
    export var setImmediate: typeof window.setImmediate = timers.setImmediate;
    export var clearImmediate: typeof window.clearImmediate = timers.clearImmediate;
}
