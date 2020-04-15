const
    pkg         = require("../package.json"),
    logger      = require("./logger/logger"),
    fs          = require("fs-extra"),
    {parse}     = require("cson-parser"),
    {key, file} = require("yargs").argv;
    
(async () => {
    
    const cson = await fs.readFile(file, "utf8");
    
    try { pkg[key] = parse(cson) }
    catch(e) { throw e.toString().replace(/stdin/, file) }
    
    await fs.writeJson("package.json", pkg, {spaces: 2});
    logger.success(`"${key}" field added to package.json\n`);
    
})().catch(e => logger
    .clear()
    .error(`Failed to add ${key} field to package.json`, e.message || e)
);