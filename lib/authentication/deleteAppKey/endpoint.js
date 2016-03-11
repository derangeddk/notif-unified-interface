var kvfs = require("../../kvfs.js")(".data");

function deleteAppKey(req, res) {
    kvfs.del("token_" + req.params.appToken, function(error) {
        if(error && error == "ENOENT") {
            return res.status(404).send({
                error: "Token not found"
            });
        }
        if(error) {
            console.error("Failed to delete token", req.params.appToken);
            return res.status(500).send({
                error: "Failed to delete token"
            });
        }
        res.send();
    });
}

module.exports = deleteAppKey;
