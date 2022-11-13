const express = require('express');
const cors = require("cors")
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io")
const io = new Server(server, { cors: { origin: "*" } })

app.use(express.json())
app.use(cors())

const port = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.send('<h1>Websocket by Najim</h1>');
});


let activeUsers = {}
let usersIsTyping = []

app.post("/username", async (req, res) => {
    const { username } = req.body
    if(activeUsers[username]){
        res.status(403).json({mssg: "Username already in used"})
    } else {
        res.status(201).json({ mssg: "Ok" })
    }
})

app.get("/activeUsers", (req, res) => {
    console.log("GET /activeUsers")
    res.status(200).json({activeUsers: [...Object.keys(activeUsers).map(username => username)]})
})

io.on("connection", (socket) => {
    // Event for connected
    socket.on("connected", (username) => {
        console.log(`------- ${username} has connected (${socket.id}) -------`)
        activeUsers[username] = socket.id

        showActiveUsers()
        socket.broadcast.emit("activeUsers", Object.keys(activeUsers).map(username => username))
    })

    // Event for disconnect
    socket.on("disconnect", () => {
        const username = Object.keys(activeUsers).find(key => activeUsers[key] === socket.id)
        delete activeUsers[username]
        socket.broadcast.emit("activeUsers", Object.keys(activeUsers).map(username => username))
        console.log(`------- ${username} has disconnected -------`)
        showActiveUsers()
    })

    // Event for sendMessage
    socket.on("sendMessage", (data) => {
        // socket.to(activeUsers[data.to]).emit("receiveMessage", data)
        socket.broadcast.emit("receiveMessage", data)
    })

    // Event for setting up user isTyping
    socket.on("userIsTyping", (data) => {
        if ((usersIsTyping.includes(data.user))) {
            if (!data.isTyping) {
                usersIsTyping.splice(usersIsTyping.findIndex(user => user === data.user), 1)
            }
        } else {
            if (data.isTyping) {
                usersIsTyping.push(data.user)
            }
        }
        socket.broadcast.emit("othersIsTyping", usersIsTyping)
    })
})

io
.of("/room")
.on("connection", (socket) => {
    console.log("Welcome to websocket room")
})


server.listen(port, () => {
    console.log('listening on *:4000');
});

const showActiveUsers = () => console.log("Active Users :", activeUsers)
