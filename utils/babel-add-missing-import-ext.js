const { extname } = require("path");

module.exports = function() {
    return {
        visitor: {
            ImportDeclaration: function(path) {

                let
                    importFile = path.node.source.value,
                    extension  = extname(importFile);

                if (!extension || extension !== ".js") importFile += ".js";

                path.node.source.value = importFile;

            }
        }
    };
}