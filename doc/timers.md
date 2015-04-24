# timers

This [core module](core.md) is an analog of Node.js module [timers](https://nodejs.org/api/timers.html).

Get the timers-module inside a user module:

```javascript
var timers = require("timers");
```

And from the outside:

```javascript
var timers = axy.define.core.require("timers");
```

In the Node.js these functions are available as global.
In the Axy are not.

```javascript
global.setTimeout === require("timers").setTimeout; // true

setTimeout === require("timers").setTimeout; // false. setTimeout is window.setTimeout in browser
```

### `setTimeout(callback: Function, delay: Number [, ...args])`

To schedule execution of a one-time callback after delay milliseconds.
Unlike the browser `setTimeout` returns a timeout object, not number.
The timeout object has follows methods.

#### `unref()`, `ref()`

The stub functions for compatible with Node.js.

#### `start()`, `stop()`

Runs and stops the timer.
Defines in Axy only.

### `clearTimeout(timeout: mixed)`

Clears a timeout.
Takes an argument:

* a timeout object (received from `timers.setTimeout`)
* a number (received from native `setTimeout`)

### `setInterval()` and `clearInterval()`

Nuances of behavior similar to `setTimeout`/`clearTimeout`

### `setImmediate(callback: Function [...args])`, `clearImmediate()`

Executes the function as quickly as possible.

Uses `setImmediate()` in IE and `setTimeout(0)` in other browsers.
