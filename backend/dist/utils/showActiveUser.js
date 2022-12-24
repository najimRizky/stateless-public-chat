"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../data/user");
const showActiveUsers = (roomName = undefined) => {
    if (roomName) {
        return console.log(`Active Users [${roomName}] :`, user_1.roomActiveUsers[roomName]);
    }
    return console.log("Active Users :", user_1.activeUsers);
};
exports.default = showActiveUsers;
