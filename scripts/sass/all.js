const
    logError      = require("./log-errors"),
    compile       = require("./compile"),
    lint          = require("./lint"),
    {promisify}   = require('util'),
    {basename}    = require("path"),
    absolute      = require("../../utils/path-to-absolute"),
    {oneLineTrim,
    oneLine}      = require("common-tags"),
    columnify     = require("columnify"),
    modify        = require("../../utils/modify-file"),
    glob          = promisify(require('glob')),
    chalk         = require("chalk");
    
module.exports = async function(
    targets,
    ln,
    lintFix,
    lintSources,
    lintOnly,
    lintExit
) {
    
    if (!Object.keys(targets).length) {
        logger.info(
            `No compile targets were matched by ${styleSources}`,
            "Only files NOT starting with a \"_\" are compiled"
        );
        process.exit();
    }
        
    let [lintRes, [successes, errors]] = await Promise.all([
        
        Promise.all((ln && !lintSources)
            ? Object.keys(targets).map(t => lint(t, {fix: lintFix}))
            : []
        ),
        
        Promise.all(Object.keys(targets).map(t =>
            
            compile(t, {
                silent  : lintOnly,
                outpath : targets[t].outpath
            }).catch(e => {e.entry = t; return e})
                
        )).then(r => r.reduce((a, e) => {
            a[!(e instanceof Error) ? 0 : 1].push(e);
            return a;
        }, [[], []]))
        
    ]);
    
    if (errors.length) {
        logError(errors, {heading: "Could not compile all Sass code, Errors found!"});
        process.exit(1);
    }
    
    if (ln && lintSources) lintRes = await Promise.all(successes
        .map(e => e.stats.includedFiles)
        .flat()
        .filter((e, i ,s) => s.indexOf(e) == i)
        .map(e => lint(e, {fix: lintFix}))
    );
    
    if (!lintOnly) logger.success("Files compiled!",
        columnify(successes.map(({
            size: {value, unit},
            time,
            infile,
            outfile
        }) => ({
            infile  : infile,
            size    : chalk.bold.grey(value + unit.toLowerCase()),
            time    : chalk.bold.grey(`| ${time}ms`),
            outfile : `${chalk.bold.green(">")} ${outfile}`
        })), {
            showHeaders: false,
            config: {size: {align: 'right'}}
        })
    );
    
    let allFixed = ln &&
        lintRes.some(e => e.violated) &&
        lintRes.filter(e => e.violated).every(e => e.allFixed);
    
    if (ln && lintRes.some(e => e.violated)) {
    
        logger.warning(
            "Rules have been broken…",
            lintRes.filter(e => e.violated).map(e =>
                `${chalk.bold(e.file.replace(process.cwd() + "/", ""))}\n` +
                `${e.formatted}`
            ).join("\n\n")
        );
        
        if (allFixed) logger.success("All linter violations were fixed");
        
        process.exit(allFixed ? 0 : lintExit);
        
    }
    
    else if (lintOnly && !lintRes.some(e => e.violated))
        logger.success("No Sass linter violations!");

}