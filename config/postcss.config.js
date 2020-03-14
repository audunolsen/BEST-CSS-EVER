const
    fs = require("fs-extra"),
    modifyFile = require("../utils/modify-file");

production = (process.env.NODE_ENV || "").trim() === "production";

module.exports = {

    plugins: [

        require("postcss-modules")({
            getJSON: (file, json) => {

                fs.outputFile(modifyFile(file, {
                  extension : "sass.js",
                  swapBase  : "dist"
                }), `export default ${JSON.stringify(json)}`);

            },
            camelCase: true
        }),

        require("autoprefixer")(), // Todo browserlist

        production && require("cssnano")({preset: "default"})

    ].filter(e => e)

};