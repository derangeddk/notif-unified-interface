var gcm = require("node-gcm");

function sendVisibleNotification(req, res) {
        var sender = new gcm.Sender(req.state.app.apiKey);

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

        var msg = new gcm.Message(messageData);

        if(Array.isArray(req.body.to)) {
            return sender.send(msg, req.body.to, function(error, response) {
                if(error) {
                    //TODO: Better error handling of common cases.
                    //TODO: Better message when wrong api key, etc...
                    console.error("Failed to send notification", messageData, error);
                    return res.status(500).send({
                        error: "Failed to send notification"
                    });
                }
                if(response.failure < 1 && response.canonical_ids < 1) {
                    return res.send({
                        deletedRecipients: [],
                        updatedRecipients: [],
                        failedDeliveries: []
                    });
                }
                var updatedRecipients = [];
                var deletedRecipients = [];
                var failedDeliveries = [];
                for(var i = 0; i < response.results.length; i++) {
                    var result = response.results[i];
                    if(result.registration_id) {
                        updatedRecipients.push({
                            from: req.body.to[i],
                            to: result.registration_id
                        });
                        continue;
                    }
                    if(result.error && result.error == "NotRegistered") {
                        deletedRecipients.push(req.body.to[i]);
                        continue;
                    }
                    if(result.error) {
                        failedDeliveries.push({
                            recipient: req.body.to[i],
                            error: result.error
                        });
                        continue;
                    }
                }
                res.send({
                    deletedRecipients: deletedRecipients,
                    updatedRecipients: updatedRecipients,
                    failedDeliveries: failedDeliveries
                });
            });
        }

        sender.send(msg, { to: req.body.to }, function(error, response) {
            if(error) {
                //TODO: Better error handling of common cases.
                //TODO: Better message when wrong api key, etc...
                console.error("Failed to send notification", messageData, error);
                return res.status(500).send({
                    error: "Failed to send notification"
                });
            }

            if(!response.message_id) {
                console.error("Got a response to message with no message id", msg, response);
            }

            if(response.error) {
                console.error("Got an error response to message", msg, response);
                if(response.error == "NotRegistered") {
                    return res.send({
                        deletedRecipients: [ req.body.to ],
                        updatedRecipients: [],
                        failedDeliveries: []
                    });
                }
                return res.send({
                    deletedRecipients: [],
                    updatedRecipients: [],
                    failedDeliveries: [
                        { recipient: req.body.to, error: response.error }
                    ]
                });
            }

            if(response.registration_id) {
                console.warn("Got a re-registration response", msg, response);
                return res.send({
                    deletedRecipients: [],
                    updatedRecipients: [
                        { from: req.body.to, to: response.registration_id }
                    ],
                    failedDeliveries: []
                });
            }
        });
}

module.exports = sendVisibleNotification;
