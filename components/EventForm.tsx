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
import {getHeaders} from "../app/actions";
import {useSnackbar} from "notistack";
import useCurrentUser from "../hooks/useCurrentUser";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

export const EventForm = () => {
    const {enqueueSnackbar} = useSnackbar();
    const {data: currentUser} = useCurrentUser()
    const [titleError, setTitleError] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true)

    const start_time = dayjs().weekday(5).hour(21).minute(0).second(0)
    const end_time = dayjs().weekday(6).hour(3).minute(0).second(0)

    const [formData, setFormData] = useState({
        title: "",
        start_time,
        end_time,
    });
    const queryClient = useQueryClient()

    const addEvent = async (e) => {
        const headers = await getHeaders()
        await fetch('http://localhost:3000/events', {
            method: "POST",
            headers: headers,
            body: JSON.stringify({event: formData})
        }).then(resp => {
            if (!resp.ok) {
                return resp.json().then(err => {throw new Error(err.message)})
            } else {
                return resp.json()
            }
        })
    };

    const mutation = useMutation({
        mutationFn: addEvent,
        onSuccess: () => {
            enqueueSnackbar("Event created successfully", {variant: "success", autoHideDuration: 2700})
            queryClient.invalidateQueries({queryKey: ['upcomingEvents']})
        },
        onError: (error) => {
            enqueueSnackbar(error.message, {variant: "error", autoHideDuration: 2700})
        }
    })

    const handleOnInput = (e) => {
        setFormData({...formData, title: e.target.value})

        if (e.target.value.length >= 4) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }
    }

    // @ts-ignore
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <Box className="w-full max-w-96 mx-auto" sx={{mt: 5}}>
                <form>
                    <Card sx={{p: 2}}>
                        <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl variant="standard" sx={{width: "100%"}}>
                                <TextField
                                    variant="standard"
                                    label="Title"
                                    placeholder="Title"
                                    onChange={handleOnInput}
                                    error={titleError}
                                    slotProps={{
                                        htmlInput: {
                                            minLength: 5,
                                        }
                                    }}
                                    required
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl variant="standard" sx={{width: "100%"}}>
                                <Tooltip
                                    placement="top"
                                    arrow
                                    slotProps={{
                                        popper: {
                                            modifiers: [
                                                {
                                                    name: 'offset',
                                                    options: {
                                                        offset: [0, -14],
                                                    },
                                                },
                                            ],
                                        },
                                    }}
                                    title="You cannot create an event for a different promoter">
                                    <TextField
                                        variant="standard"
                                        sx={{input: {cursor: "not-allowed"}}}
                                        defaultValue={currentUser?.promoter || "Promoter *"}
                                        disabled
                                        required
                                    />
                                </Tooltip>
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
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{float: "right", mt: 2}}
                                onClick={() => mutation.mutate(formData)}
                                disabled={isDisabled}
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                    </Card>
                </form>
            </Box>
        </LocalizationProvider>
    );
};
