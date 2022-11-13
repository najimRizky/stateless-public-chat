import express, { Express, Request, Response } from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"
import publicWebsocket from "./sockets/publicWebsocket"
import { activeUsers } from "./data/user"
import roomWebsockets from "./sockets/roomWebsockets"

const app: Express = express();
app.use(cors())
app.use(express.json())

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*'} })
const port = process.env.PORT || 4000



// =========== REST API LISTENER =========== //
app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Websocket by Najim</h1>');
});

app.post("/username", (req: Request, res: Response) => {
    const { username } = req.body
    if (activeUsers[username]) {
        res.status(403).json({ mssg: "Username already in used" })
    } else {
        res.status(201).json({ mssg: "Ok" })
    }
})
app.get("/activeUsers", (req: Request, res: Response) => {
    console.log("GET /activeUsers")
    res.status(200).json({ activeUsers: [...Object.keys(activeUsers).map(username => username)] })
})
// =========== END OF API LISTENER =========== //

// =========== WEBSOCKETS LISTENER =========== //
io.on("connection", publicWebsocket)
io.of("/room").on("connection", roomWebsockets)
// =========== END OF WEBSOCKETS LISTENER =========== //

server.listen(port, () => {
    console.log('listening on *:4000');
});

