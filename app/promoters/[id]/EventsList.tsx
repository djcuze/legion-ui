import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import dayjs from "../../../utils/dayjs";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import * as React from "react";
import {useQuery} from "@tanstack/react-query";
import {getHeaders} from "../../actions";
import Tooltip from "@mui/material/Tooltip";
import {IconButton, Tab, Tabs} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import Divider from "@mui/material/Divider";
import Loading from "../../../components/Loading";
import Grid from "@mui/material/Grid2";
import {useEffect, useState} from "react";

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
                    <IconButton size={"medium"} onClick={() => window.open(event.facebook_url)}>
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
                    <IconButton size={"medium"} onClick={() => window.open(event.ticket_url)}>
                        <ConfirmationNumberIcon fontSize="inherit"/>
                    </IconButton>
                </Tooltip>
            ) : null}
        </Box>
    )
}

function EventListItem({event, promoter}) {
    return (
        <ListItem
            sx={{px: 0, alignItems: "center"}}>
            <ListItemAvatar sx={{margin: 0}}>
                <ListItemText
                    primary={dayjs(event.start_time).format('ddd D MMM')}
                    slotProps={{primary: {fontSize: 18, fontWeight: 'bold'},}}/>
                <ListItemText
                    primary={dayjs(event.start_time).format('hh:mm A')}
                    slotProps={{primary: {fontSize: 14, fontWeight: 'medium'},}}/>
            </ListItemAvatar>

            <Avatar
                alt={promoter.name}
                src={event.cover_photo_url}
                sx={{width: 56, height: 56, ml: 1, mr: 2}}
            />

            <Box sx={{width: "100%"}}>
                <ListItemText sx={{m: 0}}>
                    <Typography
                        variant={"body2"}
                        fontWeight={"bold"}
                        fontSize={"medium"}>{event.title}</Typography>
                    {
                        event.ticket_url || event.facebook_url ? (
                            <IconLinks event={event}/>
                        ) : null
                    }
                </ListItemText>
            </Box>
        </ListItem>
    )
}

export const getPromoterEvents = async (promoterId) => {
    const headers = await getHeaders()
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promoters/${promoterId}/events`, {
        method: 'POST',
        headers: headers
    })

    return response.json()
}

export const getPastEvents = async (promoterId) => {
    const headers = await getHeaders()
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promoters/${promoterId}/events`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ start_time: dayjs().subtract(1, 'month'), end_time: dayjs() })
    })

    return response.json()
}

function PastEvents({promoter}) {
    const {data, isFetching} = useQuery({
        queryKey: ['promoter', promoter.id, 'pastEvents'],
        queryFn: () => getPastEvents(promoter.id),
    })

    if (isFetching) {
        return <Loading/>
    }

    if (data.events.length === 0) {
        return null
    }

    return data.events.map(event => <EventListItem promoter={promoter} event={event} key={event.id}/>)
}


function FutureEvents({promoter}) {
    const {data, isFetching} = useQuery({
        queryKey: ['promoter', promoter.id, 'events'],
        queryFn: () => getPromoterEvents(promoter.id),
    })

    if (isFetching) {
        return <Loading/>
    }

    const excludingNextUp = data.events.filter(event => dayjs(event.start_time) >= dayjs().startOf('day')).slice(1)

    if (excludingNextUp.length === 0) {
        return null
    }

    return excludingNextUp.map(event => <EventListItem promoter={promoter} event={event} key={event.id}/>)
}

export default function EventsList({promoter}) {
    const [isShowingFutureEvents, setIsShowingFutureEvents] = useState(true)

    const {data, isFetching} = useQuery({
        queryKey: ['promoter', promoter.id, 'events'],
        queryFn: () => getPromoterEvents(promoter.id),
    })

    if (isFetching) {
        return <Loading/>
    }

    const nextEvent = data.events.filter(event => dayjs(event.start_time) >= dayjs().startOf('day'))[0]

    return (
        <>
            <Typography variant="overline">Next up</Typography>
            <EventListItem promoter={promoter} event={nextEvent} key={nextEvent.id}/>

            <Divider variant="middle" sx={{mb: 2}}/>

            <Tabs value={isShowingFutureEvents ? 0 : 1}
                  sx={{mb: 2}}
                  onChange={() => setIsShowingFutureEvents(!isShowingFutureEvents)} aria-label="disabled tabs example">
                <Tab label="Future"/>
                <Tab label="Past"/>
            </Tabs>

            {
                isShowingFutureEvents
                    ? <FutureEvents promoter={promoter}/>
                    : <PastEvents promoter={promoter}/>
            }
        </>
    )
}