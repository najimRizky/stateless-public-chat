"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roomController_1 = require("../controllers/roomController");
// RELATIVE PATH = "/room/:roomName"
const roomRoutes = express_1.default.Router();
roomRoutes.post("/:roomName/username", roomController_1.checkUsername_Room);
roomRoutes.get("/:roomName/activeUsers", roomController_1.getActiveUsers_Room);
exports.default = roomRoutes;
