import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { RoomMessage } from '../utils/globalType'
import ChatApp from './ChatApp'

// Initialize websocket client
const url = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://stateless-public-chat.herokuapp.com")
const nameSpace = "/room"
const socket: Socket = io(url + nameSpace, { autoConnect: false })

interface RoomChatProps {
}

const RoomChat: React.FunctionComponent<RoomChatProps> = () => {
    const router = useRouter()
    const { roomName } = router.query

    useEffect(() => {
        if (roomName) {
            socket.connect()
            socket.emit("connected", roomName)
        }
    }, [roomName])

    useEffect(() => {
        socket.on("receiveMessage", (data) => {
            console.log(data)
        })
    }, [])

    const sendMessage = () => {
        const message: RoomMessage = {
            time: +new Date(),
            from: "",
            roomName: roomName?.toString(),
            mssg: "Halo"

        }
        socket.emit("sendMessage", message)
    }

    return (
        <>
            {/* <ChatApp url={url} socket={socket} /> */}
            <h1>Websocket Room</h1>
            <button onClick={sendMessage}>Send</button>
        </>
    )
}

export default RoomChat