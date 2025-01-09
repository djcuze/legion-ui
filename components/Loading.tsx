import Box from "@mui/material/Box";
import {CircularProgress} from "@mui/material";
import Typography from "@mui/material/Typography";

export default function Loading() {
    return (
        <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            sx={{height: "200px"}}
            alignItems="center">
            <CircularProgress color={"inherit"}/>
            <Typography sx={{mt: 2}} variant="button">Loading</Typography>
        </Box>
    )
}