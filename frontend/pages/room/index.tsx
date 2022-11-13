import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

interface IRoomProps {

}

const Room: NextPage<IRoomProps> = (props) => {
    const [roomName, setRoomName] = useState<string>("")
    const router = useRouter()

    const goToRoom = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (roomName.length > 0) {
            router.push(`/room/${roomName}`)
        } else {
            // Do something on error
        }
    }
    return (
        <Container>
            <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
                <form onSubmit={goToRoom}>
                    <Typography component={"h2"} fontSize={32}>Please Enter the Room Name</Typography>
                    <TextField required value={roomName} onChange={(e) => setRoomName(e.target.value)} name="roomName" sx={{ width: "100%", maxWidth: 512 }} variant="standard" type="text" label="Room ID" placeholder="Example: Johny and friends" />
                    <Button type={"submit"} sx={{ width: "100%", maxWidth: 512 }} variant="contained" >Join Room</Button>
                </form>
            </Box>
        </Container>
    )
};

export default Room;
