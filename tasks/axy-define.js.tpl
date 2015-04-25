/*! This is template for the summary JS-file
 *
 * TS-files from the directory `/ts/` compiled to the temporary file `compiled.js` in this directory.
 * The content for that file includes in this template instead the placeholder `"<%= content %>";`.
 * Indent before the placeholder specifies the indentation before the content.
 *
 * This comment (beginning with `/*!`) will be removed.
 */

/**
 * The implementation of CommonJS for browsers
 *
 * @author Oleg Grigoriev <go.vasac@gmail.com>
 * @license MIT
 * @link https://github.com/axyjs/axy-define
 */
"use strict";

var axy = axy || {};

axy.define = (function (window, undefined) {
    function createSandbox(externalGlobal) {
        externalGlobal = externalGlobal || window;
        "<%= content %>";
        return sandbox.create(createSandbox);
    }
    return createSandbox(window);
})(window);
