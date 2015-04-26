/**
 * System signals
 * @see `axy.define.signal` and `process.on`
 */
/// <reference path="context.ts" />
module signals {
    "use strict";

    /**
     * The event listener interface
     */
    export interface IListener {
        (...args: any[]): void;
    }

    /**
     * Listeners of events
     */
    interface IEventsListeners {
        /**
         * The event name => the list of listeners
         */
        [index: string]: IListener[];
    }

    /**
     * Events emitter
     */
    export class Emitter {
        /**
         * Sets an event listener
         *
         * @param {string} event
         * @param {function} listener
         */
        public on(event: string, listener: IListener): void {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(listener);
        }

        /**
         * Fires event
         *
         * @param {string} event
         * @param {any[]} args
         */
        public emit(event: string, args: any[] = []): void {
            var list: IListener[] = this.listeners[event],
                listener: IListener,
                len: number,
                i: number;
            if (list) {
                for (i = 0, len = list.length; i < len; i += 1) {
                    listener = list[i];
                    if (typeof listener === "function") {
                        listener.apply(null, args);
                    }
                }
            }
        }

        /**
         * Destroys the emitter
         */
        public destroy(): void {
            this.listeners = null;
        }

        private listeners: IEventsListeners = {};
    }
}
