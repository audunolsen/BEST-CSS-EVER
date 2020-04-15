const
    fs = require("fs-extra"),
    modifyFile = require("../utils/modify-file");

production = process.env?.NODE_ENV?.trim() === "production";

module.exports = {

    plugins: [

        require("postcss-modules")({
            getJSON: (file, json) => {
                fs.outputFile(modifyFile(file, {
                  swapExtension : "sass.js",
                  swapRoot      : "dist"
                }), `export default ${JSON.stringify(json)}`);
            }
        }),

        require("autoprefixer")(), // Todo browserlist
        
        production && require("cssnano")({preset: "default"})

    ].filter(e => e)

};