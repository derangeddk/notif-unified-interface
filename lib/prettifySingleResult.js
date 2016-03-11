function prettifySingleResult(response, to, msg, callback) {
    if(!response.message_id) {
        console.warn("Got a response to message with no message id", to, msg, response);
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
        console.warn("Got a re-registration response", to, msg, response);
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
}

module.exports = prettifySingleResult;
