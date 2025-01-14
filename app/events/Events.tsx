'use client'

import Typography from "@mui/material/Typography";
import UpcomingEvents from "./UpcomingEvents";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import {EventForm} from "../../components/EventForm";
import * as React from "react";
import {useRef} from "react";
import Box from "@mui/material/Box";
import EventsThisWeek, {EventsToday, EventsThisMonth} from "./EventsThisWeek";
import {IconButton, Tab, Tabs} from "@mui/material";
import Card from "@mui/material/Card";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from '@mui/icons-material/Home'
import {navigate} from "../actions";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";

export default function Events() {
    const ref = useRef<HTMLDivElement>(null);
    const scrollToForm = () => {
        ref.current?.scrollIntoView({behavior: 'smooth'});
    };

    const [selectedEvent, setSelectedEvent] = React.useState(undefined)
    const [visibleTab, setVisibleTab] = React.useState("quarter")
    return (
        <>
            <Grid container sx={{alignItems: "center"}}>
                <Grid size={{xs: 6}}>
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        sx={{display: 'flex', alignItems: 'center', mb: 1, mt: 2}}
                    >
                        <IconButton onClick={() => navigate('/home')}>
                            <HomeIcon/>
                        </IconButton>
                        <Typography
                            onClick={() => navigate('/events')}
                            color={"primary"}
                            sx={{cursor: 'pointer'}}
                        >
                            Events
                        </Typography>
                    </Breadcrumbs>
                </Grid>

                <Grid size={{xs: 6}}>
                    <Box sx={{width: "100%"}}>
                        <Button variant={"contained"} onClick={scrollToForm} sx={{float: "right"}}>
                            Register event
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <Tabs value={visibleTab}
                  sx={{mb: 2}}
                  onChange={() => setVisibleTab(visibleTab)} aria-label="disabled tabs example">
                <Tab label="Quarter" value="quarter" onClick={() => setVisibleTab("quarter")}/>
                <Tab label="Month" value="month" onClick={() => setVisibleTab("month")}/>
                <Tab label="Week" value="week" onClick={() => setVisibleTab("week")}/>
                <Tab label="Day" value={"day"} onClick={() => setVisibleTab("day")}/>
            </Tabs>

            <Card>
                {visibleTab === "quarter" &&
                  <UpcomingEvents setSelectedEvent={setSelectedEvent} scrollToForm={scrollToForm}/>}
                {visibleTab === "month" &&
                  <EventsThisMonth setSelectedEvent={setSelectedEvent} scrollToForm={scrollToForm}/>}
                {visibleTab === "week" &&
                  <EventsThisWeek setSelectedEvent={setSelectedEvent} scrollToForm={scrollToForm}/>}
                {visibleTab === "day" && <EventsToday setSelectedEvent={setSelectedEvent} scrollToForm={scrollToForm}/>}
            </Card>

            <Divider className="font-sans" sx={{mt: 3}}>
                <Chip color="primary" label="Register an event"/>
            </Divider>

            <Box ref={ref}>
                <EventForm selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent}/>
            </Box>
        </>
    )
}