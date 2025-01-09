'use client'
import Container from '@mui/material/Container'
import useCurrentUser from '../../hooks/useCurrentUser'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import {getCookie, getHeaders, navigate} from "../actions";
import {useQuery} from "@tanstack/react-query";
import Loading from "../../components/Loading";
import * as React from "react";

const getNetworkPromoters = async (networkId) => {
    const headers = await getHeaders()
    const response = await fetch(`http://localhost:3000/networks/${networkId}/promoters`, {
        method: 'GET',
        headers: headers
    })

    return response.json()
}

export async function checkAuthentication() {
    async function loggedIn() {
        const cookie = await getCookie('authorization');

        return !!cookie?.value
    }
    const isLoggedIn = await loggedIn()

    if (!isLoggedIn) {
        await navigate("/login")
    }
}

export default function Network() {
    const {data: currentUser} = useCurrentUser()

    const {data, isFetching} = useQuery({
        queryKey: ['networkPromoters'],
        queryFn: () => getNetworkPromoters(currentUser.network_id),
    })

    if (isFetching) {
        return (
            <Box sx={{mt: 5}}>
                <Loading/>
            </Box>
        )
    }

    return (
        <Container sx={{mt: 10, mb: 8}}>
            <Box>
                <Typography variant="overline">Network</Typography>
                <Typography variant="h5">{data.network.name}</Typography>
            </Box>

            <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                {data.promoters.map((item) => (
                    <ListItem key={item.id}>
                        <ListItemAvatar>
                            <Avatar alt={item.name} src={item.avatar_url}/>
                        </ListItemAvatar>
                        <ListItemText primary={item.name}/>
                    </ListItem>
                ))}
            </List>
        </Container>
    )
}