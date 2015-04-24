/**
 * Timers (analogue of Node.js core module `path`)
 */
module core.timers {
    "use strict";

    declare var globalObject: typeof window;

    var nativeSetTimeout: typeof window.setTimeout = globalObject.setTimeout;
    var nativeClearTimeout: typeof window.clearTimeout = globalObject.clearTimeout;
    var nativeSetInterval: typeof window.setInterval = globalObject.setInterval;
    var nativeClearInterval: typeof window.clearInterval = globalObject.clearInterval;
    var nativeSetImmediate: typeof window.setImmediate = globalObject.setImmediate;
    var nativeClearImmediate: typeof window.clearImmediate = globalObject.clearImmediate;

    if (!nativeSetImmediate) {
        nativeSetImmediate = function setImmediate(callback: Function): number {
            return nativeSetTimeout(callback, 0);
        };
    }
    if (!nativeClearImmediate) {
        nativeClearImmediate = function clearImmediate(immediate: number): void {
            nativeClearTimeout(immediate);
        };
    }

    /**
     * Instances of this class returned from setTimeout and setInterval
     * @abstract
     */
    export class Timeout {
        /**
         * The constructor
         *
         * @param {function} callback
         * @param {number} delay
         * @param {Array} args
         */
        constructor(callback: Function, delay: number, args: any[]) {
            var onTimeout: Function;
            this._idleTimeout = delay;
            if (args.length > 0) {
                onTimeout = function (): void {
                    callback.apply(null, args);
                };
            } else {
                onTimeout = callback;
            }
            this._onTimeout = onTimeout;
        }

        /**
         * Stub function
         */
        public unref(): void {
        }

        /**
         * Stub function
         */
        public ref(): void {
        }

        /**
         * Runs the timer
         */
        public start(): void {
            if (!this.handle) {
                this.handle = this.set();
            }
        }

        /**
         * Stops the timer
         */
        public stop(): void {
            if (this.handle) {
                this.clear();
                this.handle = null;
            }
        }

        protected set(): number {
            return null;
        }

        protected clear(): void {
        }

        protected handle: number;
        protected _idleTimeout: number;
        protected _onTimeout: Function;
    }

    export class TimeoutOnce extends Timeout {
        protected set(): number {
            return nativeSetTimeout(this._onTimeout, this._idleTimeout);
        }

        protected clear(): void {
            nativeClearTimeout(this.handle);
        }
    }

    export class TimeoutInterval extends Timeout {
        protected set(): number {
            return nativeSetInterval(this._onTimeout, this._idleTimeout);
        }

        protected clear(): void {
            nativeClearInterval(this.handle);
        }
    }

    export class Immediate {
        constructor(callback: Function, args: any[]) {
            var onTimeout: Function;
            if (args.length > 0) {
                onTimeout = function (): void {
                    callback.apply(null, args);
                };
            } else {
                onTimeout = callback;
            }
            this._onTimeout = onTimeout;
            this.handle = nativeSetImmediate(onTimeout);
        }

        public handle: number;
        private _onTimeout: Function;
    }

    export function setTimeout(callback: Function, delay: number, ...args: any[]): Timeout {
        var timeout: Timeout = new TimeoutOnce(callback, delay, args);
        timeout.start();
        return timeout;
    }

    export function clearTimeout(timeout: Timeout|number): void {
        if (<Object>timeout instanceof Timeout) {
            (<Timeout>timeout).stop();
        } else {
            nativeClearTimeout(<number>timeout);
        }
    }

    export function setInterval(callback: Function, delay: number, ...args: any[]): Timeout {
        var timeout: Timeout = new TimeoutInterval(callback, delay, args);
        timeout.start();
        return timeout;
    }

    export function clearInterval(timeout: Timeout|number): void {
        if (<Object>timeout instanceof Timeout) {
            (<Timeout>timeout).stop();
        } else {
            nativeClearInterval(<number>timeout);
        }
    }

    export function setImmediate(callback: Function, ...args: any[]): Immediate {
        return new Immediate(callback, args);
    }

    export function clearImmediate(immediate: Immediate|number): void {
        if (<Object>immediate instanceof Immediate) {
            immediate = (<Immediate>immediate).handle;
        }
        nativeClearImmediate(<number>immediate);
    }
}
