import { NextPage } from 'next'
import PublicChat from '../components/PublicChat'
import { Box, Button, Stack, Typography } from "@mui/material"
import Link from 'next/link'

const Home: NextPage = () => {
    return (
        <Box>
            <PublicChat />
            <Box mt={4}>
                <Stack direction={"row"} sx={{ alignItems: "center", justifyContent: "center" }}>
                    <Typography>Want to talk about a secret? &nbsp;</Typography>
                    <Link href={"/room"}>
                        <a>
                            <Button variant='contained' color="success" size='small' >Create Room</Button>
                        </a>
                    </Link>
                </Stack>
            </Box>
        </Box>
    )
}

export default Home
