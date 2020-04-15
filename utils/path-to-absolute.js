const
    slash     = require("slash"),
    {resolve} = require("path");

module.exports = (p) => p ? slash(resolve(p)) : null;