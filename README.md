# axy.define()

An implementation of CommonJS modules system for browsers.

**This is alpha-version**

* GitHub: [axyjs/axy-define](https://github.com/axyjs/axy-define)
* NPM: [axy-define](https://www.npmjs.com/package/axy-define)
* Author: [Oleg Grigoriev](https://github.com/vasa-c)
* LICENSE: [MIT](LICENSE)

The library provides an environment for CommonJS modules.
Tries to achieve compatibility with the basic mechanisms of Node.js.

The library is not engaged in assembling the project.
See, for example, [axy-define-asm](https://github.com/axyjs/axy-define-asm).

#### Requirements

The library does not require any dependencies.

#### Compatibility

IE 9+ and normal browsers.
IE 8 with [es5-shim](https://github.com/es-shims/es5-shim).
IE 7 with [json-js](https://github.com/douglascrockford/JSON-js).

Developed on Node.js 0.12.

### Installation

1) Include a single file on the page.
[axy-define.js](https://raw.githubusercontent.com/axyjs/axy-define/master/axy-define.js)
or [compressed version](https://github.com/axyjs/axy-define/releases).

```javascript
<script src="axy-define.min.js"></script>
```

2) PROFIT.

### Synchronous / Asynchronous

The browser it is not server.
Unlike node.js it can not just take a file from the local file system.

By default, it works as follows.
All required modules and data statically included on the page load stage.
The library creates [the virtual file system](doc/files.md) and modules work with it as with a local FS.

If you need the dynamic loading of modules, you can define [the asynchronous loader](doc/async.md).

### Contents

* [Introduction](doc/intro.md)
* [Sample](doc/sample.md)
* [Virtual File System](doc/files.md)
* [Interface](doc/interface.md)
* [Assembling](doc/assembling.md)
* [Resolving module path](doc/resolving.md)
* [Core modules](doc/core.md)
    * [fs](doc/fs.md)
    * [path](doc/path.md)
    * [timers](doc/timers.md)
    * [module](doc/module.md)
* [Global variables](doc/globals.md)
    * [global](doc/global.md)
    * [process](doc/process.md)
* [Asynchronous I/O](doc/async.md)
* [Signals](doc/signals.md)
* [Settings](doc/settings.md)
* [Plugins](doc/plugins.md)
* [Sandbox](doc/sandbox.md)
* [Using in Node.js](doc/node.md)

In addition:

* [Examples](https://github.com/axyjs/axy-define-examples)
* [Unit tests](https://io.github.com/axyjs/axy-define/test/browser/index.html)

