var kvfs = require("./kvfs.js")(".data");

function authenticateApp(req, res, next) {
    var appToken = req.get("App-Token");
    if(!appToken) {
        return res.status(401).send({
            error: "Missing App-Token"
        });
    }

    kvfs.get("token_" + appToken, function(error, app) {
        if(error && error == "ENOENT") {
            return res.status(401).send({
                error: "Invalid App-Token"
            });
        }
        if(error) {
            console.error("Failed to read app token " + appToken, error);
            return res.status(500).send({
                error: "Failed to authenticate"
            });
        }

        if(!req.state) {
            req.state = {};
        }
        req.state.app = app;

        next();
    });
}

module.exports = authenticateApp;
