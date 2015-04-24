# Asynchronous I/O

Definition of asynchronous loader allows to dynamically load data and code (modules).

To work with asynchronous data available:

* Asynchronous functions of the module [fs](fs.md).
* Function `require.async()`.

## `require.async(id: string [, callback])`

Asynchronous `require()`.

```javascript
require.async("./../module.js", function (err, exports) {
    if (err) {
        throw new err;
    }
    exports.methodFromAsyncModule();
});
```

If the callback `err` is an exception instance (or `NULL` for success).
`exports` is value of the loaded module (such as returns `require()`).

#### Implementation

The algorithm of `require()` is rather complicated.
A lot of checks on the existence of files.
Too expensive to do it asynchronously.

There are two ways:

* AsyncStorage incurs path resolving (see `moduleResolve`).
* Or library uses a simplified variant.

In the second case, the module path must accurately point to a file.
`/absolute/path/to/module.js` or `./../relative/path.js`.
No search in `node_modules`, no check extensions, no `package.json`.

## `AsyncStorage` interface

AsyncStorage must implements the follow methods.

#### `read(filename: string, callback: function): object`

Loads an asynchronous file (`filename` is absolute file name).
The result of this action is a dictionary with follow fields:

* `realpath (string)` - if file is not exist then `NULL`. In other cases, typically is `filename`.
* `isFile (boolean)` - the regular file flag (`FALSE` for directories).
* `content (mixed)` - the file content.
* `cacheable (boolean)` - the content can be cached.

If `cacheable` is `TRUE` the file content will be cached in the synchronous storage 
and will be available for synchronous methods (such as `readFileSync()`).
Will be saved under the name from `realpath`.

If the storage has the file information at the time of the request then it can return the result immediately.
`callback` should not be called.
 
If the file information does not yet have, then return `NULL`, load file and call `callback(result)`.

#### `stat(filename: string, callback: function): object`

This method is analogous to `read()`.
The only exception is not necessary to set `content`.

If `content` is known, it can be set.
If not, it is not necessary to load.

#### `moduleResolve(request: string, parent: Module, callback: function): object`

This function is optional.
See "implementation" above.

For example, in module `/one/two.js`:

```javascript
require.async("../three.js", function () {/* ... */});
```

`request` is `../three.js` and `parent` is the [module object](module.md) of `/one/two.js`.

The functions returns the structure as `read` and `stat` functions.


## Definition `AsyncStorage`

* Write loader code.
* Set loader.

```javascript
var loader = {
    read: function (filename, callback) {
        // ...
    },
    stat: function (filename, callback) {
        // ...
    }
};

axy.define.async.set(async);
```
