module.exports = {

  pugInterpolation  : /\!{[^}]*}|\\#\[[^\]]*\]/gm,
  pugUnbufferedCode : /[\w\-:]*!=/gm,

  jsImports        : /import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*;$/gm,
  reactFrags       : /React\.Fragment(?=([^"]*"[^"]*")*[^"]*$)/g

}