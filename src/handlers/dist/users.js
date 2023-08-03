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
var user_1 = require("../models/user");
var jsonwebtoken_1 = require("jsonwebtoken");
var auth_1 = require("./auth");
var store = new user_1.UserStore(); // Create a new instance of the UserStore class
// Route handler to get all users from the database and send them as a JSON response
var index = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authorizationHeader, token, users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                try {
                    authorizationHeader = _req.headers.authorization;
                    token = authorizationHeader.split(' ')[1];
                    jsonwebtoken_1["default"].verify(token, process.env.TOKEN_SECRET);
                }
                catch (err) {
                    res.status(401);
                    res.json('Access denied, invalid token');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, store.index()];
            case 1:
                users = _a.sent();
                res.json(users);
                return [2 /*return*/];
        }
    });
}); };
// Route handler to get a specific user by ID from the database and send it as a JSON response
var show = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.id;
                return [4 /*yield*/, store.show(userId)];
            case 1:
                user = _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); };
// Route handler to create a new user in the database and send back the newly created user as a JSON response
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, newUser, token, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: req.body.password,
                    username: req.body.username
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.create(user)];
            case 2:
                newUser = _a.sent();
                token = jsonwebtoken_1["default"].sign({ user: newUser }, process.env.TOKEN_SECRET);
                res.json(token);
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
// Route handler to update a user's information in the database and send back the updated user as a JSON response
var update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, userUpdate, updatedUser, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = parseInt(req.params.id);
                userUpdate = {
                    username: req.body.username,
                    password: req.body.password,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.update(userId, userUpdate)];
            case 2:
                updatedUser = _a.sent();
                res.json(updatedUser);
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
// Route handler to delete a user from the database by ID and send back the deleted user as a JSON response
var destroy = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deleted, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, store["delete"](req.body.id)];
            case 1:
                deleted = _a.sent();
                res.json(deleted);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                res.status(400);
                res.json(err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// Export the users_routes function as a default export so that it can be imported into other files and used to define the routes for the users API
var users_routes = function (app) {
    app.get('/users', auth_1.verifyAuthToken, index); // Define the GET route for getting all users
    app.get('/users/:id', auth_1.verifyAuthToken, show); // Define the GET route for getting a specific user by ID
    app.post('/users', create); // Define the POST route for creating a new user
    app.put('/users/:id', auth_1.verifyAuthToken, auth_1.verifyDecodedUser, update); // Define the PUT route for updating a user by ID
    app["delete"]('/users/:id', auth_1.verifyAuthToken, destroy); // Define the DELETE route for deleting a user with authentication middleware
};
exports["default"] = users_routes;
