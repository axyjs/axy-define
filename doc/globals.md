# Global Variables

Inside a user module provides the following variables.

## Pseudo-global

* `exports`
* `require`
* `module`
* `__filename`
* `__dirname`

In fact, they are not global variables but arguments of the function-wrapper.
However, they are available inside each module.

These variables are analogues of [the corresponding variables of Node.js](https://nodejs.org/api/modules.html).
Their structure mirrors structure of Node.js variables.

In additional: `require.async()`.
See [asynchronous I/O](async.md).

## Global

* [global](global.md)
* [process](process.md)

In Node.js they are real global variables.
In this library they are same pseudo global, as above.

## Assembling

By default, the function is called with the following arguments: `exports`, `require`, `module`, `__filename`, `__dirname`, `global` and `process`.
This allows to emulate availability of the global variables.
This should be taken into account during [assembly](assembling.md).

This can be changed.
See [settings](settings.md), field `wrapperArgs`.

### Arguments Count

The `arguments` array in the Node.js has 5 elements, but 7 in the Axy.
It may rarely cause an error.
When assembling, you can change the wrapper as follows:

```javascript
axy.define("/my/module.js", function (exports, require, module, __filename, __dirname, global, process) {
    "use strict";
    (function (exports, require, module, __filename, __dirname) {
    
        // the module code
        console.log(arguments.length); // 5
        
    })(exports, require, module, __filename, __dirname);
});
```

#### Other Globals

All other variables quietly seeping from the global context browser.
`window`, `setTimeout` and etc.

Note that replacing `global.setTimeout` or `global.console` will not lead to replacing global `setTimeout` and `console`.
If necessary, they too can be closure via `settings.wrapperArgs`.
