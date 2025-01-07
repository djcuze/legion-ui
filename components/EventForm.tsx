'use client'

import React, {useState} from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import ArrowSwitcherComponent from "./ArrowSwitcherComponent";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import Button from '@mui/material/Button'
import dayjs from "../utils/dayjs";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Alert, IconButton, Snackbar, SnackbarCloseReason} from "@mui/material";

export const EventForm = () => {
    const [titleError, setTitleError] = useState(false);
    const [promoterError, setPromoterError] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true)
    const [toastNotification, setToastNotification] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState("");
    const [toastSeverity, setToastSeverity] = React.useState("error");

    const start_time = dayjs().weekday(5).hour(21).minute(0).second(0)
    const end_time = dayjs().weekday(6).hour(3).minute(0).second(0)

    const [formData, setFormData] = useState({
        title: "",
        promoter: "",
        start_time,
        end_time,
    });
    const queryClient = useQueryClient()

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setToastNotification(false);
    };

    const addEvent = async (e) => {
        const response = await fetch('https://legion-events-au-platform-03eeffdb069d.herokuapp.com/events', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({event: formData})
        })
        if (!response.ok) {
            throw new Error()
        }
        return response.json()
    };

    const mutation = useMutation({
        mutationFn: addEvent,
        onSuccess: () => {
            setToastSeverity("success")
            setToastMessage("Event created successfully")
            setToastNotification(true);

            queryClient.invalidateQueries({queryKey: ['upcomingEvents']})
        },
        onError: () => {
            setToastSeverity("error")
            setToastMessage("An error occurred")
            setToastNotification(true);
        }
    })

    const handleTitleChange = (e) => {
        setFormData({...formData, title: e.target.value})
        setIsDisabled(!isFormValid())

        if (e.target.validity.valid) {
            setTitleError(false);
        } else {
            setTitleError(true);
        }
    }

    const handlePromoterChange = (e) => {
        setFormData({...formData, promoter: e.target.value})
        setIsDisabled(!isFormValid())

        if (e.target.validity.valid) {
            setPromoterError(false);
        } else {
            setPromoterError(true);
        }
    }

    function isFormValid() {
        if (titleError || promoterError) {
            return false
        }
        return true
    }

    // @ts-ignore
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <div className="w-full max-w-96 mx-auto">
                <form>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl variant="standard" sx={{width: "100%"}}>
                                <TextField
                                    variant="standard"
                                    label="Title"
                                    placeholder="Title"
                                    error={titleError}
                                    onChange={handleTitleChange}
                                    required
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl variant="standard" sx={{width: "100%"}}>
                                <TextField
                                    variant="standard"
                                    label="Promoter"
                                    placeholder="Promoter"
                                    value={formData.promoter}
                                    error={promoterError}
                                    onChange={handlePromoterChange}
                                    required
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <div className="flex items-center justify-center mb-5 gap-10">
                                <div className="flex flex-col">
                                    <Typography
                                        variant="overline"
                                        color="tertiary"
                                    >
                                        select date</Typography>
                                    <Typography
                                        variant="h6"
                                        color="tertiary">
                                        {dayjs(formData.start_time).format("ddd, MMM D")}
                                    </Typography>
                                </div>
                                <div className="flex gap-2">
                                    <Typography variant="h4" color="tertiary">
                                        {dayjs(formData.start_time).format("hh:mm")}
                                    </Typography>
                                    <Typography variant="h6" color="tertiary">
                                        {dayjs(formData.start_time).format("A")}
                                    </Typography>
                                </div>
                            </div>
                            <ArrowSwitcherComponent formData={formData} setFormData={setFormData}/>
                        </Grid>
                    </Grid>

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{float: "right", marginTop: 2}}
                        onClick={() => mutation.mutate(formData)}
                        disabled={isDisabled}
                    >
                        Submit
                    </Button>
                    <Snackbar
                        open={toastNotification}
                        autoHideDuration={6000}
                        onClose={handleClose}
                    >
                        {/* @ts-ignore */}
                        <Alert onClose={handleClose} severity={toastSeverity} variant="filled">
                            {toastMessage}
                        </Alert>
                    </Snackbar>
                </form>
            </div>
        </LocalizationProvider>
    );
};
