# `global`

The analogue of `global` in Node.js.
This is not `window`!

Contained in `axy.define.global`.

Available within a user module as `global`.
See [global variables](globals.md) for details.

## Browser properties

These properties copying from `window`.
Regardless of whether they are implemented in a current browser.

```
Array, ArrayBuffer, Boolean, DataView, Date, Error, EvalError, Float32Array,
Float64Array, Function, Infinity, Int16Array, Int32Array, Int8Array, Intl,
JSON, Map, Math, NaN, Number, Object, Promise, RangeError, ReferenceError,
RegExp, Set, String, Symbol, SyntaxError, TypeError, URIError, Uint16Array,
Uint32Array, Uint8Array, Uint8ClampedArray, WeakMap, WeakSet, console,
decodeURI, decodeURIComponent, encodeURI, encodeURIComponent, escape, eval,
isFinite, isNaN, parseFloat, parseInt, unescape
```

## Timers

These methods copying from module [timers](timers.md).

```
setTimeout, clearTimeout,
setInterval, clearInterval
setImmediate, clearImmediate
```

## Node.js specific properties

* [global](global.md), [GLOBAL](global.md), [root](root.md): circular reference
* [process](process.md)
* `Buffer` - not implemented (stub function)

## Axy specific properties

* `window` - the link to the [external global object](sandbox.md). Usually it is `window`.
* `external` - used to transfer data from the server.

For example, google map is displayed with a marker on a specific address.
Module responsible for working with the map, must know the current address.
The server generates the `external` object with the required data.

```html
<script src="axy-define.js"></script>
<script>
// Configuring the system
// ...
axy.define.global.external = {
    address: "Unknown city, Not-street street, 25"
};
</script>
<script src="assembling-modules.js"></script>
```

The module retrieves the data and processes it:

```javascript
var address = global.external.address;
// ...
```

## Global variables

```javascript
x = 10;
console.log(global.x); // undefined
```

It's clear that such global variables (without `var`) will not be properties of the pseudo-global `global`.
However, global variables is evil.

## Replacement

Global functions will be taken from `window`.

```javascript
setTimeout === global.setTimeout; // False
```

But specific variables can be made [pseudo-globals](globals.md).
