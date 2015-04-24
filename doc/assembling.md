# Assembling

A module for the library must be defined as follow:

```javascript
axy.define("/module/name", function (exports, require, module, __filename, __dirname, global, process) {
    "use strict";
    exports.sum = function (a, b) {
        return a + b;
    };

    exports.mul = function (a, b) {
        return a * b;
    };
});
```

Or it could be a string of code.
For JSON it may be an object, a string or a function.
See [the virtual file system](files.md) for details about the module content.

The main thing is that the module must be specified using `axy.define()`.
You can write, as shown above, and everything will work immediately.
And you can write as following:

```javascript
"use strict";

exports.sum = function (a, b) {
    return a + b;
};

exports.mul = function (a, b) {
    return a * b;
};
```

It simpler and module can be works in the Node.js.
But to work in your browser, it must be processed.

The library does not provide features for assembling.
Can use the utility [axy-define-asm](https://github.com/axyjs/axy-define-asm).
Or you can do it yourself.

## Wrapper

The standard wrapper for JS modules in Node.js takes follows arguments:

* `exports`
* `require`
* `module`
* `__filename`
* `__dirname`

The library appends `global` and `process` when called.
See [global variables](globals.md).

## Required files

The easiest variant is to include all sources for each path.
Or only those that are necessary and their dependence.

To do this can parse files, extract `require()` calls, resolve paths and build a list of dependencies.
But it is not the task of this library.
