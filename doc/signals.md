# Signals

The function `axy.define.signal(event: string, ...args)` sends a signal to the system.

Modules can intercept signals using the method [process.on()](process.md).

The system handles only one signal: `exit`.
This signal causes the destruction of the system.

The library does not generate signals.
It can do a superior system.
For example, generate signals about loading and closing page.

```javascript
window.onload = function () {
    axy.define.signal("load");
};

window.onunload = function () {
    axy.define.signal("exit");
};
````

Handling in a module:

```javascript
var $ = require("jQuery"),
    el;

function click() {
    el.css("color", "red");
}

process.on("load", function () {
    el = $("#element");
    el.on("click", click);
}).on("exit", function () { // garbage collection
    el.unbind("click", click);
    el = null;
});
```
