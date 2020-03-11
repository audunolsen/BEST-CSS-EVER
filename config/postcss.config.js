const
    path = require("path"),
    fs   = require("fs-extra");

production = (ref = process.env.NODE_ENV) && ref.trim() === "production";

module.exports = {
    
    plugins: [
        
        require("postcss-modules")({
            getJSON: (cssFileName, json) => {

                const file = path.format({
                    ...path.parse(path
                        .relative(process.cwd(), cssFileName)
                        .replace("src", "dist")
                    ),
                    base: undefined,
                    ext: '.css.json'
                });
                
                fs.outputFile(file, JSON.stringify(json));
                
            },
            camelCase: true
        }),
        
        require("autoprefixer")(), // Todo browserlist
        
        production && require("cssnano")({preset: "default"})
        
    ].filter(e => e)

};