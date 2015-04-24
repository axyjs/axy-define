# fs

This [core module](core.md) is an analog of Node.js module [fs](https://nodejs.org/api/fs.html).
Is designed to work with [the virtual file system](files.md).

Get the fs-module inside a user module:

```javascript
var fs = require("fs");
```

And from the outside:

```javascript
var fs = axy.define.core.require("fs");
```

## Organization

The virtual FS has two storage: synchronous and asynchronous.

Synchronous contains data that have been declared at page loading stage.
Using `axy.define()` for example.
Access to them is instantaneous.

Asynchronous is responsible for the dynamic load data and code.
Typically, the data loaded from the server via AJAX.
The library itself will not take requests to the server.
But it allows you to implement an interface for this.
See [async](async.md) for details.

### Synchronous functions

These functions works with synchronous storage only.
The result is available immediately.

Requests to the asynchronous storage are not made.
But the data obtained with asynchronous functions can be cached in a synchronous storage.
And will be available for synchronous requests.

These functions have the same signature and semantics as Node.js functions.
But have nuances.

##### `readFileSync(filename: string [, options]): mixed`

* Returns the content of a file.
* The content can be any value (string, function-wrapper, JSON object and etc).
* Options are ignored.
* If the file is not found (or it is a directory) an exception will be thrown.

##### `writeFileSync(filename: string, data: mixed [, options]): void`

* Saves `data` to the file.
* An analogue of `axy.define(filename, data)` (this for inside, that for outside).
* The data can be any value.
* Options are ignored.
* Errors (premission, no directory, etc) can not be.
* All parent directories will be "created".

```javascript
fs.exists("/one"); // FALSE
fs.exists("/one/two"); // FALSE

fs.writeFileSync("/one/two/three.txt", "Text");
fs.exists("/one"); // TRUE
fs.exists("/one/two"); // TRUE
```

##### `statSync(path: string): Stat`

* Returns a Stat object of a file.
* If the file is not found an exception will be thrown.
* Stat object has only two methods:
  * `isFile(): boolean`
  * `isDirectory(): boolean`

##### `existsSync(path: string): boolean`

Returns `TRUE` if a regular file or a directory exists.

##### `realpathSync(path: string [, cache: object]): string`

* Returns the real path of a file.
* The real path always equals the absolute path of file (no symlinks and etc).
* The result can be changed via the `cache` dictionary (absolute path => real path).

### Asynchronous functions

Format of the storage implementation described [there](async.md).

All these functions is asynchronous:

* They do not return the data immediately, but using callbacks.
* They work with the asynchronous storage.

Primarily files sought in the synchronous storage.
If there is no and the asynchronous is defined, searched in it.

Even if the data is found in the synchronous storage the callback will be called in the next event loop (or through a few).

##### `exists(path: string [, callback: function]): void`

The argument of the callback:

* `exists (boolean)` - flag that the file exists.

##### `stat(path: string, callback: function): void`

The arguments of the callback:

* `err (Error)` - an error instance or `NULL` for success.
* `stat (Stat)` - a Stat object.

##### `readFile(path: string [, options], callback: function): void`

Two format of call:

* `readFile(path, options, callback)` - options will be ignored.
* `readFile(path, callback)`

The arguments of the callback:

* `err (Error)` - an error instance or `NULL` for success.
* `content (mixed)` - the file content.

