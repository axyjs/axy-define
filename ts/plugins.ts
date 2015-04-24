/**
 * The plugin system
 */
/// <reference path="context.ts" />
/// <reference path="helpers.ts" />
/// <reference path="sandbox.ts" />
module plugins {
    "use strict";

    /**
     * Plugin builder
     */
    export interface IPluginBuilder {
        (context: typeof context): any
    }

    interface IPluginItem {
        name: string;
        builder: IPluginBuilder;
    }

    /**
     * The plugins container
     */
    export class Plugins {
        /**
         * The constructor
         *
         * @param {object} context
         *        the system context
         */
        constructor(private context: typeof context) {
        }

        /**
         * Appends a plugin to the system
         *
         * @param {string} name
         * @param {function} builder
         * @return {*}
         *         returns the builder return
         */
        append(name: string, builder: IPluginBuilder): any {
            this.plugins.push({
                name: name,
                builder: builder
            });
            builder(this.context);
        }

        /**
         * Applies the plugins list to a child sandbox
         *
         * @param {object} sandbox
         */
        applyToSandbox(sandbox: sandbox.ISandbox): void {
            this.plugins.forEach(function (item: IPluginItem): void {
                sandbox.addPlugin(item.name, item.builder);
            });
        }

        /**
         * Destroys the plugin container
         */
        destroy(): void {
            helpers.destroyContainer(this);
        }

        private plugins: IPluginItem[] = [];
    }
}
