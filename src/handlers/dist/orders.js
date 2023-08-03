"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var order_1 = require("../models/order");
var jsonwebtoken_1 = require("jsonwebtoken");
var auth_1 = require("./auth");
var store = new order_1.OrderStore();
// Route handler to get all orders from the database and send them as a JSON response
var index = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, store.index()];
            case 1:
                orders = _a.sent();
                res.json(orders);
                return [2 /*return*/];
        }
    });
}); };
// Route handler to get a specific order by ID from the database and send it as a JSON response
var show = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var order;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, store.show(_req.params.id)];
            case 1:
                order = _a.sent();
                res.json(order);
                return [2 /*return*/];
        }
    });
}); };
// Route handler to create a new order in the database and send back the newly created order as a JSON response
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var order, authorizationHeader, token, decoded, newOrder, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                order = {
                    status: req.body.status,
                    user_id: 0
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                authorizationHeader = req.headers.authorization;
                token = authorizationHeader.split(' ')[1];
                decoded = jsonwebtoken_1["default"].verify(token, process.env.TOKEN_SECRET);
                if (decoded && decoded.user && decoded.user.id) {
                    order.user_id = decoded.user.id;
                }
                else {
                    throw new Error('Unable to get user ID from the token.');
                }
                return [4 /*yield*/, store.create(order)];
            case 2:
                newOrder = _a.sent();
                res.json(newOrder);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                res.status(400);
                res.json(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Route handler to add a product to an order in the database and send back the added product as a JSON response
var addProduct = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, productId, quantity, addedProduct, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orderId = parseInt(_req.params.id, 10);
                productId = _req.body.productId;
                quantity = parseInt(_req.body.quantity);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.addProduct(quantity, orderId, productId)];
            case 2:
                addedProduct = _a.sent();
                res.json(addedProduct);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                res.status(400);
                res.json(err_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Route handler to update an order's information in the database and send back the updated order as a JSON response
var update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, orderUpdate, updatedOrder, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orderId = parseInt(req.params.id);
                orderUpdate = {
                    status: req.body.status
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.update(orderId, orderUpdate)];
            case 2:
                updatedOrder = _a.sent();
                res.json(updatedOrder);
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                res.status(400);
                res.json(err_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// Define the order routes using the given application instance
var order_routes = function (app) {
    app.get('/orders', index); // Define the GET route for getting all orders
    app.get('/orders/:id', auth_1.verifyAuthToken, show); // Define the GET route for getting a specific order by ID with authentication middleware
    app.post('/orders', auth_1.verifyAuthToken, create); // Define the POST route for creating a new order with authentication middleware
    app.put('/orders/:id', auth_1.verifyAuthToken, update); // Define the PUT route for updating an order by ID with authentication middleware
    app.post('/orders/:id/products', auth_1.verifyAuthToken, addProduct); // Define the POST route for adding a product to an order
};
exports["default"] = order_routes;
