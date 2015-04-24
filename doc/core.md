# Core Modules

These is analogues of node.js core modules.
These modules are available everywhere by their names (`require("fs")` for example).

The library defines some native modules ([fs](fs.md), [path](path.md), etc.)
and provides features to declare other native modules.

## `axy.define.core`

This object contains follows methods.

#### `require(name: string): mixed`

Returns a native module.

```javascript
axy.define.native.require("fs").writeFileSync("/file.txt", "Text");
```

Throws an exception if the module does not exist.

#### `exists(name: string): boolean`

Checks if a core module exists.

#### `addModule(name: string, value: mixed): void`

Defines a new core module (or replaces existing).

```javascript
axy.define.core.addModule("mymo", {
    plus: function (a, b) {
        return a + b;
    }
});

// Inside any module
require("mymo").plus(2, 2); // 4
```

#### `addModuleBuilder(name: string, builder: function): void`

Defines a new core module with lazy loading.
The builder will be called at the first call.
Further, the module will be taken from the cache.

```javascript
axy.defined.core.addModuleBuilder("lazy", function () {
    return {
        plus: function (a, b) {
            return a + b;
        }
    };
});
```

#### `removeModule(name: string): boolean`

Removes a module.

## Value of Core Modules

Any values are acceptable, except `undefined`.
