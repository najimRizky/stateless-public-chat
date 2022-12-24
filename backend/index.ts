import express, { Express, Request, Response } from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"
import publicWebsocket from "./sockets/publicWebsocket"
import roomWebsockets from "./sockets/roomWebsockets"
import publicRoutes from "./routes/publicRoutes"
import roomRoutes from "./routes/roomRoutes"
import path from "path"

const app: Express = express();
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } })
const port = process.env.PORT || 4000

// =========== REST API LISTENER =========== //
app.get('/', (req: Request, res: Response) => {
    res.sendFile("index.html", {root: path.join(__dirname, 'public')})
});
app.use("/", publicRoutes)
app.use("/room", roomRoutes)
// =========== END OF API LISTENER =========== //

// =========== WEBSOCKETS LISTENER =========== //
io.on("connection", publicWebsocket)
io.of("/room").on("connection", roomWebsockets)
// =========== END OF WEBSOCKETS LISTENER =========== //

server.listen(port, () => {
    console.log('listening on *:4000');
});

export default app