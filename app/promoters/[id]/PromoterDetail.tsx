'use client'

import Breadcrumbs from "@mui/material/Breadcrumbs";
import IconButton from "@mui/material/IconButton";
import {navigate} from "../../actions";
import HomeIcon from "@mui/icons-material/Home";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";

import Grid from "@mui/material/Grid2";
import {redirect} from "next/navigation";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import EventsList from "./EventsList";
import Tooltip from "@mui/material/Tooltip";

export default function PromoterDetail({promoter}) {
    return (
        <>
            <Box sx={{maxHeight: "400px", overflow: "hidden"}}>
                {
                    promoter.cover_photo_url
                        ?
                        <Image src={promoter.cover_photo_url} alt="" height="600" width="1200"/>
                        : <img src={"https://placehold.co/1200x600"} alt="" height="600" width="1200"/>
                }
            </Box>

            <Container sx={{mt: 2, width: "100%"}} disableGutters>
                <Grid
                    container
                    justifyContent={'space-between'}
                    alignItems="center">

                    <Grid size={{xs: 9, md: 6}}>
                        <Stack>
                            <Typography variant="overline">
                                Host
                            </Typography>
                            <Box className="flex gap-2 items-center">
                                <Avatar
                                    src={promoter.avatar_url}
                                    sx={{width: "90px", height: "90px"}}
                                    alt={promoter.name}/>
                                <Typography variant="h5">
                                    {promoter.name}
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>

                    <Grid size={{xs: 3, md: 6}}>
                        <Box className="flex flex-row items-center justify-end">
                            {promoter.facebook_url && (
                                <Tooltip title={`${promoter.name} on Facebook`} arrow placement={"top"}>
                                    <IconButton onClick={() => redirect(promoter.facebook_url)}>
                                        <FacebookIcon fontSize="large"/>
                                    </IconButton>
                                </Tooltip>
                            )}
                            {
                                promoter.instagram_url && (
                                    <Tooltip title={`${promoter.name} on Instagram`} arrow placement={"top"}>
                                        <IconButton onClick={() => redirect(promoter.instagram_url)}>
                                            <InstagramIcon fontSize="large"/>
                                        </IconButton>
                                    </Tooltip>
                                )
                            }
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{mt: 2}}>
                    {/*<Grid size={{xs: 12, md: 3}}>*/}
                    {/*    <Stack spacing={2}>*/}
                    {/*        <Typography variant="overline" gutterBottom>*/}
                    {/*            Organisers*/}
                    {/*        </Typography>*/}
                    {/*        {promoter.users.length > 0 ? (*/}
                    {/*            promoter.users.map((member) => {*/}
                    {/*                return (*/}
                    {/*                    <Box className="flex items-center" key={member.id}>*/}
                    {/*                        <Avatar*/}
                    {/*                            alt={member.name}*/}
                    {/*                            src={member.avatar_url}*/}
                    {/*                            sx={{width: 24, height: 24, mr: 1}}*/}
                    {/*                        />*/}
                    {/*                        {member.name}*/}
                    {/*                    </Box>*/}
                    {/*                )*/}
                    {/*            })*/}
                    {/*        ) : (*/}
                    {/*            "-"*/}
                    {/*        )}*/}
                    {/*    </Stack>*/}
                    {/*</Grid>*/}

                    <Grid size={{xs: 12}}>
                        <Stack spacing={2}>
                            <Typography variant="overline" gutterBottom>
                                About
                            </Typography>
                            <Typography variant="body1">{promoter.bio || '-'}</Typography>
                        </Stack>
                    </Grid>


                    <Grid size={{xs: 0, md: 3}} sx={{display: {xs: 'none', md: 'block'}}}>
                    </Grid>

                    <Grid size={{xs: 12, md: 9}}>
                        <EventsList promoter={promoter}/>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}