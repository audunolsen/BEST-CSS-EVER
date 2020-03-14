// This code might come accross as a little freaky, but let me explain…
//

const
    util       = require('util'),
    path       = require("path"),
    fs         = require("fs-extra"),
    modifyFile = require("../utils/modify-file"),
    glob       = util.promisify(require("glob"));
    transform  = util.promisify(require("@babel/core").transform),

    lex        = require("pug-lexer"),
    parse      = require("pug-parser"),
    load       = require("pug-load"),
    link       = require('pug-linker'),
    pugFromAst = require('pug-source-gen'),

    regexPatterns = require("../utils/regex-patterns"),
    str           = require("../utils/better-template-strings"),

    { plugins: babelPlugins } = require("../config/babel.config");

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

                if (key === "attrs")
                    obj[key].forEach(e => e.escaped = true);

                if (typeof obj[key] === "object" && key !== "attrs")
                    escape(obj[key]);


            }

        })(ast);

        pug = pugFromAst(ast)
            .replace(regexPatterns.pugInterpolation,  m => "#" + m.slice(1))
            .replace(regexPatterns.pugUnbufferedCode, m => {

                const arr = m.split("");
                arr.splice(m.length-2, 1);

                return arr;

            });

        if (script) {
            imports = (script.match(regexPatterns.jsImports) || []).join("\n");
            script  = script.replace(regexPatterns.jsImports, "").trim();
        }

        pug =
            (imports ? (imports + "\n") : "")         +
            "import { h, Fragment } from 'preact';\n" +
            "export default function() {\n"           +
                (script ? (script + "\n") : "")       +
                `return pug\`\n${pug}\n\``            +
            "}"

        const {code: js} = await transform(pug, {
            plugins: babelPlugins.concat([
                ["transform-react-pug", { /*classAttribute: "styleName"*/ }],
                // "transform-jsx-classname-components",
                // Pug-React & PragmaFrag opt aren't friends, see:
                // github.com/pugjs/babel-plugin-transform-react-pug/issues/120
                ["@babel/plugin-transform-react-jsx", { pragma: "h" }],
            ])
        });

        return {
          filename : f,
          contents : js.replace(regexPatterns.reactFrags, "Fragment")
        }

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

// [
//     // For node_modules like imports of snowpack bundles
//     ["snowpack/assets/babel-plugin.js", snowpackBabelConf],
//     `${process.cwd()}/utils/babel-add-missing-import-ext.js`,
//     ["transform-react-pug", { /*classAttribute: "styleName"*/ }],
//     "transform-jsx-classname-components",
//     // Pug-React & PragmaFrag opt aren't friends, see:
//     // github.com/pugjs/babel-plugin-transform-react-pug/issues/120
//     ["@babel/plugin-transform-react-jsx", { pragma: "h" }],
// ],


//- header(role="header" className=styles.headerKebabCase)
//-     h1 This is a heading
//-     p.styles.klasseNavn this is the header
//-
//-     p heheheh #{p.propTest}
//-
//-     if s.show
//-         p.greeting HELLO YOU BEATIFUL PERSON
//-
//-     include ../vector-art/_arrow.pug