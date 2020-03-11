const
    util       = require('util'),
    path       = require("path"),
    fs         = require("fs-extra"),
    modifyFile = require("../utils/modify-file"),
    glob       = util.promisify(require('glob'));
    transform  = util.promisify(require('@babel/core').transform),

    lex        = require("pug-lexer"),
    parse      = require("pug-parser"),
    load       = require("pug-load"),
    link       = require('pug-linker'),
    pugFromAst = require('pug-source-gen'),
    
    { snowpackBabelConf } = require("../config/snowpack.config");

(async () => {

    const files = await glob("**/*.pug").then(r => r.filter(file => {
        return path.basename(file)[0] !== "_";
    }));

    const entries = await Promise.all(files.map(async f => {

        let ast = link(load.file(f, {lex: lex, parse: parse}));
        
        (function escape(obj) {
            
            for (const key in obj) {
                if (typeof obj[key] === "object") escape(obj[key]);
                else if (key === "mustEscape") obj.escaped = true;
            }
            
        })(ast);
        
        const pug = `import * as Preact from "preact";\nexport default pug\`\n${pugFromAst(ast)}\n\``;
        
        const {code: js} = await transform(pug, {
            plugins: [
                ["snowpack/assets/babel-plugin.js", snowpackBabelConf],
                "transform-react-pug",
                ["@babel/plugin-transform-react-jsx", {
                    pragma     : "Preact.h",
                    pragmaFrag : "Preact.Fragment",
                }],
            ],
        });
        
        return {
            filename : f,
            contents : js
        }

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