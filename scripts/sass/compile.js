const
    {promisify}   = require("util"),
    {parse,
    basename,
    normalize}    = require("path"),
    fs            = require("fs-extra"),
    Fiber         = require("fibers"),
    size          = require('byte-size'),
    postcss       = require("postcss"), 
    render        = promisify(require("sass").render),
    {performance} = require('perf_hooks'),
    {plugins}     = require("../../config/postcss.config"),
    modify        = require("../../utils/modify-file");
        
const {
    "distribution-directory" : distDir
} = require("../../package.json")?.config || {};

module.exports = async function compile(file, {silent, outpath} = {}) {
    
    const t0 = performance.now();
    
    var {css, stats} = await render({
        file: file,
        sourceMapEmbed: true,
        fiber: Fiber
        // TODO: No sourcemap if prod or silent
    });
    
    if (silent) return { infile: file, stats : stats };
    
    var { css } = await postcss(plugins).process(css, {from: file});
    
    const outFilepath = !outpath
        ? modify(file, {swapRoot: distDir, swapExtension: "css"})
        : parse(outpath).ext
            ? outpath
            : normalize(outpath + "/" +
              basename(modify(file, {swapExtension: "css"})));
    
    await fs.outputFile(outFilepath, css);
    
    return {
        infile  : file,
        outfile : outFilepath,
        time    : Math.floor(performance.now() - t0),
        size    : size(Buffer.byteLength(css, 'utf8')),
        stats   : stats
    }
    
}