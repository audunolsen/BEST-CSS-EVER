// This code might come accross as a little freaky, but let me explain
//

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

    regexPatterns = require("../utils/regex-patterns"),
    { snowpackBabelConf } = require("../config/snowpack.config");

(async () => {

    const files = await glob("**/*.pug").then(r => r.filter(file => {
        return path.basename(file)[0] !== "_";
    }));

    const entries = await Promise.all(files.map(async f => {

        let
            pug,
            imports,
            ast = link(load.file(f, {lex: lex, parse: parse})),
            script = getTopLevelScript(ast) || "";


        (function escape(obj) {
            for (const key in obj) {

                if (key === "mustEscape") obj.escaped = true;
                if (key === "type" && obj[key] === "Code") {
                  obj.type = "Text";
                  obj.val = `#{${obj.val}}`;
                }

                if (typeof obj[key] === "object") escape(obj[key]);
            }
        })(ast);

        pug = pugFromAst(ast)
            .replace(regexPatterns.pugInterpolation, m => m.slice(1));

        console.log(pug);

        if (script) {

            imports = (script.match(regexPatterns.jsImports) || []).join("\n");
            script  = script.replace(regexPatterns.jsImports, "").trim();

        }

        pug =
            `${imports || ""}\n` +
            "import * as Preact from \"preact\";\n" +
            "export default function() {" +
            `${script || ""}\n` +
            `return pug\`\n${pug}\n\`}`;

        const {code: js} = await transform(pug, {
            plugins: [
                // For node_modules like imports of snowpack bundles
                ["snowpack/assets/babel-plugin.js", snowpackBabelConf],
                "transform-react-pug",
                "transform-jsx-classname-components",
                ["@babel/plugin-transform-react-jsx", {
                    pragma     : "Preact.h",
                    pragmaFrag : "Preact.Fragment",
                }],
            ],
        });

        return { filename : f, contents : js }

    }));

    Promise.all(entries.map(e => fs.writeFile(modifyFile(e.filename, {
        extension : "pug.js",
        swapBase  : "dist"
    }), e.contents, "utf8")));



})().catch(e => {

    // Better handling of pug compilation errors

    console.log("HOLY SHIT", e);

});

// Functipon retrieves the top level script tag in a pug
// abstract syntax tree, and removes said node from the AST.
function getTopLevelScript(obj, parent, level = 0) {

    for (const key in obj) {

        if (typeof obj[key] === "object")
            return getTopLevelScript(obj[key], obj, level + 1);

        else if (obj[key] === "script" && level === 2 && !!obj.block) {
            parent.splice(parent.indexOf(obj), 1);
            return obj.block.nodes.map(e => e.val).join("");
        }

    }

}