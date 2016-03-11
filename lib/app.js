var express = require("express");
var bodyParser = require("body-parser");
var requestLogging = require("./requestLogging.js");
var indexEndpoint = require("./indexEndpoint.js");
var authenticateApp = require("./authenticateApp.js");
var sendVisibleNotification = require("./sendNotification/sendVisibleNotification.js");

var app = express();

app.use(bodyParser.json());
app.use(requestLogging);

app.get("/", indexEndpoint);
app.post("/visible-notification", authenticateApp, sendVisibleNotification);

app.listen(3098);
