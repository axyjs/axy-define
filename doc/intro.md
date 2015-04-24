# Introduction

The purpose of the library is to provide a modular system for browser's JavaScript.
The de facto standard of JavaScript modules is CommonJS.
The library focused on it.

Modules that are not linked to specific resources (browser DOM model, server file system and etc) 
can equally work on node.js, axy.define and other CommonJS compatible systems.

Node.js modules that linked to specific resources may work in browser partly due to emulation of the environment.

## Environment and compatibility with Node.js

The library provides [the virtual file system](files.md) similar to POSIX file systems.

The library implemented [Node.js module system](https://nodejs.org/api/modules.html#modules_all_together).
Full search for `node_modules`, `package.json`, extensions, core modules, relative paths and etc.

Reproduced internal mechanisms. 
For example, `module.constructor._extensions` is loaders for extensions.
Can define a custom loader.
`module.constructor._cache` is a cache of the loaded modules.
Removing a module from here leads to reload.

Partially implemented [core modules](core.md) and [global variables](globals.md).
Implemented of minimally sufficient features for the environment.
The full implementation can be performed with the help of [plugins](plugins.md).

## Assembling

You can directly write an axy-module that will immediately work in a browser.
Or write a CommonJS module and convert it to the axy-module.

See [assembling section](assembling.md).
