import { io, Socket } from 'socket.io-client'
import ChatApp from './ChatApp'

// Initialize websocket client
const url =  process.env.NEXT_PUBLIC_API_BASE_URL || "https://stateless-public-chat.herokuapp.com"
const socket: Socket = io(url, { autoConnect: false })

interface PublicChatProps{

}

const PublicChat: React.FunctionComponent<PublicChatProps> = () => {
    return(
        <>
            <ChatApp url={url} socket={socket} />
        </>
    )
}

export default PublicChat