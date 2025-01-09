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

export const getUpcomingEvents = async () => {
    const headers = await getHeaders()
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: 'GET',
        headers: headers
    })

    return response.json()
}

export default function UpcomingEvents() {
    const {data, isFetching} = useQuery({
        queryKey: ['upcomingEvents'],
        queryFn: getUpcomingEvents,
    })

    if (isFetching) {
        return <Loading/>
    }

    if (data) {
        const months = Object.keys(data.events)

        return (
            <Card sx={{p: 2}}>
                    <Grid container spacing={3}>
                        {months.map((month, index) => (
                            <Grid key={month}>
                                <div key={month}>
                                    <Typography variant="h6" fontWeight={"bold"}>
                                        {month}
                                    </Typography>

                                    <List className="w-full" dense>
                                        {data.events[month].map(event => (
                                            <ListItem key={event.id} sx={{px: 0}} alignItems="flex-start">
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

                                                <ListItemText
                                                    sx={{m: 0, maxWidth: "250px"}}
                                                    primary={event.title}
                                                    secondary={event.promoter.name}
                                                    slotProps={{
                                                        primary: {fontSize: 13, fontWeight: 'medium'},
                                                        secondary: {fontSize: 11, fontWeight: 'medium'}
                                                    }}/>
                                            </ListItem>
                                        ))}
                                    </List>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </Card>
        )
    }
}