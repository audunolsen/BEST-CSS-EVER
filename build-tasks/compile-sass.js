const
    sass      = require("sass"),
    util      = require('util'),
    path      = require("path"),
    fs        = require("fs-extra"),
    glob      = util.promisify(require('glob')),
    render    = util.promisify(sass.render);
    
(async () => {
    
    const files = await glob("**/*.sass").then(r => r.filter(file => {
        return path.basename(file)[0] !== "_";
    }));
    
    const compiled = await Promise.all(files.map(entry => {
        return render({file: entry});
    }));
    
    Promise.all(compiled.map(c => {
        
        const outFile = path.format({
            ...path.parse(c.stats.entry.replace("src", "dist")),
            base: undefined,
            ext: '.css'
        });
        
        return fs.outputFile(outFile, c.css);
        
    }));
    
    
  
})().catch(e => {

    console.log("HOLY SHIT", e);
    
});