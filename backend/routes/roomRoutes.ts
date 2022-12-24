import express from "express"
import { checkUsername_Room, getActiveUsers_Room } from "../controllers/roomController"

// RELATIVE PATH = "/room/:roomName"
const roomRoutes = express.Router()

roomRoutes.post("/:roomName/username", checkUsername_Room)

roomRoutes.get("/:roomName/activeUsers", getActiveUsers_Room)

export default roomRoutes