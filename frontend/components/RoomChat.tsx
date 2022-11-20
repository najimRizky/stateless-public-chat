import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { RoomMessage } from '../utils/globalType'
import ChatApp from './ChatApp'

// Initialize websocket client
const nameSpace = "/room"
const url = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://stateless-public-chat.herokuapp.com") + nameSpace
const socket: Socket = io(url, { autoConnect: false })

interface RoomChatProps {
}

const RoomChat: React.FunctionComponent<RoomChatProps> = () => {
    const router = useRouter()
    const { roomName } = router.query

    return (
        <>
            {roomName && <ChatApp  url={url} socket={socket} roomName={roomName?.toString()}  />}
            
        </>
    )
}

export default RoomChat