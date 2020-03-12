module.exports = {

  pugInterpolation : /\\#{[^}]*}|\\#\[[^\]]*\]/gm,
  jsImports        : /import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*;$/gm

}