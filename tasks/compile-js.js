const
    terser     = require("terser"),
    util       = require("util"),
    fs         = require("fs-extra"),
    glob       = util.promisify(require('glob')),
    transform  = util.promisify(require('@babel/core').transform),
    
    modifyFile = require("../utils/modify-file"),
    babelConf  = require("../config/babel.config.js");
    
(async () => {
    
    const files = await glob("src/**/*.js");
    
    Promise.all(files.map(async file => {
        
        const contents = await fs.readFile(file, "utf8");
        
        var {code} = await transform(contents, babelConf);
        
        var {code} = terser.minify({[file]: code}, {
            
        });
        
        return fs.outputFile(modifyFile(file, {
            swapBase  : "dist",
            extension : "js"
        }), code);
        
    }));
  
})().catch(e => {

    console.log("HOLY SHIT", e);
    
});