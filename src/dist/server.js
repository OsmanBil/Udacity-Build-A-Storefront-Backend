"use strict";
exports.__esModule = true;
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var users_1 = require("./handlers/users");
var products_1 = require("./handlers/products");
var orders_1 = require("./handlers/orders");
var app = express_1["default"]();
var address = "0.0.0.0:3000";
app.use(body_parser_1["default"].json());
app.get('/', function (req, res) {
    res.send('Main Route is working');
});
users_1["default"](app);
products_1["default"](app);
orders_1["default"](app);
app.listen(3000, function () {
    console.log("starting app on: " + address);
});
