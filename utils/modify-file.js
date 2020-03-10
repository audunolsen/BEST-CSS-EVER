const
  stripDirs = require('strip-dirs'),
  path      = require('path');

module.exports = function(file, {extension = "", swapBase = ""}) {

  extension = extension[0] === "." ?  extension : `.${extension}`;
  swapBase  = swapBase.slice(-1) === "/" ? swapBase : `${swapBase}/`;

  file = path.relative(process.cwd(), file);

  if (swapBase) file = swapBase + stripDirs(file, 1);

  return path.format({
      ...path.parse(file),
      base: undefined,
      ext: extension
  });

}