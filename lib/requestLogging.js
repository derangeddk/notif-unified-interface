function requestLogging(req, res, next) {
    var requestStarted = new Date();
    console.log("%s: Got a request to %s", requestStarted.toISOString(), req.url, {
        params: req.params,
        body: req.body,
        query: req.query
    });

    var resultingStatus = 200;
    var oldStatus = res.status;
    res.status = function(status) {
        resultingStatus = status;
        return oldStatus.apply(res, arguments);
    };

    var oldSend = res.send;
    res.send = function(data) {
        var requestEnded = new Date();
        var msElapsed = requestEnded.getTime() - requestStarted.getTime();
        console.log("%s: Finished a request in %s ms with %s:", requestEnded.toISOString(), msElapsed, resultingStatus, data || "");
        return oldSend.apply(res, arguments);
    };

    next();
}

module.exports = requestLogging;
