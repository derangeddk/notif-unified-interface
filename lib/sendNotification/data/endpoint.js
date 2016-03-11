var sendMessageAndPrettifyResult = require("../sendMessageAndPrettifyResult.js");

function sendDataNotification(req, res) {
    if(!req.body.to) {
        return res.status(400).send({
            error: "Missing `to` argument."
        });
    }
    if(!req.body.type) {
        return res.status(400).send({
            error: "Missing `type` argument."
        });
    }
    if(typeof req.body.collapse === "undefined") {
        return res.status(400).send({
            error: "Missing `collapse` argument."
        });
    }
    if(!req.body.data) {
        return res.status(400).send({
            error: "Missing `data` argument."
        });
    }

    if(req.body.data.notificationType === "undefined") {
        req.body.data.notificationType = req.body.type;
    }

    var messageData = {
        data: req.body.data
    };

    if(req.body.collapse === true) {
        messageData.collapseKey = req.body.type;
    }
    if(req.state.app.appType == "iOS") {
        messageData.priority = "high";
        messageData.contentAvailable = true;
    }

    sendMessageAndPrettifyResult(req.state.app.apiKey, messageData, req.body.to, function(error, result) {
        if(error) {
            console.error("Failed to send notification and prettify result", error);
            return res.status(500).send({
                error: error.prettyErrorMessage
            });
        }
        res.send(result);
    });
}

module.exports = sendDataNotification;
