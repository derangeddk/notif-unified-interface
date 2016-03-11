var pkg = require("./package.json");
var express = require("express");
var bodyParser = require("body-parser");
var requestLogging = require("./requestLogging.js");
var sendVisibleNotification = require("./sendVisibleNotification.js");

var app = express();

app.use(bodyParser.json());

app.use(requestLogging);

app.get("/", function(req, res) {
    res.send({ name: "notif-unified-interface", version: pkg.version });
});

app.post("/visible-notification", sendVisibleNotification);

app.listen(3098);
