import { Container, Typography, Box, TextField, Button, Stack, Paper, Modal, FormControlLabel, Checkbox, Grid, CircularProgress } from '@mui/material'
import { io, Socket } from 'socket.io-client'
import { useEffect, useState } from 'react'
import moment from 'moment'
import { Circle, Send } from '@mui/icons-material'
import { AnimatePresence, motion } from "framer-motion"
import { modalStyle } from '../styles/global'
import { Message } from '../utils/globalType'

interface ChatAppProps {
    url: string,
    socket: Socket
}

const ChatApp: React.FunctionComponent<ChatAppProps> = ({ url, socket }) => {
    // This user username
    const [username, setUsername] = useState<string>("")
    // All users messages
    const [messages, setMessages] = useState<Message[]>([])
    // This user message
    const [message, setMessage] = useState<string>("")
    // This user isTyping
    const [userIsTyping, setUserIsTyping] = useState<boolean>(false)
    // Others Users isTyping
    const [othersIsTyping, setOthersIsTyping] = useState<string[]>([])
    // Active Users
    const [activeUsers, setActiveUsers] = useState<string[]>([])

    // Update messages 
    const updateMessages = (newMessage: Message) => {
        setMessages(messages => {
            return [...messages, newMessage]
        })
    }

    // Connect User to server
    const connectUser = (usernameTmp: string) => {
        socket.connect()
        socket.emit("connected", usernameTmp)
        setUsername(usernameTmp)
        getActiveUsers(usernameTmp)
    }

    // Get Active Users on inital
    const getActiveUsers = async (usernameTmp: string) => {
        const response = await fetch(url + "/activeUsers")
        const data = await response.json()
        setActiveUsers([usernameTmp, ...data.activeUsers])
    }

    // Listener for Receive messages, othersIsTyping from server (realtime)
    useEffect(() => {
        socket.on("receiveMessage", (data) => {
            updateMessages(data)
        })
        socket.on("activeUsers", (data) => {
            setActiveUsers(data)
        })
        return () => {
            socket.off('receiveMessage');
            socket.off('activeUsers');
        }
    }, [])

    useEffect(() => {
        scrollDownMessages()
    }, [messages, othersIsTyping])

    // Receive users isTyping status from server (realtime)
    useEffect(() => {
        socket.on("othersIsTyping", (data: string[]) => {
            if (data.includes(username)) {
                data.splice(data.findIndex(user => user === username), 1)
                setOthersIsTyping(data)
            } else {
                setOthersIsTyping(data)
            }
        })
        return () => {
            scrollDownMessages()
            socket.off('othersIsTyping');
        }
    }, [othersIsTyping])

    // Basic function for scroll down
    const scrollDownMessages = () => {
        const element: Element = document.getElementsByClassName("messagesBox")[0]
        if (element) {
            element.scrollTo(0, element.scrollHeight)
        }
    }

    // Function for send message
    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (message !== "") {
            const data: Message = {
                time: +new Date(),
                from: username,
                mssg: message,
            }
            socket.emit("sendMessage", data)
            updateMessages(data)
            setMessage("")
            setUserIsTyping(false)
        }
    }


    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
    }

    // Hooks for message change and Set|unset this user isTyping
    useEffect(() => {
        if (message !== "") setUserIsTyping(true)
        const delay = setTimeout(() => {
            setUserIsTyping(false)
        }, 3000)

        return () => clearTimeout(delay)
    }, [message])

    useEffect(() => {
        if (userIsTyping) {
            socket.emit("userIsTyping", { user: username, isTyping: true })
        } else {
            socket.emit("userIsTyping", { user: username, isTyping: false })
        }
    }, [userIsTyping])

    return (
        <>
            <Container sx={{ mt: 6 }} >
                <Box>
                    <Typography component={"h1"} textAlign="center" fontSize={36} >Welcome to Stateless Public Messages! 🖐</Typography>
                    <Typography sx={{ textDecoration: "underline", textAlign: "center", fontSize: 16 }} >Username: {username}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <Grid container sx={{ maxWidth: 700, width: "90vw" }} spacing={2}>
                        <Grid item sm={4} xs={12}>
                            <Paper sx={{ overflowY: "hidden", bgcolor: "rgba(0,0,0,0.1)", height: { sm: "400px", xs: "150px" } }}>
                                <Box sx={{ bgcolor: "primary.light" }}>
                                    <Typography sx={{ color: "#fff", py: "6px", display: "flex", alignItems: "center", justifyContent: "center" }} >Active Users &nbsp; <Circle sx={{ color: "#4aff53" }} fontSize='inherit' /> </Typography>
                                </Box>
                                <Box sx={{ overflowY: "auto", height: "100%" }}>
                                    {activeUsers.length !== 0 && activeUsers.map((user, id) =>
                                        <Box key={id} sx={{ p: 1, borderBottom: "1px solid rgba(0,0,0,0.2)", ":hover": { bgcolor: "rgba(0,0,0,0.1)", cursor: "pointer" } }}>
                                            <Typography>{user === username ? `${user} (You)` : user}</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item sm={8} xs={12}>
                            <form action="" onSubmit={sendMessage} style={{ height: "400px", display: 'flex', flexDirection: "column" }}>
                                <Paper sx={{ p: 2, height: "100%", overflowY: "auto", bgcolor: "rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "20px", }} className='messagesBox'>
                                    <AnimatePresence>
                                        {messages && messages.map((message, id) =>
                                            <Box component={motion.div} initial={{ scale: 0 }} animate={{ scale: 1 }} className='messageItem' key={id}
                                                sx={{
                                                    bgcolor: message.from === username ? "#c3e1ff" : "#fff",
                                                    alignSelf: message.from === username ? "end" : "start",
                                                    p: 1,
                                                    borderRadius: "10px",
                                                    width: "80%",
                                                }}>
                                                <Typography component={"h3"} sx={{ m: 0 }} fontSize={14}>
                                                    <strong style={{}}>{message.from === username ? "You" : message.from}</strong>
                                                    <span style={{ fontSize: "10px" }}> - {moment(message.time).format("ddd, DD MMM h:mm A")}</span>
                                                </Typography>
                                                <Typography component={"p"} fontSize={14}>
                                                    {message.mssg}
                                                </Typography>
                                            </Box>
                                        )}
                                    </AnimatePresence>
                                    {othersIsTyping.length !== 0 &&
                                        <motion.i animate={{ opacity: [0.5, 1] }} transition={{ ease: "linear", repeat: Infinity, repeatType: "reverse" }}>{othersIsTyping.join(", ")} is typing ...</motion.i>
                                    }
                                </Paper>
                                <Stack sx={{ gap: 2, mt: 2 }} direction={"row"}>
                                    <TextField
                                        id="filled-disabled"
                                        label="Message"
                                        variant="filled"
                                        value={message}
                                        onChange={handleMessageChange}
                                        placeholder="Send any message here.."
                                        fullWidth
                                        size='small'
                                    />
                                    <Button sx={{ px: 3 }} type="submit" variant='contained' endIcon={<Send />} >Send</Button>
                                </Stack >
                            </form>
                        </Grid>
                    </Grid>
                </Box>
            </Container>

            <ModalGetUsername connectUser={connectUser} url={url} />
        </>
    )
}

interface ModalGetUsernameProps {
    connectUser: (usernameTmp: string) => void,
    url: string
}

const ModalGetUsername: React.FunctionComponent<ModalGetUsernameProps> = ({ connectUser, url }) => {
    // State for request username
    const [requestUsername, setRequestUsername] = useState<string>("")
    const [rememberUsername, setRememberUsername] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [isSubmittingUsername, setIsSubmittingUsername] = useState<boolean>(false)

    // State for modal box close/open
    const [openModal, setOpenModal] = useState<boolean>(true);

    // Hook for initialization (ask/check username at the beginning)
    useEffect(() => {
        let usernameTmp: string | null | undefined = window.localStorage.getItem("username")
        if (usernameTmp) {
            connectUser(usernameTmp)
            setOpenModal(false)
        }
    }, [])

    // Handle user change Request Username
    const handleChangeRequestUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRequestUsername(e.target.value)
        setError("")
    }

    // Function for submit username
    const submitUsername = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (requestUsername !== "") {
            setIsSubmittingUsername(true)
            const response = await fetch(url + "/username", {
                method: "POST",
                body: JSON.stringify({ username: requestUsername }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                const data = await response.json()
                setError(data.mssg)
            } else {
                if (rememberUsername) window.localStorage.setItem("username", requestUsername)
                connectUser(requestUsername)
                setOpenModal(false)
            }

            setRequestUsername("")
            setIsSubmittingUsername(false)
        }
    }

    // UI Modal
    return (
        <Modal
            open={openModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Enter your Username
                </Typography>
                <form onSubmit={(e) => { submitUsername(e); }} >
                    <TextField onChange={handleChangeRequestUsername} value={requestUsername} fullWidth id="outlined-basic" label="Username" variant="standard" error={error !== ""} helperText={error} />
                    <FormControlLabel control={<Checkbox onChange={() => { setRememberUsername(!rememberUsername) }} checked={rememberUsername} />} label="Remamber Username?" />
                    <Button variant='contained' type='submit' fullWidth disabled={isSubmittingUsername} >{isSubmittingUsername ? <CircularProgress size={"24px"} sx={{ color: "#000" }} /> : "Submit Username"}</Button>
                </form>
            </Box>
        </Modal >
    )
}

export default ChatApp;