const
    http  = require("http"),
    url   = require("url"),
    fs    = require("fs-extra"),
    mime  = require("mime"),
    path  = require("path"),
    open  = require("open"),
    chalk = require("chalk");

const port = 8080

function onRequest(req, res) {(async () => {
        
    let
        pathname = path.join("./dist", path.normalize(url.parse(req.url).path)),
        stats    = await fs.stat(pathname);

    if (stats.isDirectory()) {
        pathname = path.normalize(`${pathname}/index.html`);
        const hasIndex = await fs.exists(pathname);

        if (!hasIndex) throw "No index file found";
    }

    stream = fs.createReadStream(pathname);

    res.writeHead(200, {"Content-Type": mime.getType(pathname)});
    stream.pipe(res);    
        
})().catch(e => {
        
    console.log(`Wut? \n\n${e}`)
    res.writeHead(404)
    res.end("404 Not Found")
        
})};

const server = http.createServer(onRequest).listen(port, () => {
    
    let uri = `http://localhost:${port}`;
    
    open(uri);
    console.log(`Project is now running at\n ${chalk.green.bold(uri)}`);
    
});