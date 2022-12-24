"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../data/user");
const showActiveUser_1 = __importDefault(require("../utils/showActiveUser"));
const roomWebsockets = (socket) => {
    console.log("Welcome to Room Websocket");
    socket.on("connected", (data) => {
        console.log(`------- [${data.username} | ${data.roomName}] has connected (${socket.id}) -------`);
        const newUser = { [data.username]: socket.id };
        user_1.roomActiveUsers[data.roomName] = Object.assign(Object.assign({}, user_1.roomActiveUsers[data.roomName]), newUser);
        if (!user_1.roomUserIsTyping[data.roomName]) {
            user_1.roomUserIsTyping[data.roomName] = [];
        }
        (0, showActiveUser_1.default)(data.roomName);
        socket.join(data.roomName);
        socket.to(data.roomName).emit("activeUsers", Object.keys(user_1.roomActiveUsers[data.roomName]).map(username => username));
    });
    // Event for disconnect
    socket.on("disconnect", () => {
    });
    // Event for disconnecting
    socket.on("disconnecting", () => {
        const roomName = Array.from(socket.rooms)[1];
        const username = Object.keys(user_1.roomActiveUsers[roomName]).find(key => user_1.roomActiveUsers[roomName][key] === socket.id);
        delete user_1.roomActiveUsers[roomName][username];
        user_1.roomUserIsTyping[roomName].splice(user_1.roomUserIsTyping[roomName].findIndex((user) => user === username), 1);
        socket.to(roomName).emit("othersIsTyping", user_1.roomUserIsTyping[roomName]);
        socket.to(roomName).emit("activeUsers", Object.keys(user_1.roomActiveUsers[roomName]).map(username => username));
        if (Object.keys(user_1.roomActiveUsers[roomName]).length === 0) {
            delete user_1.roomUserIsTyping[roomName];
            delete user_1.roomActiveUsers[roomName];
        }
        console.log(`------- [${username} | ${roomName}] has disconnected -------`);
        (0, showActiveUser_1.default)(roomName);
    });
    // Event for sendMessage
    socket.on("sendMessage", (data) => {
        socket.to(data.roomName).emit("receiveMessage", data);
    });
    // Event for setting up user isTyping
    socket.on("userIsTyping", (data) => {
        if ((user_1.roomUserIsTyping[data.roomName].includes(data.user))) {
            if (!data.isTyping) {
                user_1.roomUserIsTyping[data.roomName].splice(user_1.roomUserIsTyping[data.roomName].findIndex((user) => user === data.user), 1);
            }
        }
        else {
            if (data.isTyping) {
                user_1.roomUserIsTyping[data.roomName].push(data.user);
            }
        }
        socket.to(data.roomName).emit("othersIsTyping", user_1.roomUserIsTyping[data.roomName]);
    });
};
exports.default = roomWebsockets;
