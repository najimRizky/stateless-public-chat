"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const publicController_1 = require("../controllers/publicController");
// RELATIVE PATH = "/"
const publicRoutes = express_1.default.Router();
publicRoutes.post("/username", publicController_1.checkUsername);
publicRoutes.get("/activeUsers", publicController_1.getActiveUsers);
exports.default = publicRoutes;
