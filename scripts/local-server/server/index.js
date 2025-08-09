const start = require("./server");
const { Handler } = require("./handlers");
const process = require('process');

const rootDir = process.argv[2];
const contentDir = process.argv[3];
process.chdir(rootDir);
const ip = process.argv[4];
const port = process.argv[5];
console.log("Running from: " + rootDir);

let handlerConfig = 
{
    root: rootDir,
    contentPath: contentDir,
    port: port,
    location: ip
}
console.log("Handler Config");
console.log("root: " + handlerConfig.root);
console.log("contentPath: " + handlerConfig.contentPath);
console.log("port: " + handlerConfig.port);
console.log("location: " + handlerConfig.location);

const handler = new Handler(handlerConfig);

// start the server
start(handler);