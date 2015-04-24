# Settings

The `axy.define.settings` contains a dictionary of the library global settings.

#### `packageMain: string[]`

The list of fields in `packageMain` where the name of the package main file is searched.

By default: `["main"]`.

You can specify a different sequence.
For example, `["browser", "main"]`.
This can allow to have different versions of the package for the server and the browser.

```json
{
    "name": "my-package",
    "main": "index.js",
    "browser": "browser.js"
}
```

Node.js will take `index.js`, Axy will take `browser.js`.
If the `browser` field is not defined, checking the next - `main`.

#### `dirMain: string[]`

An analogue of the `packageMain` for searching of main file of a directory.
Contains the base file names.

By default it is `["index"]`.
Files are searched in the order: `index.js`, `index.json` and other defined extensions.

If replace it on `["browser", "index"]` will be searched first `browser.*` files.

#### `wrapperArgs: any[]`

The additional list of the wrapper arguments.

These arguments will be added to the standard wrapper arguments (`exports`, `require`, `module`, `__filename` and `__dirname`).

By default it is `global` and `process`.
See [global variables](globals.md) for detail.
