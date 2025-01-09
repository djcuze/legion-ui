'use client'

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {toSentence} from "../../utils/caseConversion";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import useCurrentUser from "../../hooks/useCurrentUser";

function ProfileDetail({label, value}) {
    return (
        <ListItem>
            <ListItemText
                sx={{width: "50%"}}
                primary={toSentence(label)}
                slotProps={{primary: {fontSize: 13, fontWeight: 'bold'}}}/>

            <ListItemText
                sx={{m: 0, width: "50%"}}
                primary={value}
                slotProps={{
                    primary: {fontSize: 13, fontWeight: 'medium'}
                }}/>
        </ListItem>
    )
}

export default function Profile() {
    const {data, isFetching} = useCurrentUser()

    if (isFetching) {
        return null
    }

    return (
        <Container sx={{mt: 10, mb: 8}}>
            <Box>
                <Typography variant="h4">Profile</Typography>
            </Box>

            <List sx={{maxWidth: "500px"}}>
                <ProfileDetail label={"Name"} value={data.name} key={data.name}/>
                <ProfileDetail label={"Email address"} value={data.email_address} key={data.email_address}/>
                <ProfileDetail label={"Promoter"} value={data.promoter} key={data.promoter}/>
            </List>
        </Container>
    )
}