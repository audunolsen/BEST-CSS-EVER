const
    {parse,
    normalize,
    basename}              = require("path"),
    {oneLine,
    stripIndent,
    oneLineTrim}           = require("common-tags"),
    columnify              = require('columnify'),
    {lstatSync: stats}     = require("fs"),
    isGlob                 = require("is-glob"),
    isInvalid              = require("is-invalid-path"),
    logger                 = require("../logger/logger"),
    chalk                  = require("chalk");
    
const {
    "style-sources"          : styleSrc,
    "source-directory"       : srcDir,
    "distribution-directory" : distDir
} = require("../../package.json")?.config || {};
    
logger.clear();

const argv = require('yargs')
    .usage("Usage: npm run sass:$0 TODO, better usage doc")
    .options({
        "help": { hidden: true },
        "version": { hidden: true },
        "file": {
            alias: "f",
            describe: "file(s) to be processed",
            requiresArg: true,
            array: true,
            default: null,
            coerce: validateFileArgs,
        },
        "watch": {
            alias: "w",
            describe: "watch file(s)",
            coerce: validateWatchArg,
            conflicts: ["lint-sources", "lint-only"]
        },
        "lint": {
            alias: "l",
            describe: "run linter",
            boolen: true,
        },
        "lint-fix": {
            alias: "lf",
            describe: "run linter and fix fixable violations",
            boolen: true,
            implies: "lint",
        },
        "lint-sources": {
            alias: "ls",
            describe: "run linter on file's included sources",
            boolen: true,
            implies: "lint",
        },
        "lint-only": {
            alias: "lo",
            describe: "run linter only",
            boolean: true,
            implies: "lint",
            conflicts: "watch",
        },
        "lint-exit-code": {
            alias: "lx",
            describe: "process exit code",
            implies: "lint",
            choices: [0, 1],
            conflicts: "watch",
        },
        // TODO: "lint-interactive": {
        //     describe: "run linter only",
        //     boolean: true,
        //     conflicts: ["watch", "lint", "lint-sources", "lint-fix"]
        // },
    })
    .conflicts("watch", "lint-only")
    .parserConfiguration({
        "strip-aliased": true,
        "camel-case-expansion": false
    })
    .fail((msg, err, yargs) => {
        logger.warning("Invalid arguments provided", `${msg}\n\n${yargs.help()}`)
        process.exit(0)
    })
    .strict()
    .argv;
    
const {
    all,
    watch : watchFiles,
    file  : compileTargets,
    lint,
    "lint-only"      : lintOnly,
    "lint-fix"       : lintFix,
    "lint-sources"   : lintSources,
    "lint-exit-code" : lintExit = 0
} = argv;

if (watchFiles) (require("./watch"))(
    watchFiles,
    compileTargets,
    lint,
    lintFix
);

else (require("./all"))(
    compileTargets,
    lint,
    lintFix,
    lintSources,
    lintOnly,
    lintExit
);

function packageConf({
    dist    = true,
    src     = true,
    sources = true
} = {}) {
    
    let pkg = columnify([
        src && {
            key: "source-directory",
            del: ":",
            val: "<path>,",
            desc: "(Where to look for files)",
            fail: chalk.bold.red(!srcDir
                ? "[missing]"
                : isInvalid(srcDir) ? "[invalid path]" : ""
            )
        },
        sources && {
            key: "style-sources",
            del: ":",
            val: "<glob>,",
            desc: "(Files to look for)",
            fail: chalk.bold.red(!styleSrc
                ? "[missing]"
                : !isGlob(styleSrc) ? "[invalid glob]" : ""
            )
        },
        dist && {
            key: "distribution-directory",
            del: ":",
            val: "<path>,",
            desc: "(where to ditribute)",
            fail: chalk.bold.red(!distDir
                ? "[missing]"
                : isInvalid(distDir) ? "[invalid path]" : ""
            )
        }
    ].filter(e => e), {showHeaders: false});
    
    return "config: {\n" + pkg
        .split("\n")
        .map(s => `  ${s}`)
        .join("\n") +
    "\n}";
    
}


function validateWatchArg(arg) {
    
    if (typeof arg == "boolean") {
        
        if (isInvalid(srcDir) || !isGlob(styleSrc))
            throw new Error(stripIndent`
                If no watch glob-pattern is provided
                then package.json must provide:` + "\n\n" +
                packageConf({dist: false})
            );
        
        return normalize(`${srcDir}/${styleSrc}`);
        
    } else if (isGlob(arg)) return arg;
    
    throw new Error(
        "Watch argument must be a booleam or a glob pattern"
    );
}


