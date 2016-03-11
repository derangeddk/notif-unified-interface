function prettifyMulticastResult(response, to, callback) {
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
}

module.exports = prettifyMulticastResult;
