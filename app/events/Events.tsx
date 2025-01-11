'use client'

import Typography from "@mui/material/Typography";
import UpcomingEvents from "./upcomingEvents";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import {EventForm} from "../../components/EventForm";
import * as React from "react";
import {useRef} from "react";
import Box from "@mui/material/Box";

export default function Events() {
    const ref = useRef<HTMLDivElement>(null);
    const scrollToForm = () => {
        ref.current?.scrollIntoView({behavior: 'smooth'});
    };

    const [selectedEvent, setSelectedEvent] = React.useState(undefined)
    return (
        <>
            <Typography variant="overline">Events</Typography>

            <UpcomingEvents setSelectedEvent={setSelectedEvent} scrollToForm={scrollToForm} />

            <Divider className="font-sans" sx={{mt: 3}}>
                <Chip color="primary" label="Register an event"/>
            </Divider>

            <Box ref={ref}>
                <EventForm selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent}/>
            </Box>
        </>
    )
}