import { Socket } from "socket.io"
import { roomActiveUsers, roomUserIsTyping } from "../data/user"
import showActiveUsers from "../utils/showActiveUser"

interface RoomMessage {
    time: Date | number,
    from: string | null,
    mssg: string,
    roomName: string
}

const roomWebsockets = (socket: Socket) => {
    console.log("Welcome to Room Websocket")
    socket.on("connected", (data) => {
        console.log(`------- [${data.username} | ${data.roomName}] has connected (${socket.id}) -------`)

        const newUser = { [data.username]: socket.id }
        roomActiveUsers[data.roomName] = { ...roomActiveUsers[data.roomName], ...newUser }

        if (!roomUserIsTyping[data.roomName]) {
            roomUserIsTyping[data.roomName] = []
        }

        showActiveUsers(data.roomName)

        socket.join(data.roomName)
        socket.to(data.roomName).emit("activeUsers", Object.keys(roomActiveUsers[data.roomName]).map(username => username))
    })

    // Event for disconnect
    socket.on("disconnect", () => {
    })

    // Event for disconnecting
    socket.on("disconnecting", () => {
        const roomName = Array.from(socket.rooms)[1]
        const username: any = Object.keys(roomActiveUsers[roomName]).find(key => roomActiveUsers[roomName][key] === socket.id)

        delete roomActiveUsers[roomName][username]
        roomUserIsTyping[roomName].splice(roomUserIsTyping[roomName].findIndex((user: any) => user === username), 1)
        
        socket.to(roomName).emit("othersIsTyping", roomUserIsTyping[roomName])
        socket.to(roomName).emit("activeUsers", Object.keys(roomActiveUsers[roomName]).map(username => username))

        if (Object.keys(roomActiveUsers[roomName]).length === 0) {
            delete roomUserIsTyping[roomName]
            delete roomActiveUsers[roomName]
        }

        console.log(`------- [${username} | ${roomName}] has disconnected -------`)
        
        showActiveUsers(roomName)
    })

    // Event for sendMessage
    socket.on("sendMessage", (data) => {
        socket.to(data.roomName).emit("receiveMessage", data)
    })

    // Event for setting up user isTyping
    socket.on("userIsTyping", (data) => {
        if ((roomUserIsTyping[data.roomName].includes(data.user))) {
            if (!data.isTyping) {
                roomUserIsTyping[data.roomName].splice(roomUserIsTyping[data.roomName].findIndex((user: any) => user === data.user), 1)
            }
        } else {
            if (data.isTyping) {
                roomUserIsTyping[data.roomName].push(data.user)
            }
        }
        socket.to(data.roomName).emit("othersIsTyping", roomUserIsTyping[data.roomName])
    })

}

export default roomWebsockets