function validateFileArgs(arg) {
    
    let type = Array.isArray(arg) ? "array" : "object",
        invalid,
        defaultOtherwise;
    
    if (arg.length == 1 && arg[0] == null) {
        
        if (isInvalid(srcDir) || isInvalid(distDir) || !isGlob(styleSrc))
            throw new Error(stripIndent`
                If no file argument is defined
                then package.json must provide:` + "\n\n" +
                packageConf()
            );
            
        return parseTargets(normalize(`${srcDir}/${styleSrc}`));

    }
    
    if (type == "array" && isInvalid(distDir))
        throw new Error(stripIndent`
            If file(s) do not have a defined out path
            then package.json must provide:` + "\n\n" +
            packageConf({src: false, sources: false})
        );
    
    const argUsage = stripIndent`
        File argument must be one of:
        1. glob   --file "glob/**/*.pattern"
        2. array  --file path/to/file-1.ext path/to/file-2.ext
        3. object --file.infile.ext "outfile-path.ext"
           object may can include optional
           --file.default-otherwise key`;
    
    if (type == "object") {
        
        /* YARGS doesn't allow dot notation inside objet keys,
           instead treating them as new objects. This is a
           workaround to allow for string keys with any character
        */
        
        arg = Object.fromEntries(Object.keys(arg).map(e =>
            (function buildPath(o, p="", l=0) {
                for (const k in o) return typeof o[k] == "object"
                    ? buildPath(o[k], p+(l==0 ? "" : ".")+k, l+1)
                    : [p + (l==0 ? "" : ".") + k, o[k]];
            })({[e]: arg[e]})
        ));
    }
    
    for (const file of type === "object" ? Object.keys(arg) : arg) {
        if (file == "default-otherwise" && type == "object") {
            defaultOtherwise = true; continue;
        }
        try {var st = stats(file)}
        catch(e) { invalid = file; break; }
        if (!st.isFile()) { invalid = file; break; }
    }
    
    if (type == "object") for (const [inF, outF] of Object.entries(arg)) {
        
        if (
            inF == "default-otherwise" &&
            (isInvalid(srcDir) || isInvalid(distDir) || !isGlob(styleSrc))
        ) {
            throw new Error(stripIndent`
                If file argument object includes "default-otherwise" key,
                then package.json must provide:` + "\n\n" + packageConf()
            );
            continue;
        }
        
        
        if (outF !== true && isInvalid(outF)) var invalidOut = [inF, outF];
        if (outF === true) {
            
            arg[inF] = undefined;
            if (isInvalid(distDir)) throw new Error(stripIndent`
                File argument is an object, but
                ${inF} doesn't define an out path,
                therfore package.json must provide:` + "\n\n" +
                packageConf({src: false, sources: false})
            );
        }
        
    }
    
    if (type == "array" && arg.length == 1 && invalid) {
        
        if (!isGlob(arg[0])) throw new Error(oneLine`
            File argument "${arg[0]}" is neither
            an existing file or a valid glob` + `\n\n${argUsage}`
        );
        
        else type = "glob";
        
    }    
        
    else if ((arg.length > 1 || type == "object") && invalid)
        throw new Error(
            `File argument "${invalid}" was not found\n\n${argUsage}`
        );
        
    else if (invalidOut) throw new Error(stripIndent`
        File argument has an invalid out path:
        "${invalidOut[0]}" > "${invalidOut[1]}"` +
        `\n\n${argUsage}`
    );
    
    arg = parseTargets(type == "glob" ? arg[0] : arg);
    
    if (defaultOtherwise) {
        const def = parseTargets(normalize(`${srcDir}/${styleSrc}`));
        delete arg["default-otherwise"];
        arg = Object.assign(def, arg);
    }

    return arg;

}



function parseTargets(targets) {
    
    if (typeof targets == "string")
        targets = require("glob").sync(targets)
        .filter(e => basename(e)[0] !== "_");
    
    if (targets?.constructor === Object)
        Object.keys(targets).map(k => targets[k] = {
            outpath: targets[k], includedFiles: []
        });
        
    else targets = Object.fromEntries(targets.map(e =>
        [e, {outpath: "", includedFiles: []}]
    ));

    return targets;

}