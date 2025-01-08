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
import {CircularProgress} from "@mui/material";
import Box from "@mui/material/Box";
import {getCookie, getHeaders} from "../actions";

export const getUpcomingEvents = async () => {
    const headers = await getHeaders()
    const response = await fetch('http://localhost:3000/events', {
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
        return (
            <Box
                display="flex"
                justifyContent="center"
                flexDirection="column"
                sx={{height: "200px"}}
                alignItems="center">
                <CircularProgress color={"inherit"}/>
                <Typography sx={{mt: 2}} variant="button">Loading</Typography>
            </Box>
        )
    }

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