# Using with Node.js

The library is intended for browsers.
Using it with Node.js makes little sense.
Is it only for tests.

`axy-node.js` allows to include `axy` as a Node.js module.

```javascript
var axy = require("axy-node.js");

axy.define("...", "...");
```

`sandbox.js` builds a sandbox.
For example:

```
$ cd /one/two
$ /path/to/sandbox.js -txt,html index.js --option=value
```

Sandbox recursive walks all directories inside the current (`/one/two`) and includes all files with extensions
`js`, `json`, `txt` and `html`.

Then runs `/one/two/index.js` as the main module.
`process.argv` sets to `["axy", "index.js", "--option=value"]`.

By default includes extensions `js` and `json`.
If required other specify their with commas in an option after `sandbox.js` (`-txt,html` in the example).
