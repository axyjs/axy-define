/**
 * /dir/one.txt - loaded, cacheable
 * /dir/two.txt - not loaded, cacheable
 * /dyn/data.txt - not loaded, not cacheable
 */
"use strict";

function load(callback, info) {
    setTimeout(function () {
        callback(info);
    });
}

function result(realpath, isFile, content, cacheable, callback) {
    var info = {
        realpath: realpath,
        isFile: isFile,
        content: content,
        cacheable: cacheable
    };
    if (callback) {
        load(callback, info);
    } else {
        return info;
    }
}

var Mo = function (exports, require, module) {
    if (module.filename === "/modules/mo.js") {
        exports.r = true;
    } else {
        exports.r = false;
    }
};

function AsyncStorage() {
}

AsyncStorage.prototype.stat = function (filename, callback) {
    switch (filename) {
        case "/dir/one.txt":
            return result(filename, true, "One Content", true);
        case "/dir/two.txt":
            return result(filename, true, null, true, callback);
        case "/dir":
            return result(filename, false, null, true);
        case "/dyn/data.txt":
            return result(filename, true, null, false, callback);
        case "/dyn":
            return result(filename, false, null, false, callback);
        case "/modules/mo.js":
            return result(filename, true, Mo, true, callback);
    }
    return result(null, false, null, false, callback);
};

AsyncStorage.prototype.read = function (filename, callback) {
    switch (filename) {
        case "/dir/one.txt":
            return result(filename, true, "One Content", true);
        case "/dir/two.txt":
            return result(filename, true, "Two Content", true, callback);
        case "/dir":
            return result(filename, false, null, true);
        case "/dyn/data.txt":
            return result(filename, true, "Data Content", false, callback);
        case "/dyn":
            return result(filename, false, null, false, callback);
        case "/modules/mo.js":
            return result(filename, true, Mo, true, callback);
    }
    return result(null, false, null, false, callback);
};

AsyncStorage.prototype.moduleResolve = function (filename, parent, callback) {
    var s = parent.filename + "/" + filename;
    switch (s) {
        case "/one/mo.js/./../modules":
            return result("/modules/mo.js", true, Mo, true, callback);
        case "/one/mo.js/./../modules/mo":
            return result("/modules/mo2.js", true, Mo, true);
    }
    return result(null, false, null, false, callback);
};

module.exports = AsyncStorage;
