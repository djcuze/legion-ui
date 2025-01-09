'use client';

import { useState } from 'react';
import type {PutBlobResult} from "@vercel/blob";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {styled} from "@mui/material";
import {getHeaders} from "../actions";
import {useQueryClient} from "@tanstack/react-query";
import {enqueueSnackbar} from "notistack";
import LoadingButton from "@mui/lab/LoadingButton";
import useCurrentUser from "../../hooks/useCurrentUser";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function AvatarUpload() {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient()
    const {data: currentUser} = useCurrentUser()
    async function handleFileUpload(event) {
        const headers = await getHeaders()

        if (!event.target.files) {
            throw new Error('No file selected');
        }

        setIsLoading(true)

        const file = event.target.files[0];

        const response = await fetch(
            `/avatar/upload?filename=${file.name}`,
            {
                method: 'POST',
                body: file,
            }
        )

        const newBlob = (await response.json()) as PutBlobResult;

        const updateProfileResponse = await fetch("https://legion-events-au-platform-03eeffdb069d.herokuapp.com/promoters/update_avatar", {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({avatar_url: newBlob.url})
        })

        if (updateProfileResponse.ok) {
            enqueueSnackbar("Avatar uploaded successfully", {variant: "success", autoHideDuration: 2700})
            queryClient.invalidateQueries({queryKey: ['currentUser']})
            queryClient.invalidateQueries({queryKey: ['upcomingEvents']})
        }
        setIsLoading(false)
    }

    return (
        <LoadingButton
            component="label"
            role={undefined}
            size="small"
            loading={isLoading}
            disabled={isLoading}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
        >
            Upload file
            <VisuallyHiddenInput
                type="file"
                onChange={handleFileUpload}
            />
        </LoadingButton>
    );
}