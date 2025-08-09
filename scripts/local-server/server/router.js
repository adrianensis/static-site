function route(path, res, handler, payload) {
    console.log(`Routing request for '${path}'`);
    return handler.handle(path, res, payload);
}

module.exports = route;