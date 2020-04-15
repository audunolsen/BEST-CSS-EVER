const
    {basename}       = require("path"),
    {performance}    = require('perf_hooks'),
    {readFile,
    writeFile}       = require("fs-extra"),
    {watch}          = require("chokidar"),
    {oneLine,
    stripIndent,
    oneLineTrim}     = require("common-tags"),
    chalk            = require("chalk"),
    columnify        = require("columnify"),
    logger           = require("../logger/logger"),
    absolute         = require("../../utils/path-to-absolute"),
    modify           = require("../../utils/modify-file"),
    logErrors        = require("./log-errors"),
    compile          = require("./compile"),
    lint             = require("./lint");
    
class SassWatcher {
  
    constructor(watchFiles, targets, lint, lintFix) {
        
        Object.assign(this, {
            watchGlob     : watchFiles,
            targets       : targets,
            lint          : lint,
            fix           : lintFix,
            watcher       : watch(watchFiles, {ignoreInitial: true}),
            
            state: {
                event         : "",
                file          : "",
                errors        : [],
                fixedErrors   : [],
                lockedFiles   : {},
                prevError     : false,
                prevLintFix   : false,    
                writeOnLocked : false
            }
            
            /* TODO;
            Support adding new compile targtes while watcher is running
            
            This only works if compile targets originate from a glob
            and matches said glob, thus a meta key need to be added
            to the targets object stating it's origin.
            
            As of now, "add" does nothing for new targets. If new sources/includes
            are addded during watch then the watcher will respond to
            them as expected. */
            
        });
        
        this.watcher
        .on("ready", this.handleWatchEvents.bind(this))
        .on("all",   this.handleWatchEvents.bind(this))
        .on("error", e => {
            logger.error("Sass watcher could not start", e);
            process.exit();
        });
    
    }
    
    handleWatchEvents = handleWatchEvents;
    logSuccess = logSuccess;
    
    clearErrors() {
        this.state.errors      = [];
        this.state.fixedErrors = [];
        this.state.lockedFiles = {};
        this.state.prevError   = false;
    }
    
    get watched() {

        /*
        Chokidar returns watched files in wierd format, see:
        https://github.com/paulmillr/chokidar/issues/491#issuecomment-607315052
        */

        return Object.entries(this.watcher.getWatched())
        .map(([k, v]) => v.map(e => `${k}/${e}`)).flat();
        
    }
  
}

