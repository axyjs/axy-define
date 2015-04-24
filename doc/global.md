# `global`

The analogue of `global` in Node.js.
This is not `window`!

Contained in `axy.define.global`.

Available within a user module as `global`.
See [global variables](globals.md) for details.

There are following fields (analogue of Node.js):

* [global](global.md): circular reference
* [process](process.md)
* `console`
* `setTimeout`
* `clearTimeout`
* `setInterval`
* `clearInterval`

The fields `console`-`clearInterval` entered for compatibility.
Timers are taken from the module [timer](timer.md).
Replacing `global`.`console` will not replace the global `console`.
Although this can be achieved via [settings.wrapperArgs](settings.md).

* `window`

The link to the global object that was passed to the library.
In browsers it typically is `window`.

* `external`

Used to transfer data from the server.

For example, google map is displayed with a marker on a specific address.
Module responsible for working with the map, must know the current address.
The server generates the `external` object with the required data.

```html
<script src="axy-define.js"></script>
<script>
// Configuring the system
// ...
axy.define.global.external = {
    address: "Unknown city, Not-street street, 25"
};
</script>
<script src="assembling-modules.js"></script>
```

The module retrieves the data and processes it:

```javascript
var address = global.external.address;
// ...
```

## Global variables

```javascript
x = 10;
console.log(global.x); // undefined
```

It's clear that such global variables (without `var`) will not be properties of the pseudo-global `global`.
However, global variables is evil.

