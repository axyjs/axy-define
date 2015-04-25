/**
 * Defines `globalObject` the analogue of the Node.js global object
 *
 * Inside the module is available as `global`.
 * Outside as `axy.define.global`.
 */
/// <reference path="../../typing/node.d.ts" />
/// <reference path="process.ts" />
module core.global {
    declare var externalGlobal: Window;

    export interface IGlobal extends NodeJS.Global {
        external: any;
        window: Window;
    }

    export var globalObject: IGlobal = <IGlobal>{};

    globalObject.global = globalObject;
    globalObject.root = globalObject;
    globalObject.GLOBAL = globalObject;
    globalObject.external = {};
    globalObject.window = externalGlobal;

    import timers = core.timers;
    var imports: any[] = [
        [
            externalGlobal,
            [
                "Array",
                "ArrayBuffer",
                "Boolean",
                "DataView",
                "Date",
                "Error",
                "EvalError",
                "Float32Array",
                "Float64Array",
                "Function",
                "Infinity",
                "Int16Array",
                "Int32Array",
                "Int8Array",
                "Intl",
                "JSON",
                "Map",
                "Math",
                "NaN",
                "Number",
                "Object",
                "Promise",
                "RangeError",
                "ReferenceError",
                "RegExp",
                "Set",
                "String",
                "Symbol",
                "SyntaxError",
                "TypeError",
                "URIError",
                "Uint16Array",
                "Uint32Array",
                "Uint8Array",
                "Uint8ClampedArray",
                "WeakMap",
                "WeakSet",
                "console",
                "decodeURI",
                "decodeURIComponent",
                "encodeURI",
                "encodeURIComponent",
                "escape",
                "eval",
                "isFinite",
                "isNaN",
                "parseFloat",
                "parseInt",
                "unescape"
            ],
        ],
        [
            timers,
            [
                "setTimeout",
                "clearTimeout",
                "setInterval",
                "clearInterval",
                "setImmediate",
                "clearImmediate"
            ]
        ],
        [
            {
                process: core.process,
                Buffer: function Buffer(): void {}
            },
            [
                "process",
                "Buffer"
            ]
        ]
    ];
    imports.forEach(function (item: any[]): void {
        var container: any = item[0];
        item[1].forEach(function (key: string): void {
            globalObject[key] = container[key];
        });
    });
}
