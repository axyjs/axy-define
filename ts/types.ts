/**
 * Some global types
 *
 * These types are moved from the specific modules to the global scope because some IDE do not supported export types.
 */

/// <reference path="engine.ts" />

/**
 * The module value
 *
 * What is contained in the `module.exports`
 */
type IModuleValue = any;

/**
 * The module identifier
 *
 * The name for native modules ("fs" -> "fs")
 * A string "." for the main module
 * A full normalized path for others
 */
type IModuleId = string;

/**
 * The argument of require()
 *
 * require("./../module.js")
 * Here the module-request is `./../module.js`
 * And the module-id is `/real/path/to/module.js`
 */
type IModuleRequest = string;

/**
 * Content of a JSON "file"
 * - the value itself
 * - JSON-string
 * - a function that returns a value
 */
type IFileJSONContent = any;

/**
 * Content of a JS "file"
 * - a function wrapper above a module constructor or a string of code
 * - a code string
 */
type IFileJSContent = engine.IWrapper;

/**
 * Content of others "files"
 */
type IFileTXT = string;

/**
 * Summary content of any "file"
 */
type IFileContent = IFileJSONContent | IFileJSContent | IFileTXT;
