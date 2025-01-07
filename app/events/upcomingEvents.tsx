'use client'

import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import dayjs from "../../utils/dayjs";
import ListItemText from "@mui/material/ListItemText";
import {useQuery} from "@tanstack/react-query";

export const getUpcomingEvents = async () => {
    const response = await fetch('http://localhost:3000/events', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })

    return response.json()
}

export default function UpcomingEvents() {
    const {data} = useQuery({
        queryKey: ['upcomingEvents'],
        queryFn: getUpcomingEvents,
    })

    if(data) {
        const months = Object.keys(data.events)

        return (
            <div className="mt-1 px-5">
                <Grid container spacing={2}>
                    {months.map((month, index) => (
                        <Grid key={month}>
                            <div key={month}>
                                <Typography variant="h6">
                                    {month}
                                </Typography>

                                <List className="max-w-96 w-full" dense>
                                    {data.events[month].map(event => (
                                        <ListItem key={event.id}>
                                            <ListItemAvatar>
                                                <div className={'mr-5'}>
                                                    <Typography variant="button">
                                                        {dayjs(event.start_time).format('ddd D')}
                                                    </Typography>
                                                </div>
                                            </ListItemAvatar>
                                            <ListItemText primary={event.title} secondary={event.promoter}/>
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </div>
        )
    }
}