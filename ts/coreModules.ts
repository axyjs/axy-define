/**
 * Loading "core" modules.
 *
 * The `axy.define.core` is an instance of the class `core.Core`.
 * That instance contains modules `fs`, `paths` and `module`.
 */
/// <reference path="types.ts" />
/// <reference path="context.ts" />
module coreModules {
    "use strict";

    /**
     * The interface of a loader of custom "native" modules
     */
    export interface ILoader {
        /**
         * Returns a module value
         *
         * @param id the module ID
         * @returns the module or NULL if the module is not exists
         */
        require: (id: IModuleId) => IModuleValue;

        /**
         * Checks if a module is exists
         *
         * @param id
         * @returns
         */
        exists: (id: IModuleId) => boolean;
    }

    /**
     * The interface of a module builder
     */
    export interface IModuleBuilder {
        /**
         * @param {string} id
         *        the module name
         * @returns {*}
         *          the module value
         */
        (id: IModuleId): IModuleValue;
    }

    /**
     * The interface of a list of native modules (already built)
     */
    interface IListModules {
        /**
         * the module name => the module value
         */
        [index: string]: IModuleValue;
    }

    /**
     * The interface of a list of builders
     */
    interface IListBuilders {
        /**
         * the module name => the builder function (NULL of used and removed)
         */
        [index: string]: IModuleBuilder
    }

    /**
     * @class The storage of core modules
     */
    export class Core implements ILoader {

        /**
         * Returns a native module value
         *
         * @param {string} id
         * @returns {*}
         * @throws {Error} cannot find module
         */
        public require(id: IModuleId): IModuleValue {
            var mo: IModuleId,
                builder: IModuleBuilder;
            mo = this.modules[id];
            if (mo !== void 0) {
                return mo;
            }
            builder = this.builders[id];
            this.builders[id] = null;
            if (typeof builder !== "function") {
                throw new Error("Cannot find module '" + id + "'");
            }
            mo = builder(id);
            this.modules[id] = mo;
            return mo;
        }

        /**
         * Checks if a native module is exists
         *
         * @param {string} id
         * @returns {boolean}
         */
        public exists(id: string): boolean {
            if (this.modules[id] !== void 0) {
                return true;
            }
            if (this.builders[id]) {
                return true;
            }
            return false;
        }

        /**
         * Adds a native module
         *
         * @param {string} id
         * @param {*} value
         */
        public addModule(id: IModuleId, value: IModuleValue): void {
            this.modules[id] = value;
        }

        /**
         * Adds a module builder
         *
         * @param {string} id
         * @param {function} builder
         */
        public addModuleBuilder (id: IModuleId, builder: IModuleBuilder): void {
            if (this.modules[id] !== void 0) {
                this.modules[id] = void 0;
            }
            this.builders[id] = builder;
        }

        /**
         * Removes a module (does not affect loaders)
         *
         * @param {string} id
         * @returns {boolean}
         *          the module existed and has been deleted
         */
        public removeModule (id: IModuleId): boolean {
            var result: boolean = false;
            if (this.builders[id]) {
                this.builders[id] = null;
                result = true;
            }
            if (this.modules[id] !== void 0) {
                this.modules[id] = void 0;
                result = true;
            }
            return result;
        }

        private modules: IListModules = {};

        private builders: IListBuilders = {};
    }
}
