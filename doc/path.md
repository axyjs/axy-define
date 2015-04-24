# Module `path`

The [core](core.md) module `path` is an analogue of Node.js core module [path](https://nodejs.org/api/path.html).

Get the path-module inside a user module:

```javascript
var path = require("path");
```

And from the outside:

```javascript
var path = axy.define.core.require("path");
```
The following methods are supported:

* `normalize(p: string): string`
* `resolve(...p: string): string`
* `isAbsolute(p: string): boolean`
* `dirname(p: string): string`
* `basename(p: string): string`
* `extname(p: string): string`

Behavior is consistent with POSIX file system.
