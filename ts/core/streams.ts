/**
 * Simple streams for `process.stdout` and `process.stderr`
 */
module core.streams {
    "use strict";

    /**
     * The interface of the `stream.write()` method
     */
    export interface IStreamWrite {
        (chunk: string, encoding?: string, callback?: Function): boolean;
    }

    /**
     * The interface of streams
     */
    export interface IStream {
        write: IStreamWrite;
    }

    /**
     * The stream class
     */
    export class Stream implements IStream {
        /**
         * The constructor
         *
         * @param {string} cMethod
         *        a `console` method name
         */
        constructor(cMethod: string) {
            if (typeof console !== "undefiend") {
                this.log = console[cMethod];
            }
        }

        /**
         * {@inheritDoc}
         */
        write (chunk: string, encoding: string = null, callback: Function = null): boolean {
            if (this.log) {
                chunk = chunk.replace(/\n$/, "");
                this.log.call(null, chunk);
            }
            if (callback) {
                core.process.nextTick(callback);
            }
            return true;
        }

        private log: (message: string) => void;
    }
}
