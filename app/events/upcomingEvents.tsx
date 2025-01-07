'use client'

import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import dayjs from "../../utils/dayjs";
import ListItemText from "@mui/material/ListItemText";
import {useQuery} from "@tanstack/react-query";
import Divider from "@mui/material/Divider";

export const getUpcomingEvents = async () => {
    const response = await fetch('https://legion-events-au-platform-03eeffdb069d.herokuapp.com/events', {
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

    if (data) {
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

                                <List className="max-w-96 w-full" dense sx={{py: 0}}>
                                    {data.events[month].map(event => (
                                        <ListItem key={event.id}>
                                            <ListItemAvatar>
                                                <ListItemText
                                                    primary={dayjs(event.start_time).format('ddd D')}
                                                    slotProps={{primary: {fontSize: 13, fontWeight: 'bold'},}}/>
                                            </ListItemAvatar>
                                            <ListItemText
                                                sx={{m: 0}}
                                                primary={event.title}
                                                secondary={event.promoter}
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
            </div>
        )
    }
}