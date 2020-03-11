const
    pkg    = require("../../package.json"),
    cson   = require("cson-parser"),
    fs     = require("fs-extra");
    logger = require("./logger");
    
(async () => {
    
    const
        source  = "scripts.cson",
        scripts = await fs.readFile(source);
        
    try {
        pkg.scripts = cson.parse(scripts);
    } catch(e) {
        throw e.toString().replace(/stdin/, source);
    }
    
    await fs.writeJson("package.json", pkg, {spaces: 2});
    logger.success("YAAAAAA");
    
})().catch(e => {

    logger.clear().error("FAILURE LUL", e.message || e);

});