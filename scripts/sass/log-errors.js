const
    {oneLine,
    stripIndent,
    oneLineTrim}     = require("common-tags"),
    logger           = require("../logger/logger"),
    absolute         = require("../../utils/path-to-absolute"),
    modify           = require("../../utils/modify-file"),
    chalk            = require("chalk"),
    columnify        = require("columnify"),
    {existsSync}     = require("fs");

module.exports = function(err, {
    
    heading    : h1 = "Errors found! Fix before watch can resume as normal",
    subHeading : h2,
    clearCli   : clear = true,
    
} = {}) {
    
    const errors = Object.fromEntries(err.map(e => [e.file, []]));
    for (const e of err) errors[e.file].push(e);
    
    for (const file of Object.keys(errors)) errors[file] = {
        failedEntries : errors[file].map(e => e.entry),
        line          : errors[file][0].line,
        column        : errors[file][0].column,
        
        formatted: errors[file][0].formatted.split("\n").map(e => {
            const isPath = existsSync(e.match(/\S+/g)[0]);
            return !isPath ? e : 0; 
        }).filter(e => e).join("\n") + "\n",
        
        includePaths: errors[file].map(e => e.formatted
            .split("\n")
            .map(e => {
                return existsSync(e.match(/\S+/g)[0]) ? e : 0
            }) 
            .filter(e => e)
            .join("\n")
        )
    };
    
    let description = h2 ? h2 + "\n\n" : "",
        idx = 0;
    
    for (const [file, error] of Object.entries(errors)) {
        
        ++idx;
        var lastLoop = idx === Object.entries(errors).length;
        
        const
            errorInEntry = file === absolute(error.failedEntries[0]),
            erroredFile  = modify(file.replace(process.cwd(), ""), {swapRoot: ""});
        
        description += oneLine`
            ${chalk.bold(erroredFile)}
            ${chalk.red.bold(`${error.line}:${error.column}`)}` + "\n";
        
        description += error.formatted.split("\n").map((e, i) =>
            i !== 0 ? chalk.bold.red(e) : e
        ).join("\n");
        
        description += error.includePaths.map(e =>
            e.split("\n").map((e, i, s) => i == s.length - 1
                ? e
                : chalk.grey(e)
            ).join("\n")
        ).join("\n\n") + (lastLoop ? "" : "\n\n");
    
    }
    
    if (clear) logger.clear();
    logger.error(h1, description);

}