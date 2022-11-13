import { SxProps } from "@mui/material";

// Style for modal box ask username
export const modalStyle: SxProps = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { sm: 400, xs: "90%" },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    ":focus-visible": {
        outline: "unset"
    },
    borderRadius: "10px"
}