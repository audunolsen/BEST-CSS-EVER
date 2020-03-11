const { snowpackBabelConf } = require("../config/snowpack.config");

module.exports = {
    plugins: [
        ["snowpack/assets/babel-plugin.js", snowpackBabelConf]
    ]
}