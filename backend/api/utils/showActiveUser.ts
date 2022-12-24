import { activeUsers, roomActiveUsers } from "../data/user"

const showActiveUsers = (roomName: string | undefined = undefined) => {
    if (roomName) {
        return console.log(`Active Users [${roomName}] :`, roomActiveUsers[roomName])
    }
    return console.log("Active Users :", activeUsers)
}

export default showActiveUsers
