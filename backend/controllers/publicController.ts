import { Request, Response } from "express"
import { activeUsers } from "../data/user"

export const checkUsername = (req: Request, res: Response) => {
    console.log("POST /username")
    const { username } = req.body
    if (activeUsers[username]) {
        res.status(403).json({ mssg: "Username already in used" })
    } else {
        res.status(201).json({ mssg: "Ok" })
    }
}

export const getActiveUsers = (req: Request, res: Response) => {
    console.log("GET /activeUsers")
    res.status(200).json({ activeUsers: [...Object.keys(activeUsers).map(username => username)] })
} 