'use client'

import React, {useEffect, useState} from "react";
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
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Link from "@mui/material/Link";
import CoverPhotoUpload from "../app/events/CoverPhotoUpload";
import Divider from "@mui/material/Divider";
import Image from 'next/image'
import CustomMultiSelect from "./CustomMultiSelect";

export const EventForm = ({selectedEvent, setSelectedEvent}) => {
    const {enqueueSnackbar} = useSnackbar();
    const {data: currentUser} = useCurrentUser()
    const [isDisabled, setIsDisabled] = useState(true)
    const [isLoading, setIsLoading] = useState(false);

    const start_time = dayjs().weekday(5).hour(21).minute(0).second(0)

    const defaultFormData = {
        title: "",
        promoter_ids: [],
        start_time: start_time,
        facebook_url: "",
        ticket_url: "",
        password: "",
        cover_photo_url: ""
    }
    const [formData, setFormData] = useState(defaultFormData);
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!selectedEvent) {
            return
        }
        setFormData({
            title: selectedEvent.title,
            promoter_ids: selectedEvent.promoters.map(p => (
                {label: p.name, value: p.id}
            )),
            start_time: dayjs(selectedEvent.start_time),
            facebook_url: selectedEvent.facebook_url || "",
            ticket_url: selectedEvent.ticket_url || "",
            cover_photo_url: selectedEvent.cover_photo_url || "",
            password: ""
        })
    }, [selectedEvent])

    const noChanges = () => {
        if (!selectedEvent) {
            return false
        }
        const start_time_diff = formData.start_time.diff(dayjs(selectedEvent?.start_time))

        return (
            formData.title === selectedEvent.title &&
            // @ts-ignore
            formData.promoter_ids.map(id => id.value) === selectedEvent.promoters.map(p => p.id) &&
            formData.facebook_url === selectedEvent.facebook_url &&
            formData.ticket_url === selectedEvent.ticket_url &&
            formData.cover_photo_url === selectedEvent.cover_photo_url &&
            start_time_diff === 0
        )
    }

    function handleSubmit() {
        setIsDisabled(true)
        if (noChanges()) {
            enqueueSnackbar("You haven't made any changes", {variant: "warning", autoHideDuration: 2700})
            return
        }
        // @ts-ignore
        const promoterIds = formData.promoter_ids.map(p => p.value)
        mutation.mutate({...formData, promoter_ids: promoterIds})
    }

    const updateEvent = async (params) => {
        const headers = await getHeaders()
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${selectedEvent.id}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({event: params})
        }).then(resp => {
            if (!resp.ok) {
                return resp.json().then(err => {
                    setIsDisabled(true)
                    throw new Error(err.message)
                })
            } else {
                return resp.json()
            }
        })
    };

    const addEvent = async (e) => {
        const headers = await getHeaders()
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({event: formData})
        }).then(resp => {
            if (!resp.ok) {
                return resp.json().then(err => {
                    throw new Error(err.message)
                })
            } else {
                return resp.json()
            }
        })
    };

    const mutation = useMutation({
        mutationFn: selectedEvent ? updateEvent : addEvent,
        onSuccess: () => {
            setFormData(defaultFormData)
            selectedEvent
                ?
                enqueueSnackbar("Event updated successfully", {variant: "success", autoHideDuration: 2700})
                :
                enqueueSnackbar("Event created successfully", {variant: "success", autoHideDuration: 2700})
            setSelectedEvent(undefined)
            queryClient.invalidateQueries({queryKey: ['upcomingEvents']})
        },
        onError: (error) => {
            enqueueSnackbar(error.message, {variant: "error", autoHideDuration: 2700})
        }
    })

    function handleOnInput(e){
        setFormData({...formData, [e.target.name]: e.target.value})

        if (e.target.name === "password") {
            setIsDisabled(false)
        }

        if (e.target.name === "promoter_ids") {
            setIsDisabled(false)
        }

        if (e.target.name === "facebook_url" || e.target.name === "ticket_url" && e.target.value !== selectedEvent?.[e.target.name]) {
            setIsDisabled(false)
        }

        if (e.target.name !== "title") {
            return
        }

        if (e.target.value.length >= 4) {
            setIsDisabled(false)
        } else {
            setIsDisabled(true)
        }
    }

    function handleReset() {
        setFormData(defaultFormData)
        setSelectedEvent(undefined)
    }

    async function handleFileUpload(e) {
        if (!e.target.files) {
            throw new Error('No file selected');
        }
        setIsDisabled(true)
        setIsLoading(true)

        const file = e.target.files[0];

        await fetch(
            `/events/upload?filename=${file.name}`,
            {
                method: 'POST',
                body: file,
            }
        ).then((resp) => resp.json())
            .then((resp) => {
                setFormData({...formData, cover_photo_url: resp.url})
                enqueueSnackbar("Cover photo uploaded successfully. Be sure to save the form", {
                    variant: "success",
                    autoHideDuration: 2700
                })
                setIsLoading(false)
                setIsDisabled(false)
            })
    }

    // @ts-ignore
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <Box className="w-full max-w-96 mx-auto" sx={{mt: 5}}>
                <Box sx={{mb: 1}}>
                    <Link
                        variant="body2"
                        underline="hover"
                        component="button"
                        onClick={handleReset}>
                        Reset
                    </Link>
                </Box>
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
                                        value={formData.title}
                                        slotProps={{
                                            htmlInput: {
                                                minLength: 5,
                                                name: 'title'
                                            }
                                        }}
                                        required
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                {currentUser && <CustomMultiSelect networkId={currentUser.network_id} formData={formData} handleOnInput={handleOnInput}/>}
                            </Grid>

                            {
                                selectedEvent ? (
                                    <>
                                        <Grid item xs={12}>
                                            <FormControl variant="standard" sx={{width: "100%"}}>
                                                <TextField
                                                    variant="standard"
                                                    label="Password"
                                                    placeholder="Password"
                                                    onChange={handleOnInput}
                                                    value={formData.password}
                                                    slotProps={{
                                                        htmlInput: {
                                                            minLength: 5,
                                                            name: 'password'
                                                        }
                                                    }}
                                                    required
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl variant="standard" sx={{width: "100%"}}>
                                                <TextField
                                                    variant="standard"
                                                    label="Facebook URL"
                                                    placeholder="Facebook URL"
                                                    onChange={handleOnInput}
                                                    value={formData.facebook_url}
                                                    slotProps={{
                                                        htmlInput: {
                                                            minLength: 5,
                                                            name: 'facebook_url'
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <FormControl variant="standard" sx={{width: "100%"}}>
                                                <TextField
                                                    variant="standard"
                                                    label="Ticket URL"
                                                    placeholder="Ticket URL"
                                                    onChange={handleOnInput}
                                                    value={formData.ticket_url}
                                                    slotProps={{
                                                        htmlInput: {
                                                            minLength: 5,
                                                            name: 'ticket_url'
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography
                                                variant={"body2"}
                                                gutterBottom
                                                fontSize={"small"}
                                                color={'rgba(0, 0, 0, 0.6)'}>Cover photo</Typography>

                                            <Box className={"flex gap-2"}>
                                                <div className="flex-grow-0">
                                                    <CoverPhotoUpload
                                                        handleFileUpload={handleFileUpload}
                                                        isLoading={isLoading}
                                                        hasExistingUpload={!!formData.cover_photo_url}/>
                                                </div>
                                                {formData.cover_photo_url &&
                                                  <Image src={formData.cover_photo_url} alt="Uploaded file" width="200"
                                                         height={"100"}/>}
                                            </Box>

                                            <Divider sx={{my: 2}}/>
                                        </Grid>
                                    </>
                                ) : null
                            }

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
                                <ArrowSwitcherComponent
                                    formData={formData}
                                    setFormData={setFormData}
                                    setIsDisabled={setIsDisabled}/>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{float: "right", mt: 2}}
                                    onClick={handleSubmit}
                                    disabled={isDisabled}
                                >
                                    {selectedEvent ? "Save" : "Submit"}
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
                </form>
            </Box>
        </LocalizationProvider>
    );
};
