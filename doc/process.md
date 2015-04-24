# Variable `process`

This is a "[global](globals.md)" variable.
It is analouge of the Node.js global variable [process](https://nodejs.org/api/process.html).

## Supported Methods and Properties

#### `argv: string[]`

The arguments of "the command line".

In Node.js run from the command line looks like this:

```
$ node index.js --option=value
```

`process.argv` is then equal to `["node", "index.js", "--option=value"]`.

In `axy-define`:

```javascript
axy.define.require("/index.js", false, ["--option=value"]);
```

`process.argv` is then equal to `["axy", "index.js", "--option=value"]`.

#### `env: object`

The dictionary of the "environment" variables.
The library does not define any variable.
It may make plug-ins.

#### `paths: string[]`

This variable is not in the Node.js `process`.

The list of paths to search modules.
If a module is not found in other locations.

#### `cwd(): string`

Returns the current working directory.

By default it is the main module directory.

#### `chdir(directory: string): void`

Changes the current working directory of the process.

#### `uptime(): number`

Returns how much time has passed since the system initialization (since the page loading).
In seconds.

#### `hrtime(time: number[]): number[]`

Returns current "the current high-resolution real time" in a `[seconds, nanoseconds]`.
Or diff with `time` if it specified.

Precision of time in browsers - millisecond.
Precision of the `nanoseconds` is 1,000,000.

#### `nextTick(callback: function): void`

Analogue of Node.js `process.nextTick()` but use `setTimeout(callback, 0)` for emulation (`setImmediate()` in IE).

#### `on(event: string, listener: function): process`

Sets a listener for a event.
At present time, defines a single event `exit`.
See [destroy](destroy.md).

A listener of the `exit` event taken the exit code as a single argument.

```javascript
process.on(function (code) {
    console.log("Bye-bye", code);
});

process.exit(10);
```

#### `exit([code: number]): void`

System sends a request to the destruction.

#### `stdout` and `stderr`

"Standard output streams".
Works via `console.log` and `console.error`.

The single method:

* `write(chunk: string [, options [, callback: string]): boolean`

Writes `chunk` to a stream.
`options` is ignored.

Output always ends a line break.

#### `title`, `platform`

For compatibility.
Both initially contain `axy`.
