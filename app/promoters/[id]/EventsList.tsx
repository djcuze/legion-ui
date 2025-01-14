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
import {useState} from "react";
import Chip from "@mui/material/Chip";
import {styled} from '@mui/material/styles';
import Link from "@mui/material/Link";

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

export function EventListItem({event, promoter}) {
    return (
        <ListItem
            sx={{px: 0, alignItems: "flex-start"}}>
            <ListItemAvatar sx={{margin: 0, mr: 1, width: "90px"}}>
                <ListItemText
                    primary={dayjs(event.start_time).format('ddd D MMM')}
                    slotProps={{primary: {fontSize: 18, fontWeight: 'medium'},}}/>
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
                        fontWeight={"medium"}
                        fontSize={"medium"}>{event.title}</Typography>
                </ListItemText>

                {event.promoters.length > 1 && event.promoters.map((promoter, index) => (
                    <React.Fragment key={promoter.id}>
                        <Link
                            underline={"hover"}
                            key={promoter.id}
                            variant={"body2"}
                            fontWeight={"medium"}
                            href={`/promoters/${promoter.id}`}
                            fontSize={"small"}>
                            {promoter.name}
                        </Link>
                        {index !== (event.promoters.length - 1) && ", "}
                    </React.Fragment>
                ))}

                {
                    event.ticket_url || event.facebook_url ? (
                        <IconLinks event={event}/>
                    ) : null
                }
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
        body: JSON.stringify({start_time: dayjs().subtract(1, 'month'), end_time: dayjs()})
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
        return <NoResults/>
    }

    return data.events.map(event => <EventListItem promoter={promoter} event={event} key={event.id}/>)
}

function NoResults() {
    const StyledGridOverlay = styled('div')(({theme}) => ({
        display: 'flex',
        height: "300px",
        backgroundColor: theme.palette.grey[100],
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '& .no-rows-primary': {
            fill: '#3D4751',
            ...theme.applyStyles('light', {
                fill: '#AEAEAE',
            }),
        },
        '& .no-rows-secondary': {
            fill: '#1D2126',
            ...theme.applyStyles('light', {
                fill: '#D1D1D1',
            }),
        },
    }));


    return (
        <StyledGridOverlay>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width={96}
                viewBox="0 0 452 257"
                aria-hidden
                focusable="false"
            >
                <path
                    className="no-rows-primary"
                    d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
                />
                <path
                    className="no-rows-primary"
                    d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
                />
                <path
                    className="no-rows-primary"
                    d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
                />
                <path
                    className="no-rows-secondary"
                    d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
                />
            </svg>
            <Typography sx={{mt: 2}} variant="subtitle2">
                No events
            </Typography>
        </StyledGridOverlay>
    )
}

function FutureEvents({promoter}) {
    const {data, isFetching} = useQuery({
        queryKey: ['promoter', promoter.id, 'events'],
        queryFn: () => getPromoterEvents(promoter.id),
    })

    if (isFetching) {
        return <Loading/>
    }

    if (data.events.length === 0) {
        return <NoResults/>
    }

    return data.events.map(event => <EventListItem promoter={promoter} event={event} key={event.id}/>)
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
            {nextEvent && (
                <>
                    <Divider sx={{my: 3}}>
                        <Chip color="info" label={<Typography variant="button" fontSize="11px">Next up</Typography>}/>
                    </Divider>

                    <EventListItem promoter={promoter} event={nextEvent} key={nextEvent.id}/>
                </>
            )}

            <Tabs value={isShowingFutureEvents ? 0 : 1}
                  sx={{mb: 2}}
                  onChange={() => setIsShowingFutureEvents(!isShowingFutureEvents)} aria-label="disabled tabs example">
                <Tab label="Future"/>
                <Tab label="Past"/>
            </Tabs>

            <Box sx={{fontSize: "10px", minHeight: "300px"}}>
                {
                    isShowingFutureEvents
                        ? <FutureEvents promoter={promoter}/>
                        : <PastEvents promoter={promoter}/>
                }
            </Box>
        </>
    )
}