async function handleWatchEvents(event = "ready", changedFile) {
    
    this.state.event = event;
    this.state.file  = changedFile;

    if (
        !["change", "unlink", "ready"].includes(event) ||
        this.state.prevLintFix
    ) {
        this.state.prevLintFix = false;
        return;
    }
    this.state.prevLintFix = false;
    
    if (this.state.errors.length) {
        
        if (this.state.writeOnLocked) {
            this.state.writeOnLocked = false;
            return;
        };
        
        if (Object.keys(this.state.lockedFiles).includes(absolute(changedFile))) {
            this.state.writeOnLocked = true;
            
            await writeFile(
                changedFile,
                this.state.lockedFiles[absolute(changedFile)]
            );
            
            logErrors(this.state.errors, {
                subHeading: chalk.bold.yellow(stripIndent`
                    Attempted changes to ${modify(changedFile, {swapRoot: ""})}
                    were discarded, please fix errors first!`)
            });
            
            return;
        }
        
    }
    
    let compileEntries = {};
            
    if (event == "ready") {
        
        compileEntries = this.targets;
    
        if (!Object.keys(compileEntries).length) {
            logger.warning("No sass files to compile, quitting…\n");
            process.exit();
        }
        
    } else {
        
        if (this.state.errors.length) {
            
            const errored = this.state.errors.map(e => absolute(e.entry));
            
            for (const [k, v] of Object.entries(this.targets))
                if (errored.includes(absolute(k)))
                    compileEntries[k] = this.targets[k];
        
        } else
            for (const [k, v] of Object.entries(this.targets))
                if (v.includedFiles.includes(absolute(changedFile)))
                    compileEntries[k] = this.targets[k];
    
    }
        
    if (!Object.keys(compileEntries).length) {
        logger.warning(oneLine`
            ${basename(changedFile)}
            not included by any compile-targets.`,
            chalk.bold("Provided compile targets:\n") +
            Object.keys(this.targets).join("\n")
        );
        return;
    }
    
    const time = performance.now();
    
    Promise.all([
        
        this.lint ? lint(changedFile, {fix: this.fix}) : null,
        
        ...Object.keys(compileEntries).map(file => compile(file, {
            // silent  : event == "ready" ? true : false,
            outpath : compileEntries[file].outpath
        }).catch(e => {e.entry = file; return e}))
            
    ]).then(([lint, ...compiled]) => {
        
        if (lint?.fixed) this.state.prevLintFix = true;
            
        const [successes, errors] = compiled.reduce((a, e) => {
            a[!(e instanceof Error) ? 0 : 1].push(e);
            return a;
        }, [[], []]);
        
        for (const s of successes) {
            
            this.targets[s.stats.entry]
            .includedFiles = s.stats.includedFiles;

            if (this.state.errors.map(e => e.entry)
                .includes(s.stats.entry)
            ) {
                s.prevError = this.state.errors.filter(e =>
                    s.stats.entry == e.entry
                )[0];
                if (errors.length) this.state.fixedErrors.push(s);
            }
            
        }
            
        if (errors.length) {
            this.state.prevError = true;
            throw errors;
        }
            
        if (event == "ready") {
            logger.info(`Sass watch: now listening to ${this.watchGlob}`);
            return;
        }
        
        this.logSuccess(compiled.concat(this.state.fixedErrors), lint, time);
        this.clearErrors();
        
    }).catch(async (errors) => {
        
        if (!Array.isArray(errors)) {
            logger.error("Sass watch: Unexpected error", errors);
            return;
        }
        
        this.state.errors = errors;
        
        this.state.lockedFiles = this.watched
            .filter(e => !this.state.errors.map(r => r.file).includes(e))
            .reduce((a, e) => { a[e] = ""; return a }, {});
        
        await Promise.all(Object.keys(this.state.lockedFiles).map(file =>
            readFile(file).then(res => this.state.lockedFiles[file] = res)
        ));
        
        logErrors(this.state.errors);
        
    });
    
}

function logSuccess (compiled, lint, start, end = performance.now()) {
    
    const result = compiled.reduce((a, e) => {
        
        const errorFile = (e.prevError?.file || "")
        .replace(process.cwd() + "/", "");
        
        if (this.state.prevError)
            if (!a[errorFile]) a[errorFile] = [e]
            else a[errorFile].push(e);
        else
            if (!a[this.state.file]) a[this.state.file] = [e]
            else a[this.state.file].push(e);
        
        return a;
        
    }, {});
    
    const eventPastTense = (_ => ({
        "change" : "changed",
        "unlink" : "deleted",
        "add"    : "added"
    }[this.state.event]))();
    
    const eventColor = (_ => ({
        "change" : "blue",
        "unlink" : "red",
        "add"    : "green"
    }[this.state.event]))();    
    
    let eventStr = chalk.bold[eventColor](`[${eventPastTense}]`);
    
    const formatted = Object.keys(result).map(key => {
        
        if (result[key].some(e => e.prevError))
            eventStr = chalk.bold.blue("[fixed error]");
        
        const entryChange = key === result[key][0].infile;
        
        let entries = columnify(result[key].map(({
            infile,
            outfile,
            size: {value: size, unit},
            time,
            prevError
        }, i, s) => ({
                
            infile: oneLine`${chalk.bold.grey(entryChange ? "+ " : i == s.length - 1
                ? "└─── "
                : "├─── "
            )}${infile}`,
            
            time    : chalk.bold.grey(size + unit.toLowerCase()),
            size    : chalk.bold.grey(`| ${time}ms`),
            event   : entryChange ? `${eventStr}` : undefined,
            outfile : `${chalk.bold.green(">")} ${outfile}`
            
        })), {showHeaders: false});
        
        if (!entryChange)
            entries = `${chalk.bold.grey("+")} ${key} ${eventStr}\n` + entries;
        
        return entries;
        
    }).join("\n");

    logger.success(
        oneLine`Sass watch: successfully compiled in ${Math.floor(end - start)}ms`,
        formatted
    );

    if (lint?.violated) logger.warning(
        `Rules were broken by "${basename(lint.file)}" `,
        lint.formatted
    );

}

module.exports = (watchFiles, compileTargets, lint, lintFix) =>
    new SassWatcher(watchFiles, compileTargets, lint, lintFix);