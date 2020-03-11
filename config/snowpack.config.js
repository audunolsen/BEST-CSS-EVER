module.exports = {
    installOptions: {
        "dest": "dist/web_modules",
    },
    
    snowpackBabelConf: {
        dir: "web_modules",
        importMap: process.cwd() + "/dist/web_modules/import-map.json"
    }
    
}