var express = require("express");
var bodyParser = require("body-parser");
var requestLogging = require("deranged-express-request-logger");
var indexEndpoint = require("./indexEndpoint.js");
var createAppKey = require("./authentication/createAppKey/endpoint.js");
var deleteAppKey = require("./authentication/deleteAppKey/endpoint.js");
var authenticateApp = require("./authenticateApp.js");
var sendVisibleNotification = require("./sendNotification/visible/endpoint.js");
var sendDataNotification = require("./sendNotification/data/endpoint.js");

var app = express();

app.use(bodyParser.json());
app.use(requestLogging);

app.get("/", indexEndpoint);
app.post("/app", createAppKey);
app.delete("/app/:appToken", deleteAppKey);
app.post("/visible-notification", authenticateApp, sendVisibleNotification);
app.post("/data-notification", authenticateApp, sendDataNotification);

module.exports = app;
