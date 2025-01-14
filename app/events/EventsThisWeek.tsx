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
import {IconButton, Tab, Tabs} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import Tooltip from "@mui/material/Tooltip";
import EditIcon from '@mui/icons-material/Edit';
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import AvatarGroup from "@mui/material/AvatarGroup";
import {NoResults} from "../promoters/[id]/EventsList";

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

function EventListItem({event, setSelectedEvent, scrollToForm, isVisible = (event) => true}) {
    const [showActions, setShowActions] = React.useState(false)

    const AVATAR_SIZE = () => {
        switch (event.promoters.length) {
            case 1:
                return 54
            case 2:
                return 35
            default:
                return 30
        }
    }
    const AVATAR_SPACING = () => {
        switch (event.promoters.length) {
            case 1:
                return 20
            case 2:
                return 14
            default:
                return 15
        }
    }

    function handleOnClick() {
        setSelectedEvent(event)
        scrollToForm()
    }

    return (
        <ListItem
            onMouseOver={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            sx={{px: 0, alignItems: "flex-start", opacity: isVisible(event) ? 1 : 0.25}}>
            <ListItemAvatar sx={{margin: 0}}>
                <ListItemText
                    primary={dayjs(event.start_time).format('ddd D MMM')}
                    slotProps={{primary: {fontSize: 15, fontWeight: 'medium'},}}/>
                <ListItemText
                    primary={dayjs(event.start_time).format('hh:mm A')}
                    slotProps={{primary: {fontSize: 14, fontWeight: 'medium'},}}/>
            </ListItemAvatar>

            <Box sx={{width: "120px", display: "flex"}}>
                <AvatarGroup
                    max={3}
                    sx={{
                        px: 2,
                        '& .MuiAvatar-root': {
                            width: AVATAR_SIZE(),
                            height: AVATAR_SIZE(),
                            fontSize: 12
                        }
                    }}
                    renderSurplus={(surplus) => <span style={{marginLeft: "10px"}}>+{surplus}</span>}
                    spacing={AVATAR_SPACING()}>
                    {
                        event.promoters.map(promoter => (
                            <Avatar
                                key={promoter.id}
                                alt={promoter.name}
                                src={promoter.avatar_url}
                                sx={{width: AVATAR_SIZE(), height: AVATAR_SIZE()}}
                            />
                        ))
                    }
                </AvatarGroup>
            </Box>

            <Box sx={{width: "100%"}}>
                <ListItemText sx={{m: 0}}>
                    <Stack>
                        <Typography
                            variant={"body2"}
                            fontSize={14}>
                            {event.title}
                        </Typography>

                        <Box sx={{width: "100%", maxWidth: "350px"}}>
                            {
                                event.promoters.map((promoter, index) => (
                                    <Link
                                        key={promoter.id}
                                        underline="hover"
                                        href={`/promoters/${promoter.id}`}
                                        variant={"subtitle1"}
                                        fontSize={"small"}>
                                        {promoter.name}
                                        {index !== (event.promoters.length - 1) && ", "}
                                    </Link>
                                ))
                            }
                        </Box>
                    </Stack>
                    {
                        event.ticket_url || event.facebook_url ? (
                            <IconLinks event={event}/>
                        ) : null
                    }
                </ListItemText>
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

export default function EventsThisWeek({setSelectedEvent, scrollToForm}) {
    const {data, isFetching} = useQuery({
        queryKey: ['upcomingEvents'],
        queryFn: getUpcomingEvents,
    })

    if (isFetching) {
        return <Loading/>
    }

    if (!data) {
        return <NoResults />
    }

    const events =
        Object
            .values(data.events)
            .flat(1)
            // @ts-ignore
            .filter(event => dayjs(event.start_time) >= dayjs().startOf('week') && dayjs(event.start_time) <= dayjs().endOf('week'))

    return (
        <Box sx={{fontSize: "10px", minHeight: "300px", p: 2}}>
            {events.map(event => (
                <EventListItem scrollToForm={scrollToForm} setSelectedEvent={setSelectedEvent} event={event}
                    // @ts-ignore
                               key={event.id}/>))}
        </Box>
    )
}

export function EventsToday({setSelectedEvent, scrollToForm}) {
    const {data, isFetching} = useQuery({
        queryKey: ['upcomingEvents'],
        queryFn: getUpcomingEvents,
    })

    if (isFetching) {
        return <Loading/>
    }

    if (!data?.events) {
        return null
    }

    const events =
        Object
            .values(data.events)
            .flat(1)
            // @ts-ignore
            .filter(event => dayjs(event.start_time) >= dayjs().startOf('day') && dayjs(event.start_time) <= dayjs().endOf('day'))

    if (!events.length) {
        return <NoResults />
    }

    return (
        <Box sx={{fontSize: "10px", minHeight: "300px", p: 2}}>
            {events.map(event => <EventListItem scrollToForm={scrollToForm} setSelectedEvent={setSelectedEvent}
                // @ts-ignore
                                                event={event} key={event.id}/>)}
        </Box>
    )
}

export function EventsThisMonth({setSelectedEvent, scrollToForm}) {
    const {data, isFetching} = useQuery({
        queryKey: ['upcomingEvents'],
        queryFn: getUpcomingEvents,
    })

    if (isFetching) {
        return <Loading/>
    }

    if (!data?.events) {
        return <NoResults/>
    }

    const events =
        Object
            .values(data.events)
            .flat(1)
            // @ts-ignore
            .filter(event => dayjs(event.start_time) >= dayjs().startOf('month') && dayjs(event.start_time) <= dayjs().endOf('month'))

    const isVisible = (event) => dayjs(event.start_time).endOf("day") > dayjs().startOf("day");


    return (
        <Box sx={{fontSize: "10px", minHeight: "300px", p: 2}}>
            {events.map(event => <EventListItem scrollToForm={scrollToForm} setSelectedEvent={setSelectedEvent}
                                                isVisible={isVisible}
                // @ts-ignore
                                                event={event} key={event.id}/>)}
        </Box>
    )
}