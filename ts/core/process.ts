/**
 * The analogue of node-variable `process`
 *
 * Inside the module is available as `process`.
 * Outside as `axy.define.global.process`.
 */
/// <reference path="../engine.ts" />
/// <reference path="../context.ts" />
/// <reference path="path.ts" />
/// <reference path="streams.ts" />
/// <reference path="timers.ts" />
module core.process {
    "use strict";

    /**
     * The command line arguments
     * The second is the main module name.
     */
    export var argv: string[] = ["axy"];

    /**
     * The interface of an environment variables list
     */
    export interface IEnv {
        [index: string]: string
    }

    /**
     * Environment variables
     */
    export var env: IEnv = {};

    /**
     * The main module of this process
     */
    export var mainModule: engine.Module = null;

    /**
     * The global paths
     */
    export var paths: string[] = [];

    declare var globalObject: typeof window;
    var setImmediate: typeof window.setImmediate = globalObject.setImmediate;

    /**
     * Runs callback after the current event loop
     *
     * @param {function} callback
     */
    export function nextTick(callback: Function): void {
        if (setImmediate) {
            setImmediate(callback);
        } else {
            setTimeout(callback, 0);
        }
    }

    /**
     * Returns the current working directory
     *
     * @return {string}
     */
    export function cwd(): string {
        return context.directory;
    }

    /**
     * Changes the current working directory
     *
     * @param {string} directory
     */
    export function chdir(directory: string): void {
        context.directory = core.path.resolve(context.directory, directory);
    }

    var startTime: number = (new Date()).getTime();

    /**
     * Number of seconds Axy has been running
     *
     * @return {number}
     */
    export function uptime(): number {
        return ((new Date()).getTime() - startTime) / 1000;
    }

    /**
     * Returns "the current high-resolution real time" in a `[seconds, nanoseconds]`
     *
     * @param {number[]} prev
     *        the previous result for diff
     * @return {number[]}
     */
    export function hrtime(prev: number[] = null): number[] {
        var result: number[],
            t: number = (new Date()).getTime() - startTime,
            s: number = Math.round(t / 1000),
            m: number = (t % 1000) * 1000000;
        if (prev) {
            s -= prev[0];
            m -= prev[1];
            if (m < 0) {
                s -= 1;
                m += 1000000000;
            }
        }
        result = [s, m];
        return result;
    }

    /**
     * Sets an event listener
     *
     * @param {string} event
     * @param {function} listener
     * @return {object}
     */
    export function on(event: string, listener: signals.IListener): typeof core.process {
        context.signalInstance.on(event, listener);
        return core.process;
    }

    /**
     * Aborts the process
     *
     * @param {number} code [optional]
     */
    export function exit(code: number = 0): void {
        context.sandboxInstance.signal("exit", code);
    }

    /**
     * Stdout (used `console.log`)
     */
    export var stdout: core.streams.IStream = new core.streams.Stream("log");

    /**
     * Stderr (used `console.err`)
     */
    export var stderr: core.streams.IStream = new core.streams.Stream("error");

    /**
     * The process title
     */
    export var title: string = "axy";

    /**
     * The platform
     */
    export var platform: string = "axy";

    context.destructors.push(function processDestroy(): void {
        helpers.destroyContainer(core.process);
    });
}
