"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveUsers = exports.checkUsername = void 0;
const user_1 = require("../data/user");
const checkUsername = (req, res) => {
    console.log("POST /username");
    const { username } = req.body;
    if (user_1.activeUsers[username]) {
        res.status(403).json({ mssg: "Username already in used" });
    }
    else {
        res.status(201).json({ mssg: "Ok" });
    }
};
exports.checkUsername = checkUsername;
const getActiveUsers = (req, res) => {
    console.log("GET /activeUsers");
    res.status(200).json({ activeUsers: [...Object.keys(user_1.activeUsers).map(username => username)] });
};
exports.getActiveUsers = getActiveUsers;
