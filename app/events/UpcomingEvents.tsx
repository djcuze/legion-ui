'use client'

import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import dayjs from "../../utils/dayjs";
import ListItemText from "@mui/material/ListItemText";
import {useQuery} from "@tanstack/react-query";
import {getHeaders} from "../actions";
import Loading from "../../components/Loading";
import Avatar from "@mui/material/Avatar";
import * as React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import {IconButton} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import Tooltip from "@mui/material/Tooltip";
import EditIcon from '@mui/icons-material/Edit';
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";

function IconLinks({event}) {
    return (
        <Box sx={{ml: "-7px"}}>
            {event.facebook_url ? (
                <Tooltip
                    title={"View on Facebook"}
                    placement={"top"}
                    slotProps={{
                        popper: {
                            modifiers: [
                                {
                                    name: 'offset',
                                    options: {
                                        offset: [0, -10],
                                    },
                                },
                            ],
                        },
                    }}
                    arrow>
                    <IconButton size={"small"} onClick={() => window.open(event.facebook_url)}>
                        <FacebookIcon fontSize="inherit"/>
                    </IconButton>
                </Tooltip>
            ) : null}
            {event.ticket_url ? (
                <Tooltip
                    title={"Buy tickets"}
                    placement={"top"}
                    slotProps={{
                        popper: {
                            modifiers: [
                                {
                                    name: 'offset',
                                    options: {
                                        offset: [0, -10],
                                    },
                                },
                            ],
                        },
                    }}
                    arrow>
                    <IconButton size={"small"} onClick={() => window.open(event.ticket_url)}>
                        <ConfirmationNumberIcon fontSize="inherit"/>
                    </IconButton>
                </Tooltip>
            ) : null}
        </Box>
    )
}

function EventListItem({event, setSelectedEvent, scrollToForm}) {
    const [showActions, setShowActions] = React.useState(false)

    function handleOnClick() {
        setSelectedEvent(event)
        scrollToForm()
    }

    return (
        <ListItem
            onMouseOver={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            sx={{px: 0, alignItems: "flex-start", opacity: event.has_elapsed ? "0.3" : "1"}}>
            <ListItemAvatar sx={{margin: 0}}>
                <ListItemText
                    primary={dayjs(event.start_time).format('ddd D')}
                    slotProps={{primary: {fontSize: 13, fontWeight: 'bold'},}}/>
            </ListItemAvatar>

            <Avatar
                alt={event.promoter.name}
                src={event.promoter.avatar_url}
                sx={{width: 28, height: 28, mr: 1}}
            />

            <Box sx={{width: "100%"}}>
                <ListItemText sx={{m: 0, maxWidth: "250px"}}>
                    <Typography
                        variant={"body2"}
                        fontSize={"small"}>{event.title}</Typography>
                    <Link
                        color={"primary"}
                        variant={"body2"}
                        fontSize={"11px"}
                        href={`/promoters/${event.promoter.id}`}
                        underline={"hover"}>{event.promoter.name}</Link>
                </ListItemText>
                {
                    event.ticket_url || event.facebook_url ? (
                        <IconLinks event={event}/>
                    ) : null
                }
            </Box>

            {
                showActions ? (
                    <IconButton aria-label="edit" size="small" onClick={handleOnClick}>
                        <EditIcon fontSize={"inherit"}/>
                    </IconButton>
                ) : null
            }
        </ListItem>
    )
}

export const getUpcomingEvents = async () => {
    const headers = await getHeaders()
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: 'GET',
        headers: headers
    })

    return response.json()
}

export default function UpcomingEvents({setSelectedEvent, scrollToForm}) {
    const {data, isFetching} = useQuery({
        queryKey: ['upcomingEvents'],
        queryFn: getUpcomingEvents,
    })

    if (isFetching) {
        return <Loading/>
    }

    if (!data) {
        return null
    }

    const months = Object.keys(data.events)

    return (
        <Card sx={{p: 2}}>
            <Grid container spacing={3}>
                {months.map((month, index) => (
                    <Grid key={month} size={{xs: 12, md: 6, lg: 4}}>
                        <Typography variant="h6" fontWeight={"bold"}>
                            {month}
                        </Typography>

                        <List sx={{width: '100%'}} dense>
                            {data.events[month].map(event => (
                               <React.Fragment key={event.id}>
                                   <EventListItem
                                       event={event}
                                       scrollToForm={scrollToForm}
                                       setSelectedEvent={setSelectedEvent}/>
                                   <Divider component="li" sx={{my: 0.5}}/>
                               </React.Fragment>
                            ))}
                        </List>
                    </Grid>
                ))}
            </Grid>
        </Card>
    )
}