const
    sass      = require("sass"),
    postcss   = require("postcss"),
    config    = require("../config/postcss.config"),
    util      = require('util'),
    path      = require("path"),
    fs        = require("fs-extra"),
    glob      = util.promisify(require('glob')),
    render    = util.promisify(sass.render),
    modifyFile = require("../utils/modify-file");
    
let compiled;
    
(async () => {
    
    const files = await glob("**/*.sass").then(r => r.filter(file => {
        return path.basename(file)[0] !== "_";
    }));
    
    compiled = await Promise.all(files.map(entry => {
        return render({file: entry});
    }));
    
    compiled = await Promise.all(compiled.map(async entry => {
        
        const {
            map: sourceMap,
            css: transpiledCSS
        } = await postcss(config.plugins).process(entry.css, {
            from: entry.stats.entry
        });
        
        return Object.assign(entry, {css: transpiledCSS, map: sourceMap});
        
    }));
    
    Promise.all(compiled.map(({css, stats: {entry: file}}) => {
        
        return fs.outputFile(modifyFile(file, {
            swapBase  : "dist",
            extension : "css"
        }), css);
        
    }));
    
  
})().catch(e => {

    console.log("HOLY SHIT", e);
    
});