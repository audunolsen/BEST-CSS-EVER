/*

WHAT THIS SCRIPT SHOULD DO

1. locate files with sass.js imports without any default import specified
   ( imported for side-effects ) and assign them a unique default import name.
   
   e.g. import "./header.sass.js"; -> import styles1wpxdzanc from "./header.sass.js";
   
 2. Add JSX element which links the corresponding css file
 
 3. Map className attribute entries to keys on the import-object
    e.g. styles1wpxdzanc.className (convert kebab-case to camelCase)
    
4. Style object kyes need a fallback in which the regular kebab-case name is
   used (e.g. styles1wpxdzanc.className || "class-name")

*/

// TODO: Better error handling!!!!

// Todo: c-cls or conditional-classes ?

/*

Get the top level H function call.

Check if first arg is a Fragment. If so then
insert h() function call at trd position w/link to style import

make the third argument

h("link", {
  rel: "stylesheet",
  type: "text/css",
  href: "/header/header.css"
})





*/

const
    { parseExpression: parse } = require("@babel/parser"),
    { default: generate }      = require("@babel/generator"),
    regexPatterns              = require(`${process.cwd()}/utils/regex-patterns`);
    
function err(msg = "cls attribute needs to be an object w shape {'className': expression}") {
    throw new Error(msg); 
}

module.exports = function({ types: t }) {
    
    const styles = "styles_" + Math.random().toString(36).substr(2, 9);
    
    let
        foundStyleImport,
        topJSXvisited;
    
    return {
        visitor: {
            
            ImportDeclaration: ({node}) => {
                
                if (
                    !/(sass|scss)\.js$/.test(node.source.value) &&
                    node.specifiers.length > 0
                ) return;
                    
                foundStyleImport = true;
                
                node.specifiers[0] = {        
                    type: "ImportDefaultSpecifier",
                    local: {
                        type: "Identifier",
                        name: styles,
                        loc: { identifierName: styles }
                    }
                }

            },
            
            JSXElement: path => {
                
                /* TODO: If styleimport found … */
                
                path.stop();
                path.replaceWith(t.parenthesizedExpression(t.jsxFragment(
                    t.jsxOpeningFragment(),
                    t.jsxClosingFragment(),
                    [
                        t.jsxElement(
                            t.JSXOpeningElement(
                                t.JSXIdentifier("FUCK"),
                                [],
                                true
                            ),
                            t.jsxClosingElement(
                                t.JSXIdentifier("FUCK")
                            ),
                            []
                        ),
                        path.node
                    ]                    
                )));
                
            },
            
            JSXOpeningElement: path => {
                
                let className, cls;
                
                path.traverse({JSXAttribute(path) {
                            
                    switch(path.node.name.name) {
                        case "className":
                            className = path.get("value").node;
                            path.remove();
                        break;
                        case "cls":
                            cls = path.get("value").node;
                            path.remove();
                        break;
                    }
                        
                }});
                
                if (!className && !cls) return;
                
                let classes = (className?.value || "").split(" ");
                
                if (cls && (
                    cls.type !== "JSXExpressionContainer" ||
                    cls.expression.type !== "ObjectExpression"
                )) err();
                
                for (const {key, value} of cls?.expression?.properties || []) {
                    
                    if (
                        key.type !== "StringLiteral" ||
                        !/(Expression|Literal|Identifier)$/.test(value.type)
                    ) err(value.type);
                    
                    classes.push([`!!(${generate(value).code})`, key.value]);
                    
                }
                
                const classArray = `[${classes.filter(e => e).map(c => {
                    
                    if (Array.isArray(c)) {
                        
                        if (!regexPatterns.conditionalClasses.test(c[1]))
                            err(c[1]); // Good error msg;
                        
                        let toggle = false;
                        const [ trueClasses, falseClasses ] = c[1]
                            .split(" ")
                            .filter(e => e)
                            .reduce((acc, e) => {
                                
                                if (e === "?") {
                                    toggle = true;
                                    return acc;
                                }
                                
                                const className = foundStyleImport
                                    ? `\${${styles}["${e}"] || "${e}"}` 
                                    : `"${e}"`;
                                    
                                acc[toggle ? 1 : 0].push(className);
                                return acc;
                                
                            }, [[], []]).map(e => e.join(" "));
                        
                        return falseClasses
                            ? `${c[0]} ? \`${trueClasses}\` : \`${falseClasses}\``
                            : `${c[0]} && \`${trueClasses}\``;
                    }
                    
                    return foundStyleImport
                        ? `${styles}["${c}"] || "${c}"`
                        : `"${c}"`;
                        
                }).join(", ")}].filter(e => e).join(" ")`;
                
                const classAttribute = t.jsxAttribute(
                    t.jsxIdentifier("className"),
                    t.jsxExpressionContainer(parse(classArray))
                );
                
                path.pushContainer('attributes', classAttribute);
                
                foundStyleImport = null;
                
            },
        }
    };
}