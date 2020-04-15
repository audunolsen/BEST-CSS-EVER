const { babelConfig: snowpackBabelConfing } = require("../config/snowpack.config");

module.exports = {
    plugins: [

        ["snowpack/assets/babel-plugin.js", {
            dir: "web_modules",
            importMap: process.cwd() + "/dist/web_modules/import-map.json"
        }],
        `${process.cwd()}/utils/babel-add-missing-import-ext.js`,

    ]
}