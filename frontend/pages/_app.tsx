import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Box } from '@mui/material'
import bg from "./../assets/bg.jpg"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Box sx={{background: `url(${bg.src})`, backgroundSize: "cover", height: "100%", minHeight: "100vh"}}>
      <Component {...pageProps} />
    </Box>
  )
}

export default MyApp
