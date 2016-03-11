var gcm = require("node-gcm");
var prettifyMulticastResult = require("./prettifyMulticastResult.js");

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
            prettifyMulticastResult(response, to, callback);
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
