var gcm = require("node-gcm");

function sendMessageAndPrettifyResult(apiKey, messageData, to, callback) {
    var sender = new gcm.Sender(apiKey);
    var msg = new gcm.Message(messageData);

    if(Array.isArray(to)) {
        return sender.send(msg, to, function(error, response) {
            if(error) {
                //TODO: Better error handling of common cases.
                //TODO: Better message when wrong api key, etc...
                callback({
                    prettyErrorMessage: "Failed to send notification",
                    error: error,
                    messageData: messageData
                });
            }
            if(response.failure < 1 && response.canonical_ids < 1) {
                return callback(null, {
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
                        from: to[i],
                        to: result.registration_id
                    });
                    continue;
                }
                if(result.error && result.error == "NotRegistered") {
                    deletedRecipients.push(to[i]);
                    continue;
                }
                if(result.error) {
                    failedDeliveries.push({
                        recipient: to[i],
                        error: result.error
                    });
                    continue;
                }
            }
            callback(null, {
                deletedRecipients: deletedRecipients,
                updatedRecipients: updatedRecipients,
                failedDeliveries: failedDeliveries
            });
        });
    }

    sender.send(msg, { to: to }, function(error, response) {
        if(error) {
            //TODO: Better error handling of common cases.
            //TODO: Better message when wrong api key, etc...
            callback({
                prettyErrorMessage: "Failed to send notification",
                error: error,
                messageData: messageData
            });
        }

        if(!response.message_id) {
            console.warn("Got a response to message with no message id", msg, response);
        }

        if(response.error) {
            if(response.error == "NotRegistered") {
                return callback(null, {
                    deletedRecipients: [ to ],
                    updatedRecipients: [],
                    failedDeliveries: []
                });
            }
            return callback(null, {
                deletedRecipients: [],
                updatedRecipients: [],
                failedDeliveries: [
                    { recipient: to, error: response.error }
                ]
            });
        }

        if(response.registration_id) {
            console.warn("Got a re-registration response", msg, response);
            return callback(null, {
                deletedRecipients: [],
                updatedRecipients: [
                    { from: to, to: response.registration_id }
                ],
                failedDeliveries: []
            });
        }

        callback(null, {
            deletedRecipients: [],
            updatedRecipients: [],
            failedDeliveries: []
        });
    });
}

module.exports = sendMessageAndPrettifyResult;
