/**
 * Test "core" module "path"
 */
"use strict";

var axy = require("../axy-node.js");

function fsPlugin(context) {
    var fs = context.coreInstance.require("fs"),
        data = context.fsData;
    fs.getAllDirs = function () {
        return data.dirs;
    };
}

module.exports = {
    testPlugins: function (test) {
        var sandbox1 = axy.define.createSandbox(),
            sandbox2,
            fs0 = axy.define.core.require("fs"),
            fs1 = sandbox1.core.require("fs"),
            fs2,
            dirs1,
            dirs2;
        sandbox1.addPlugin("fs.full", fsPlugin);
        sandbox2 = sandbox1.createSandbox();
        fs2 = sandbox2.core.require("fs");
        test.ok(!fs0.getAllDirs);
        test.ok(fs1.getAllDirs);
        test.ok(fs2.getAllDirs);
        fs1.writeFileSync("/one/two/file.txt", "Content");
        fs2.writeFileSync("/one/three/file.txt", "Content");
        dirs1 = fs1.getAllDirs();
        dirs2 = fs2.getAllDirs();
        test.ok(dirs1["/one"]);
        test.ok(dirs1["/one/two"]);
        test.ok(!dirs1["/one/three"]);
        test.ok(dirs2["/one"]);
        test.ok(!dirs2["/one/two"]);
        test.ok(dirs2["/one/three"]);
        test.done();
    }
};
