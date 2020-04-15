const
    chalk  = require("chalk"),
    length = require('string-length'),
    size   = require('term-size');
    time   = () => chalk.bold(Date().slice(16,24)),
    logger = {};
    
const support =
    process.platform !== 'win32' ||
    process.env.CI ||
    process.env.TERM === 'xterm-256color';

const levels = {
    success: {
        color: "green",
        glyph: support ? "✓" : "√"
    },
    error: {
        color: "red",
        glyph: support ? "✖" : "×"
    },
    warning: {
        color: "yellow",
        glyph: support ? "▲" : "!"
    },
    info: {
        color: "blue",
        glyph: support ? "●" : "i"
    }
}

for (const [level, {color, glyph}] of Object.entries(levels)) {

        logger[level] = function(heading, description) {

        heading = `${time()} | ${chalk.bold[color](`${glyph} ${heading}`)}`;
        console.log(heading);

        const hr = chalk.bold.gray("·").repeat(size().columns);
        
        if (description) {
            console.log(hr);
            console.log(description, "\n")
        }

        return this;

    }

}

logger.clear = function() {
    console.log("\x1B[2J\x1B[s3J\x1B[H\x1Bc");

    /* Windows (?) bug. Can't chain other methods calls after clear.
     For some reason the method chained after clear, is
     ironically also cleard. Wierd!*/

    return this;
}

logger.icons = Object.fromEntries(
    Object.entries(levels)
    .map(([k, {glyph, color}]) => [k, chalk.bold[color](glyph)])
);

module.exports = logger;