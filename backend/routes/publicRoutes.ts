import express from "express"
import { checkUsername, getActiveUsers } from "../controllers/publicController"

// RELATIVE PATH = "/"
const publicRoutes = express.Router()

publicRoutes.post("/username", checkUsername)

publicRoutes.get("/activeUsers", getActiveUsers)

export default publicRoutes