'use client'

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {toSentence} from "../../utils/caseConversion";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import useCurrentUser from "../../hooks/useCurrentUser";
import AvatarUpload from "../avatar/AvatarUpload";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";

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
            <Typography variant="overline">Profile</Typography>

            <Card sx={{maxWidth: 500, width: "100%", p: 2}}>
                <Box>
                    <Typography variant="h5">User details</Typography>
                </Box>

                <List>
                    <ProfileDetail label={"Name"} value={data.name} key={data.name}/>
                    <ProfileDetail label={"Email address"} value={data.email_address} key={data.email_address}/>
                </List>

                <Divider sx={{mb: 3}}/>

                <Box>
                    <Typography variant="h5">Promoter details</Typography>
                </Box>

                <List>
                    <ProfileDetail label={"Name"} value={data.promoter} key={data.promoter}/>
                    <ListItem>
                        <ListItemText
                            sx={{width: "50%"}}
                            primary={"Profile image"}
                            slotProps={{primary: {fontSize: 13, fontWeight: 'bold'}}}/>

                        <Box sx={{width: "50%"}} className="flex gap-3">
                            <Avatar src={data.avatar_url}/>
                            <AvatarUpload/>
                        </Box>
                    </ListItem>
                </List>

            </Card>
        </Container>
    )
}