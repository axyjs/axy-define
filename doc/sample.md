# Sample

This is a simple example showing the basic structure of an application that uses `axy.define`.

## 0. Write code

Write our modules (normal CommonJS).

math/arithmetic.js:

```javascript
exports.mul = function (a, b) {
    return a * b;
};

exports.sqr = function (a) {
    return a * a;
};
```

math/trigonometry.js:

```javascript
var ar = require("./arithmetic.js");

exports.area = function (r) {
    return ar.sum(Math.PI, ar.sql(r));
};
```

controllers/page.js

```javascript
var area = require("/math/trigonometry.js").area,
    r = 10;

console.log("Area for the radius " + r + " is " + area(r));
```

## 1. Assemble it

See [assembling section](assembling.md) for details.

## 2. Include vendor libraries

Include to the page all external libraries that may be required.

```html
<script src="jquery.js"></script>
<script src="my-super-lib.js"></script>
```

## 3. Include axy.define

```html
<script src="axy-define.js"></script>
```

## 4. Configure it

Configuration may include:

* Modification [the settings](settings.md)
* Converting basic events to [signals](signals.md)
* Definition of [the asynchronous storage](async.md)
* Definition of new [core modules](core.md) and the extension of the existing
* Definition [global variables](global.md)

## 5. Include modules

Include modules that were assembled in step 1.

## 6. Run

Typically, each page has its own controller.
Run it.

```javascript
axy.define.require("/controllers/page.js");
```

This correspond to a call from the command line:

```
$ cd /controllers
$ node page.js
```

The controller includes required modules and run unnecessary functions.

In a real application it will not calculate the area of a circle.
But will hang up event handlers to the elements of the page.

## 7. Then

Enjoy the result.
Or bug fixes and go back to step 1.
