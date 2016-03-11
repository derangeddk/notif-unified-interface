function requestLogging(req, res, next) {
    console.log("Got a request to %s", req.url, {
        params: req.params,
        body: req.body
    });

    var resultingStatus = 200;
    var oldStatus = res.status;
    res.status = function(status) {
        resultingStatus = status;
        return oldStatus.apply(res, arguments);
    };

    var oldSend = res.send;
    res.send = function(data) {
        console.log("Finished a request with %s:", resultingStatus, data);
        return oldSend.apply(res, arguments);
    };

    next();
}

module.exports = requestLogging;
