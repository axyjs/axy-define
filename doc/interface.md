# The library interface 

The library defines only one global variable: `axy`.
It is just a vendor namespace.
The only field that the library defines is `axy.define`.

Internal code is not linked to global variables.
If you want, you can rename:

```javascript
var myDefine = axy.define;
axy = null;
```

##### `axy.define(filename: string, content: mixed): void`

It is a function.
It defines a module (or a plain "file").

`filename` - the module absolute file name, `content` - the file content.
See [the virtual file system](files.md) for details.

Defines a module, as string of the code:

```javascript
axy.define("/modules/plus.js", "module.exports = 2 + 2;");
```

Or as the wrapper

```javascript
axy.define("/modules/index.js", function (exports, require, module, __dirname, __filename, global, process) {
    var plus = require("./plus.js");

    exports.mul = function (i) {
        return plus * i;
    };
};
```

##### `.require(filename: string [, context: object]): mixed`

Returns a module value (`exports`).

```javascript
var controller = axy.define.require("/controllers/this-page.js");
controller.run();
```

`filename` - the module file name.

`context` has fields `reload`, `argv` and `dir`.

Throws an exception if the module is not found.

By default, if the module is not loaded, loads it as the main module and uses `context.argv` as "command line arguments".
If the module was loaded then returns it from the cache.

If specify the `context.reload` as `TRUE`, the module will be loaded regardless of the cache.

`context.dir` affect the current directory:

* `TRUE` (by default) - changes the current directory to the directory of the module file
* `FALSE` - does not change
* string - the directory itself

##### `.require.getModule(filename: string [, context: object]): Module`

Returns a module object.
See [Module](module.md) for details.

Throws an exception if the module is not found.

See `require()` above for details about `context`.

##### `.core: object`

`axy.define.code` is the service for access to [core modules](core.md).

##### `.settings: object`

`axy.define.settings` is the [settings](settings.md) dictionary.

##### `.global: object`

`axy.define.global` is the [global](global.md) object.

##### `.async: object`

Object with 2 methods:

* `set(async)`: sets [an asynchronous storage](async.md)
* `get(): async`: gets it

##### `.signal(event: string [, ...]): void`

`axy.define.signal()` sends a [signal](signals.md).

##### `.createSandbox([global: object]): function`

`axy.define.createSandbox()` creates a [sandbox](sandbox.md).

##### `.addPlugin(name: string, builder: function)`

`axy.define.addPlugin` defines a [plugin](plugins.md).
