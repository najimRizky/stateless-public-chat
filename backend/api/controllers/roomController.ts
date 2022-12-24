import { Request, Response } from "express"
import { roomActiveUsers } from "../data/user"

export const checkUsername_Room = (req: Request, res: Response) => {
    const { roomName } = req.params
    const { username } = req.body
  
    console.log(`POST /room/${roomName}/username`)
    if (roomActiveUsers[roomName] && roomActiveUsers[roomName][username]) {
        res.status(403).json({ mssg: "Username already in used" })
    } else {
        res.status(201).json({ mssg: "Ok" })
    }
}

export const getActiveUsers_Room = (req: Request, res: Response) => {
    const { roomName } = req.params

    console.log(`GET /room/${roomName}/activeUsers`)
    if (roomActiveUsers[roomName]) {
        res.status(200).json({ activeUsers: [...Object.keys(roomActiveUsers[roomName]).map(username => username)] })
    } else {
        res.status(200).json({ activeUsers: [] })
    }
}