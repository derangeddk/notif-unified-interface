var gcm = require("node-gcm");
var prettifyMulticastResult = require("./prettifyMulticastResult.js");
var prettifySingleResult = require("./prettifySingleResult.js");

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
        prettifySingleResult(response, to, messageData, callback);
    });
}

module.exports = sendMessageAndPrettifyResult;
