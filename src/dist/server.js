"use strict";
exports.__esModule = true;
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var users_1 = require("./handlers/users");
var products_1 = require("./handlers/products");
var orders_1 = require("./handlers/orders");
var app = express_1["default"](); // Create an Express application (App)
var address = "0.0.0.0:3000"; // The address and port on which the server will run
app.use(body_parser_1["default"].json()); // Use the bodyParser middleware to parse the request body if it is in JSON format
// Define a route handler for the main endpoint ('/') of the server
app.get('/', function (req, res) {
    res.send('Main Route is working');
});
// Connect the user routes handler, product routes handler, and order routes handler to the Express app
users_1["default"](app);
products_1["default"](app);
orders_1["default"](app);
// Start the server and make it listen for incoming connections on port 3000
app.listen(3000, function () {
    console.log("starting app on: " + address);
});
