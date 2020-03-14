let [single, ...hex] = String.raw`
    \\[bfnrtv0\`'"\\]
    \\x[a-fA-F0-9]{2}
   (\\u[a-fA-F0-9]{4}){1,}
    \\u\{([0-9a-fA-F]{1,})\}`
    .split("\n").slice(1).map(cur => cur.trim());

let
    escapes = new RegExp(`(${[single].concat(hex).join("|")})`, "gm"),
    uniES6  = new RegExp(`${hex.pop()}`);
    single  = new RegExp(`${single}`);

const singleEscape = seq =>
    (() => ({
        "\\b"  : "\b",
        "\\f"  : "\f",
        "\\n"  : "\n",
        "\\r"  : "\r",
        "\\t"  : "\t",
        "\\v"  : "\v",
        "\\0"  : "\0",
        "\\`"  : "\`",
        "\\'"  : "\'",
        "\\\"" : "\"",
        "\\\\" : "\\"
    }[seq]))();

const convertEscape = seq =>
    single.test(seq)
        ? singleEscape(seq)
        : uniES6.test(seq)
            ? String.fromCodePoint(`0x${seq.split("").slice(3, -1).join("")}`)
            : String.fromCodePoint.apply(
                String, seq.split("\\").slice(1).map(p => `0x${p.substr(1)}`));

module.exports = (strings, ...values) => strings.raw
    .reduce((acc, cur, i) => acc += (values[i-1] || "") + cur, "")
    .split("\n")
    .map(l => /\\$/.test(l.trim()) ? l.slice(0, -1).trim() : l.trim() + " ")
    .join("")
    .replace(escapes, match => convertEscape(match))
    .trim();