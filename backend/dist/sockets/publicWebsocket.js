"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../data/user");
const showActiveUser_1 = __importDefault(require("../utils/showActiveUser"));
const publicWebsocket = (socket) => {
    console.log("Welcome to Public Websocket");
    // Event for connected
    socket.on("connected", (username) => {
        console.log(`------- ${username} has connected (${socket.id}) -------`);
        user_1.activeUsers[username] = socket.id;
        (0, showActiveUser_1.default)();
        socket.broadcast.emit("activeUsers", Object.keys(user_1.activeUsers).map(username => username));
    });
    // Event for disconnect
    socket.on("disconnect", () => {
        const username = Object.keys(user_1.activeUsers).find(key => user_1.activeUsers[key] === socket.id);
        delete user_1.activeUsers[username];
        user_1.usersIsTyping.splice(user_1.usersIsTyping.findIndex(user => user === username), 1);
        socket.broadcast.emit("othersIsTyping", user_1.usersIsTyping);
        socket.broadcast.emit("activeUsers", Object.keys(user_1.activeUsers).map(username => username));
        console.log(`------- ${username} has disconnected -------`);
        (0, showActiveUser_1.default)();
    });
    // Event for sendMessage
    socket.on("sendMessage", (data) => {
        socket.broadcast.emit("receiveMessage", data);
    });
    // Event for setting up user isTyping
    socket.on("userIsTyping", (data) => {
        if ((user_1.usersIsTyping.includes(data.user))) {
            if (!data.isTyping) {
                user_1.usersIsTyping.splice(user_1.usersIsTyping.findIndex(user => user === data.user), 1);
            }
        }
        else {
            if (data.isTyping) {
                user_1.usersIsTyping.push(data.user);
            }
        }
        socket.broadcast.emit("othersIsTyping", user_1.usersIsTyping);
    });
};
exports.default = publicWebsocket;
