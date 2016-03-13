var kvfs = require("kvfs")(".data");
var crypto = require("crypto");

function createAppKey(req, res) {
    if(!req.body.apiKey) {
        return res.status(400).send({
            error: "Missing `apiKey` argument"
        });
    }
    if(!req.body.appType) {
        return res.status(400).send({
            error: "Missing `appType` argument"
        });
    }
    if(req.body.appType != "iOS" && req.body.appType != "Android") {
        return res.status(400).send({
            error: "Invalid value for `appType`. MUST be \"Android\" or \"iOS\""
        });
    }

    crypto.randomBytes(64, function(error, buffer) {
        if(error) {
            console.error("Failed to generate random token", error);
            return res.status(500).send({
                error: "Failed to create app key"
            });
        }

        var token = buffer.toString("hex");

        var data = {
            apiKey: req.body.apiKey,
            appType: req.body.appType
        };

        kvfs.set("token_" + token, data, function(error) {
            if(error) {
                console.error("Failed to save token data", error, token, data);
                return res.status(500).send({
                    error: "Failed to create app key"
                });
            }
            res.send({
                appToken: token
            });
        });
    });
}

module.exports = createAppKey;
