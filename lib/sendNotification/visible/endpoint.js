var sendMessageAndPrettifyResult = require("../sendMessageAndPrettifyResult.js");

function sendVisibleNotification(req, res) {
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
    if(!req.body.collapse) {
        return res.status(400).send({
            error: "Missing `collapse` argument."
        });
    }
    if(!req.body.body) {
        return res.status(400).send({
            error: "Missing `body` argument."
        });
    }

    var messageData = {
        data: {
            notificationType: req.body.type
        },
        notification: {
            body: req.body.body
        }
    };

    if(req.body.collapse === true) {
        messageData.collapseKey = req.body.type;
    }
    if(req.body.title) {
        messageData.notification.title = req.body.title;
    }
    if(req.state.app.appType == "iOS") {
        messageData.priority = "high";
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

module.exports = sendVisibleNotification;
