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
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import {redirect} from "next/navigation";
import InstagramIcon from "@mui/icons-material/Instagram";
import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import Stack from "@mui/material/Stack";
import HomeIcon from "@mui/icons-material/Home";
import Breadcrumbs from "@mui/material/Breadcrumbs";

export const getNetworkPromoters = async (networkId) => {
    const headers = await getHeaders()
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/networks/${networkId}/promoters`, {
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
        <>
            <Breadcrumbs
                aria-label="breadcrumb"
                sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 2 }}
            >
                <IconButton onClick={() => navigate('/')}>
                    <HomeIcon/>
                </IconButton>
                <Typography
                    onClick={() => navigate('/network')}
                    sx={{ cursor: 'pointer' }}
                >
                    Network
                </Typography>
            </Breadcrumbs>

            <Card sx={{p: 2}}>
                <Typography variant="h5" fontWeight={"bold"}>{data.network.name}</Typography>

                <Divider sx={{mt: 1, mb: 1}}/>

                <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                    {data.promoters.map((item) => (
                        <ListItem key={item.id} sx={{px: 0}}>
                            <ListItemAvatar>
                                <Avatar alt={item.name} src={item.avatar_url}/>
                            </ListItemAvatar>
                            <Stack>
                                <Link href={`/promoters/${item.id}`} underline={"hover"}>{item.name}</Link>
                                <Box sx={{ml: "-7px"}}>
                                    {item.facebook_url && (
                                        <Tooltip title={`${item.name} on Facebook`} arrow placement={"top"}>
                                            <IconButton onClick={() => redirect(item.instagram_url)}>
                                                <FacebookIcon fontSize="small"/>
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {item.instagram_url && (
                                        <Tooltip title={`${item.name} on Instagram`} arrow placement={"top"}>
                                            <IconButton onClick={() => redirect(item.instagram_url)}>
                                                <InstagramIcon fontSize="small"/>
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            </Stack>
                        </ListItem>
                    ))}
                </List>
            </Card>
        </>
    )
}