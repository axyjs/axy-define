/**
 * Some helpers
 */
module helpers {
    "use strict";

    /**
     * Custom implementation of `Object.keys()`
     *
     * @param {*} object
     * @return {string[]}
     */
    export function customKeys(object: Object): string[] {
        var keys: string[] = [],
            k: string;
        for (k in object) {
            if (object.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    /**
     * Returns a keys list of an object
     *
     * @param {*} object
     * @return {string[]}
     */
    export var keys: (object: Object) => string[] = Object.keys;

    if (typeof keys !== "function") {
        keys = customKeys;
    }

    /**
     * Destroys a container and disconnects the children
     *
     * @param container
     */
    export function destroyContainer(container: Object): void {
        var k: string;
        for (k in container) {
            if (container.hasOwnProperty(k)) {
                container[k] = void 0;
            }
        }
    }
}
