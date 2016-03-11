var pkg = require("./package.json");

function indexEndpoint(req, res) {
    res.send({ name: "notif-unified-interface", version: pkg.version });
}

module.exports = indexEndpoint;
