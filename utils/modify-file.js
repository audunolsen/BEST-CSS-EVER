const 
    stripDirs = require("strip-dirs"),
    { format, parse, extname, basename, normalize } = require("path");

module.exports = function(file, {swapExtension: ext, swapRoot: root} = {}) {
    
    if (!file) return;
    
    if (file[0] === "/") file = file.slice(1);
    if (root) root = root.replace(/\/$/, "") + "/";
    
    return normalize(format({
        
        name: basename(file, ext ? extname(file) : undefined),
        
        dir: root || root === ""
            ? root + stripDirs(`${parse(file).dir}/`, 1)
            : parse(file).dir,
        
        ...ext && {ext: "." + ext.replace(/^\./, "")},
        
    }));

}