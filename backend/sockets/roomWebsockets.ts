import { Socket } from "socket.io"

interface RoomMessage{
    time: Date | number,
    from: string | null,
    mssg: string,
    roomName: string
}

const roomWebsockets = (socket: Socket) => {
    socket.on("connected", (id) => {
        // console.log(`------- ${username} has connected (${socket.id}) -------`)
        console.log("id:", id)
        socket.join(id)
        // socket.emit("feedback", "Halo")
        // showActiveUsers()
        // socket.broadcast.emit("activeUsers", Object.keys(activeUsers).map(username => username))
    })

    socket.on("sendMessage", (data: RoomMessage) => {
        console.log(data)
        socket.to(data.roomName).emit("receiveMessage", data)
    })
}

export default roomWebsockets