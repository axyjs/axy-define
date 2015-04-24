# Resolving a Module Path

The library looks for modules according to the [Node.js algorithm](https://nodejs.org/api/modules.html#modules_all_together).

Additional global directories for search (except `node_modules`) taken from `process.paths`.

See [async](async.md) for details about `require.async()`.
