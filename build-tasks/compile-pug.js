const
    util       = require('util'),
    path       = require("path"),
    fs         = require("fs-extra"),
    modifyFile = require("../utils/modify-file"),
    glob       = util.promisify(require('glob'));
    transform  = util.promisify(require('@babel/core').transform),

    lex   = require("pug-lexer"),
    parse = require("pug-parser"),
    load  = require("pug-load"),
    genSource = require('pug-source-gen'),
    link = require('pug-linker');

(async () => {

    const files = await glob("**/*.pug").then(r => r.filter(file => {
        return path.basename(file)[0] !== "_";
    }));

    const entries = await Promise.all(files.map(async f => {

        var ast = link(load.file(f, {lex: lex, parse: parse}));
        const pug = `module.exports = pug\`\n${genSource(ast)}\n\``

        const {code: js} = await transform(pug, {
            plugins: [
                "transform-react-pug",
                ["@babel/plugin-transform-react-jsx", {
                  pragma     : "Preact.h",
                  pragmaFrag : "Preact.Fragment",
                }],
            ],
        });

        return { filename : f, contents : js }

    }));

    Promise.all(entries.map(({filename, contents}) => {

        return fs.writeFile(modifyFile(filename, {
            extension: "pug.js",
            swapBase: "dist"
        }), contents, "utf8");

    }));



})().catch(e => {

    // Better handling of pug compilation errors

    console.log("HOLY SHIT", e);

});



function traverse(o) {
    for (var i in o) {
        if (!!o[i] && typeof(o[i])=="object") {
            console.log(i, o[i]);
            traverse(o[i]);
        } else {
            console.log(i, o[i]);
        }
    }
}