"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveUsers_Room = exports.checkUsername_Room = void 0;
const user_1 = require("../data/user");
const checkUsername_Room = (req, res) => {
    const { roomName } = req.params;
    const { username } = req.body;
    console.log(`POST /room/${roomName}/username`);
    if (user_1.roomActiveUsers[roomName] && user_1.roomActiveUsers[roomName][username]) {
        res.status(403).json({ mssg: "Username already in used" });
    }
    else {
        res.status(201).json({ mssg: "Ok" });
    }
};
exports.checkUsername_Room = checkUsername_Room;
const getActiveUsers_Room = (req, res) => {
    const { roomName } = req.params;
    console.log(`GET /room/${roomName}/activeUsers`);
    if (user_1.roomActiveUsers[roomName]) {
        res.status(200).json({ activeUsers: [...Object.keys(user_1.roomActiveUsers[roomName]).map(username => username)] });
    }
    else {
        res.status(200).json({ activeUsers: [] });
    }
};
exports.getActiveUsers_Room = getActiveUsers_Room;
