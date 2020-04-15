/*
SCRIPT WHICH LOGS MISC MESSAGES
Parameters:
  --success      ||
  --error        ||
  --warning      ||
  --info         boolean   Type of log entry, picks first argument found
  --heading      string    a brief log heading
  --description  string    an oprtional log description
*/

process.env.FORCE_COLOR = true;

const
    logger = require("./logger/logger"),
    argv   = require("yargs").argv,
    levels = ["success", "warning", "error", "info"],
    level  = Object.keys(argv).filter(e => levels.includes(e))[0];

const { heading, description } = argv;

if (!level && !heading) return;

logger[level](heading, description);