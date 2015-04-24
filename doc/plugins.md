# Plugins

Plugins extend the system.

For example, this library aims to emulate Node.js environment and its core modules.
But here is defined only necessary features.
Missing functionality can be implemented as plugins.

## Add Plugin

```javascript
axy.define.addPlugin(name: string, builder: function)
```

Adds a plugin to the system.

##### `name`

The plugin name.
Should reflect that expanding.

For, example: `core.util` - an implementation of the core module `util`.
Or `core.fs.priv` - an extension for the `fs` module which provides chmod* and chown* functions.

##### `builder`

Taken an object `context` as argument.
Performs the necessary steps to expand.

## `context`

This object contain internal information.
It is passed to the `builder`

##### `sandboxInstance`

A link to the current sandbox (`axy.define`, for example).

##### `signalsInstance.fire(event: string, args: any[])`

Generates an event that can be caught using `process.on()`.

##### `fsData`

The file system data.
The dictionary:

* `files`: the file name => the file data.
* `dirs`: the directory name => is exists (boolean).
* `async`: the [async](async.md) storage.

## Example

Creates new core module:

```javascript
axy.define("core.my", function (context) {
    context.sandboxInstance.core.addModule("my", {
        plus: function (a, b) {
            return a + b;
        };
    });
});
```

Extends `fs` module (`unlinkSync()` function):

```javascript
axy.define("core.fs.unlink", function (context) {
    var fs = context.sandboxInstance.core.require("fs"),
        fsData = context.fsData;
    fs.unlinkSync = function unlinkSync(filename) {
        fsData.files[filename] = void 0;
    };
});
```

## Inheritance

A child sandbox inherits all plugins from the parent.

```javascript
var sandbox1 = axy.define.createSandbox();

sandbox1.addPlugin("core.my", function () { /* ... */ });

sandbox2 = sandbox1.createSandbox();

axy.define.core.require("my"); // undefined
sandbox1.core.require("my"); // ok
sandbox2.core.require("my"); // ok
```
