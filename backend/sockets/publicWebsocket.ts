import { Socket } from "socket.io"
import { activeUsers, usersIsTyping } from "../data/user"
import showActiveUsers from "../utils/showActiveUser"

const publicWebsocket = (socket: Socket) => {
    console.log("Welcome to Public Websocket")
    // Event for connected
    socket.on("connected", (username) => {
        console.log(`------- ${username} has connected (${socket.id}) -------`)
        activeUsers[username] = socket.id

        showActiveUsers()
        socket.broadcast.emit("activeUsers", Object.keys(activeUsers).map(username => username))
    })

    // Event for disconnect
    socket.on("disconnect", () => {
        const username: any = Object.keys(activeUsers).find(key => activeUsers[key] === socket.id)

        delete activeUsers[username]
        usersIsTyping.splice(usersIsTyping.findIndex(user => user === username), 1)

        socket.broadcast.emit("othersIsTyping", usersIsTyping)        
        socket.broadcast.emit("activeUsers", Object.keys(activeUsers).map(username => username))
        
        console.log(`------- ${username} has disconnected -------`)
        
        showActiveUsers()
    })

    // Event for sendMessage
    socket.on("sendMessage", (data) => {
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
}

export default publicWebsocket