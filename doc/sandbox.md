# Sandbox

The method `axy.defines.createSandbox([global])` creates a complete clean copy of the system (similar `axy.define`).
It will have own set of modules, its own file system, etc.
Plugins are inherited from the parent sandbox.

```javascript
var sandbox1 = axy.define.createSandbox(),
    sandbox2 = sandbox1.createSandbox();

sandbox2("/data.json", [1, 2, 3]); // Defines a file in the current sandbox
```

## `global`

The single optional argument is `window` by default.
It used for [build pseudo-global object](global.md).
