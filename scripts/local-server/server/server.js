const http = require("http");
const { Handler } = require("./handlers");
const router = require("./router");

function start(handler) {

    if(handler === null || handler === undefined)
    {
        console.error("Handler is invalid.");
    }

    if(handler.config === null || handler.config === undefined)
    {
        console.error("Handler Config is invalid.");
    }

    function handleReq(req, res) {
        const path = req.url;
        console.log(`Request received from '${req.client.remoteAddress}'`);
        console.log(`Request received for '${req.url}'`);

        // Listen for data sent to the server with the 'data' event
        let data = "";
        req.on("data", (payload) => {
            data += payload;
        });

        // When the data has been consumed, route the request
        req.on("end", () => {
            router(path, res, handler, data);
        });
    }
    http.createServer(handleReq).listen(handler.config.port, () => {
        console.log(`Listening on port ${handler.config.port}`);
    });
}

module.exports = start;