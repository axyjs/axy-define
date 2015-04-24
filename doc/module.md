# module

The [core](core.md) module `module` is an analogue of Node.js core module `module`.

Access to this inside a user module: `require("module")`, but usually it is not used in the user code.

The module implements a modular system and [resolves](resolving.md) paths to modules.

## `module`

The pseudo global variable that available in the code of a custom module.
The object of this module.

* `id` - ID, "." for the main module and `filename` for others.
* `filename` - the absoulte path to the module file.
* `exports` - the module value.
* `parent` - the parent module object (module from which first required the current)
* `loaded` - the module loading is complete.
* `children` - a list of modules for which the current is parent
* `paths` - a list of directories where looking for children.
* `require()` - requires a module relative to the current module

## `module.constructor`

The "class" of all module objects.

#### `_extensions`

Loaders for extensions.
For example, add load for `txt` files:

```javascript
module.constructor._extensions[".txt"] = function (module, filename) {
    module.exports = require("fs").readFileSync(filename, "utf-8");
};
```

#### `_cache`

The cache of loaded modules.
The absolute path => the module object.
If remove a module from here then it will be reload.

```javascript
var m1 = require("/module.js");

var m2 = require("/module.js"); // from cache

delete module.constructor._cache["/module.js"];

var m3 = require("/module.js"); // reload
```

## `require`

Requires a module according to the [algorithm](resolving.md).
Moreover, contains fields:

* `main` - a link to the main module object
* `extensions` - a link to the `_extensions` (see above)
* `cache` - a link to the `_cache` (see above)
* `resolve(request)` - resolves a relative request to the absolute file path 
* `async()` - [asynchronous](async.md) require
