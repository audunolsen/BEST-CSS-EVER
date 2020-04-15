const
    {oneLine} = require("common-tags"),
    {lint}    = require("stylelint"),
    {extname} = require("path"),
    config    = require("../../config/stylelint.config"),
    chalk     = require("chalk"),
    {icons}   = require("../logger/logger"),
    columnify = require('columnify');
    
/*

The postCSS-Sass (indentet syntax, not scss) parser is still very much
in an alpha stage, thus making it very difficult for the
linter to work properly on more complex sass-functionality.
This results in the linter either the linter crashing or the
fix option deleting code

Until said issues get adressed, use scss

*/
    
var {
    "declaration-block-semicolon-newline-after"  : trash,
    "declaration-block-semicolon-newline-before" : trash,
    "declaration-block-semicolon-space-after"    : trash,
    "declaration-block-semicolon-space-before"   : trash,
    "declaration-block-trailing-semicolon"       : trash,
    "block-closing-brace-empty-line-before"      : trash,
    "block-closing-brace-newline-after"          : trash,
    "block-closing-brace-newline-before"         : trash,
    "block-closing-brace-space-after"            : trash,
    "block-closing-brace-space-before"           : trash,
    "block-opening-brace-newline-after"          : trash,
    "block-opening-brace-newline-before"         : trash,
    "block-opening-brace-space-after"            : trash,
    "block-opening-brace-space-before"           : trash,
    ...sassRules
} = config.rules;

module.exports = async (file, {fileHeading = false, fix} = {}) => {
    
    if (!file) return;
    
    let wasFixed,
        maxColDigits  = 0,
        maxLineDigits = 0;
    
    const options = {
        files  : file,
        config : extname(file) === ".sass"
            ? Object.assign(config, {rules: sassRules})
            : config
    }
    
    /*    
    
    Linter is run two times for the same file because the fix option
    doesn't notify which rules which have been fixed. Thus it's difficult for
    the coder to learn better coding practises if they can't see what they
    did wrong.
    
    Hopefully this will be addressed:
    https://github.com/stylelint/stylelint/issues/4664
    
    TODO: Some linter fixes aren't caught by the check below
    Fix by generating a sha-hash before and after fix-run
    and compare them
    
    */
    
    let [
        {results : [{warnings}]},
        {results : [{warnings: afterFix}]}    
    ] = await Promise.all([
        lint(options),
        fix ? lint(Object.assign(options, {fix: true}))
            : Promise.resolve({results: [{}]})
    
    ]).catch(e => {
        logger.error("Linter unexpectedly chrashed!", e);
        process.exit();
    });
    
    warnings = warnings.map(e => {
        
        if (fix && !afterFix
            .map(el => JSON.stringify(el).toLowerCase())
            .includes(JSON.stringify(e).toLowerCase())
        ) {
            e.fixed = true;    
            wasFixed = true;
        }
        
        e.text = e.text.replace(/\(.+\)$/, "");
        
        return e;
        
    }).reduce((acc, e) => {
        
        if (acc[e.rule]) acc[e.rule].push(e)
        else acc[e.rule] = [e];
        
        return acc;
        
    }, {});
    
    // TODO: sorting: fixed -> warning -> error
    // warnings = warnings.sort(e => e.fixed ? -1 : 1);
    
    warnings = Object.keys(warnings).map(rule => {
        
        const defiances = warnings[rule].map(e => {
            
            const
                color   = e.severity === "error" ? "red" : "yellow",
                lineLen = `${e.line}`.length,
                colLen  = `${e.column}`.length;
            
            if (lineLen > maxLineDigits) maxLineDigits = lineLen;
            if (colLen  > maxColDigits)  maxColDigits  = colLen;
            
            return {
                icons: oneLine`
                    ${e.fixed ? `${icons.success} ${chalk.grey("|")}` : ""}
                    ${icons[e.severity]}`,
                where: `${e.line}:${e.column}`,
                text: e.text.replace(/"[^"]*"/g, m => chalk.bold[color](m.slice(1, -1))),
            }
        
        });
        
        defiances.push({
            icons: "",
            where: "",
            text: chalk.grey(rule)
        });
        
        return defiances;
        
    }).flat();
    
    const columns = columnify(warnings, {
        showHeaders: false,
        config: {
            icons: {align: "right"},
            where: {
                align: "right",
                dataTransform: str => {
                    
                    if (!str) return "";
                    
                    let [line, col] = str.split(":");
                        
                    line = line.length < maxLineDigits
                        ? "0".repeat(maxLineDigits - line.length) + line
                        : line;
                        
                    col = col.length < maxColDigits
                        ? "0".repeat(maxColDigits - col.length) + col
                        : col;
                        
                    return chalk.bold.grey(`${line}:${col}`);
                    
                }
            },
        }
    });
    
    return {
        violated : !!warnings.length,
        allFixed : fix ? warnings.length && !afterFix.length : undefined,
        file: file,
        fixed: wasFixed,
        formatted: fileHeading
            ? `${chalk.bold(file)}\n${columns}`
            : columns
    };

}