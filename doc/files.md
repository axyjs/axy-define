# Virtual File System

The library works with the virtual file system.
Modules and other data are located in virtual "files".
The function `require()` takes a module from this FS.

## Type of VFS

The FS similar to POSIX.

* There is the single root: `/`.
* Directories are separated by `/`.
* `.` is a link to the current directory
* `..` to the parent.

## Corresponds to the Real File System

The most obvious variant:

* There is site `http://example.com/`.
* JavaScript modules located in the directory `/js/`.
* The corresponding folder on the server: `/var/www/example.com/js`.
* Take this directory as the root of VFS.
* When assembling, we collect all js-files from this directory.
* Virtual file `/ns/lib.js` corresponds to the real file `/var/www/example.com/js/ns/lib.js` and the http-document `http://example.com/js/ns/lib.js`.
* The code of modules cannot rise above the VFS root.

However, this is only an example.
Virtual FS may not correspond to the real.

## Synchronous and Asynchronous Access

Originally defined only synchronous access.
All files defined at stage of the page loading.

It is possible to define asynchronous loader for dynamic-loading of code and data.
See [Asynchronous I/O](async.md).

## Files Content

"Files" in this file system can contain not only text.
The contents of file can be any value, except `undefined`.

```javascript
fs.writeFileSync("./file.array", [1, 2, 3]);

console.log(fs.readFileSync("./file.array")); // [1, 2, 3]
```

### JavaScript Modules

The file of a JavaScript module can contains value of following types: `string` and `function`.

`string` is processed as a normal JS-file in Node.js: wrapped to the wrapper, compiled and executed.
 
```javascript
axy.define("/module.js", "module.exports = 2 + 2;");
```

`function` is a code that has already wrapped:

```javascript
axy.define("/module.js", function (exports, require, module, __filename, __dirname, global, process) {
    module.exports = 2 + 2;
});
```

### JSON Modules

The JSON files can contains `string`, `function` or JSON value itself.

```javascript
axy.define("/data.json", [1, 2]); // [1, 2] is value of module data.json
```

```javascript
axy.define("/data.json", "{x:1}"); // String will be parsed
```

```javascript
axy.define("/data.json", function () { // Function will be executes
    return {
        "x": 1,
        "y": 2 + 2
    };
});
```

Note: if value of JSON file is string better to wrap it in a function.
